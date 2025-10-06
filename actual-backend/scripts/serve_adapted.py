#!/usr/bin/env python3
"""
Adapted Backend Server for 3D Research Graph MVP
Adapts the existing RAG system to match the frontend API contract.

This server:
- Reuses existing ChromaDB vectorstore and TinyLlama LLM from serve.py
- Generates deterministic UUIDs from paper links using UUID v5
- Implements frontend API contract: /api/search, /api/search_paper, /api/chat
- Maintains PAPER_REGISTRY for UUID->paper mapping across requests
"""
import os
import uuid
import logging
from typing import Dict, Any, List, Optional
from dataclasses import dataclass

from flask import Flask, request, jsonify
from flask_cors import CORS

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline, BitsAndBytesConfig

from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

from config import (
    HOST, PORT, API_PORT, CHROMA_DB_PATH, EMBED_MODEL, LLM_MODEL_ID,
    TOP_K, POOL_K
)

# ---------------- Logging Setup ----------------
logging.basicConfig(
    level=logging.DEBUG,
    format='[%(asctime)s] %(levelname)s - %(name)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('serve_adapted')

# ---------------- UUID Namespace ----------------
# UUID v5 namespace for deterministic paper UUID generation
NAMESPACE_PAPER = uuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')

def link_to_uuid(link: str) -> str:
    """
    Generate deterministic UUID from paper link using UUID v5.
    Same link always produces same UUID.

    Args:
        link: Paper link/identifier

    Returns:
        UUID string in lowercase with hyphens
    """
    return str(uuid.uuid5(NAMESPACE_PAPER, link))

# ---------------- Paper Registry ----------------
@dataclass
class PaperInfo:
    """Information about a paper stored in registry"""
    session_id: str
    link: str
    title: str
    query: str
    summary: str

# Global registry mapping UUID -> PaperInfo
PAPER_REGISTRY: Dict[str, PaperInfo] = {}

# Session storage (reuse from serve.py architecture)
SESSIONS: Dict[str, Dict[str, Any]] = {}

# ---------------- Utilities (from serve.py) ----------------
def _fmt_snippets(docs, max_chars=400) -> str:
    """Format document snippets for LLM prompts"""
    rows = []
    for d in docs:
        title = d.metadata.get("Title") or d.metadata.get("title") or "Untitled"
        link  = d.metadata.get("Link")  or d.metadata.get("link")  or "N/A"
        text  = (d.page_content or "").replace("\n", " ")[:max_chars]
        rows.append(f"- {title} | {link}\n  {text}")
    return "\n".join(rows) if rows else "(no snippets)"

def _distinct_by_link(docs):
    """Remove duplicate documents by link"""
    seen = set()
    out = []
    for d in docs:
        link = d.metadata.get("Link") or d.metadata.get("link")
        if not link or link in seen:
            continue
        seen.add(link)
        out.append(d)
    return out

# ---------------- Prompts (from serve.py) ----------------
SUMMARY_PROMPT = PromptTemplate.from_template("""
You are an expert NASA literature assistant.
Given the user's query and the retrieved snippets, write a crisp 4–6 sentence summary
covering the key ideas that directly answer or scope the question. If information is missing, say so.
Avoid speculation.

User Query:
{query}

Retrieved Snippets:
{snippets}

Concise summary:
""")

PAPER_CHAT_PROMPT = PromptTemplate.from_template("""
You are discussing ONE paper only. Use ONLY the provided paper snippets.
If the answer is not present, say so clearly and do not speculate.

Context so far:
- Original Query: {orig_query}
- System Summary: {system_summary}

Paper Title: {paper_title}
Paper Link:  {paper_link}

Paper Snippets:
{snippets}

User message:
{message}

Grounded answer:
""")

# ---------------- Load VectorStore ----------------
logger.info(f"Loading embeddings: {EMBED_MODEL}")
embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)

logger.info(f"Attaching Chroma at: {CHROMA_DB_PATH}")
vectorstore = Chroma(
    collection_name="nasa_docs",
    embedding_function=embeddings,
    persist_directory=CHROMA_DB_PATH,
)

# ---------------- Load LLM (TinyLlama) ----------------
# On macOS (Apple Silicon), skip 4-bit quantization since bitsandbytes requires CUDA
import platform
is_macos = platform.system() == "Darwin"

if is_macos:
    logger.info(f"Loading LLM: {LLM_MODEL_ID} (fp16 on MPS - macOS)")
    model = AutoModelForCausalLM.from_pretrained(
        LLM_MODEL_ID,
        torch_dtype=torch.float16,
        device_map="mps",
        trust_remote_code=True,
        low_cpu_mem_usage=True,
    )
else:
    logger.info(f"Loading LLM: {LLM_MODEL_ID} (4-bit NF4)")
    quant_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=False,
    )
    model = AutoModelForCausalLM.from_pretrained(
        LLM_MODEL_ID,
        quantization_config=quant_config,
        device_map="auto",
        trust_remote_code=True,
    )
tokenizer = AutoTokenizer.from_pretrained(LLM_MODEL_ID, use_fast=True)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

gen_pipe = pipeline(
    task="text-generation",
    model=model,
    tokenizer=tokenizer,
    temperature=1.0,
    max_new_tokens=256,
    repetition_penalty=1.05,
)
from langchain.llms import HuggingFacePipeline as _HFPipeline
llm = _HFPipeline(pipeline=gen_pipe)

logger.info("LLM and vectorstore loaded successfully")

# ---------------- Flask App ----------------
app = Flask(__name__)
CORS(app, origins="*")  # Allow all origins for development

@app.get("/health")
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok"})

@app.post("/api/search")
def api_search():
    """
    Search for research papers based on query.

    Frontend API Contract:
    Request: {"query": "string"}
    Response: [{"paper_id": "uuid", "metadata": {"title": "string", "summary": "string"}, "similarity": number}]
    """
    try:
        body = request.get_json(force=True) or {}
        query = (body.get("query") or "").strip()

        logger.debug(f"[/api/search] Received request: query='{query}'")

        if not query:
            logger.warning("[/api/search] Missing query parameter")
            return jsonify({"error": "Invalid request", "message": "Query parameter is required and must be a non-empty string"}), 400

        # Reuse logic from serve.py /search endpoint
        k_top = int(body.get("k_top", TOP_K))
        pool_k = int(body.get("pool_k", POOL_K))

        logger.debug(f"[/api/search] Performing similarity search: k_top={k_top}, pool_k={pool_k}")

        # 1) Pool for summary
        pool = vectorstore.similarity_search_with_score(query, k=pool_k)
        pool_docs = _distinct_by_link([d for d, _ in pool])
        snippets = _fmt_snippets(pool_docs)

        logger.debug(f"[/api/search] Retrieved {len(pool_docs)} distinct documents for summary")

        # 2) Generate summary
        llm_output = LLMChain(llm=llm, prompt=SUMMARY_PROMPT).run(
            {"query": query, "snippets": snippets}
        ).strip()

        # Extract only the generated summary text (after "Concise summary:")
        # The LLM often repeats the prompt, so we extract just the answer
        if "Concise summary:" in llm_output:
            summary = llm_output.split("Concise summary:")[-1].strip()
        else:
            # If the delimiter is not found, take the last part after the snippets
            # This handles cases where LLM generates text without repeating the prompt
            summary = llm_output.split("Retrieved Snippets:")[-1].strip() if "Retrieved Snippets:" in llm_output else llm_output

        logger.info(f"[/api/search] Generated summary: {summary[:100]}...")

        # 3) Get top papers by distance (lower=better), distinct by link
        raw_top = vectorstore.similarity_search_with_score(query, k=max(k_top*3, k_top))
        picked, used = [], set()
        for d, dist in raw_top:
            title = d.metadata.get("Title") or d.metadata.get("title") or "Untitled"
            link = d.metadata.get("Link") or d.metadata.get("link") or f"N/A-{len(used)}"
            if link not in used:
                picked.append({"title": title, "link": link, "distance": float(dist)})
                used.add(link)
            if len(picked) == k_top:
                break

        logger.info(f"[/api/search] Found {len(picked)} top papers")

        # 4) Create session internally
        session_id = uuid.uuid4().hex[:8]
        SESSIONS[session_id] = {
            "orig_query": query,
            "system_summary": summary,
            "top3": picked,
            "history": []
        }

        logger.debug(f"[/api/search] Created session: {session_id}")

        # 5) Convert to frontend format and register papers
        papers = []
        for paper in picked:
            # Generate deterministic UUID from link
            paper_uuid = link_to_uuid(paper["link"])

            # Store in paper registry
            PAPER_REGISTRY[paper_uuid] = PaperInfo(
                session_id=session_id,
                link=paper["link"],
                title=paper["title"],
                query=query,
                summary=summary
            )

            logger.debug(f"[/api/search] Registered paper: uuid={paper_uuid}, link={paper['link']}")

            # Convert distance to similarity (lower distance = higher similarity)
            similarity = 1.0 - min(paper["distance"], 1.0)

            papers.append({
                "paper_id": paper_uuid,
                "metadata": {
                    "title": paper["title"],
                    "summary": summary[:2000]  # Limit to 2000 chars
                },
                "similarity": round(similarity, 2)
            })

        logger.info(f"[/api/search] Returning {len(papers)} papers")
        return jsonify(papers)

    except Exception as e:
        logger.error(f"[/api/search] Error: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error", "message": "Failed to process search request"}), 500

@app.post("/api/search_paper")
def api_search_paper():
    """
    Retrieve papers related to a specific paper (for graph expansion).

    Frontend API Contract:
    Request: {"paper_id": "uuid", "conversation": "optional string"}
    Response: [{"paper_id": "uuid", "metadata": {"title": "string", "summary": "string"}, "similarity": number}]
    """
    try:
        body = request.get_json(force=True) or {}
        paper_id = (body.get("paper_id") or "").strip()
        conversation = body.get("conversation", "")

        logger.debug(f"[/api/search_paper] Received request: paper_id={paper_id}, conversation={conversation[:50] if conversation else 'None'}...")

        # Validate UUID format
        if not paper_id:
            logger.warning("[/api/search_paper] Missing paper_id parameter")
            return jsonify({"error": "Invalid request", "message": "paper_id is required and must be a valid UUID"}), 400

        try:
            uuid.UUID(paper_id)  # Validate UUID format
        except ValueError:
            logger.warning(f"[/api/search_paper] Invalid UUID format: {paper_id}")
            return jsonify({"error": "Invalid request", "message": "paper_id must be a valid UUID"}), 400

        # Look up paper in registry
        if paper_id not in PAPER_REGISTRY:
            logger.warning(f"[/api/search_paper] Paper not found: {paper_id}")
            return jsonify({"error": "Not found", "message": "Paper with specified ID not found"}), 404

        paper_info = PAPER_REGISTRY[paper_id]
        session_id = paper_info.session_id
        link = paper_info.link
        title = paper_info.title

        logger.debug(f"[/api/search_paper] Found paper: title='{title}', link={link}")

        # Reuse logic from serve.py /related endpoint
        k_related = int(body.get("k_related", 5))
        seed_k = int(body.get("seed_k", 8))

        logger.debug(f"[/api/search_paper] Finding related papers: k_related={k_related}, seed_k={seed_k}")

        # Build a seed from selected paper chunks
        try:
            base_docs = vectorstore.similarity_search(title, k=seed_k, filter={"Link": link})
        except Exception:
            pool = vectorstore.similarity_search_with_score(title, k=seed_k*2)
            base_docs = [d for d, _ in pool if (d.metadata.get("Link") or d.metadata.get("link")) == link][:seed_k]

        seed_text = " ".join([(d.page_content or "")[:400] for d in base_docs]) or title

        logger.debug(f"[/api/search_paper] Built seed text from {len(base_docs)} chunks")

        # Search for related papers
        neighs = vectorstore.similarity_search_with_score(seed_text, k=k_related+10)
        related = []
        used = {link}

        for d, dist in neighs:
            lnk = d.metadata.get("Link") or d.metadata.get("link") or ""
            if lnk and lnk not in used:
                ttl = d.metadata.get("Title") or d.metadata.get("title") or "Untitled"
                related.append({"title": ttl, "link": lnk, "distance": float(dist)})
                used.add(lnk)
            if len(related) >= k_related:
                break

        logger.info(f"[/api/search_paper] Found {len(related)} related papers")

        # Convert to frontend format and register new papers
        papers = []
        for rel_paper in related:
            # Generate deterministic UUID from link
            rel_uuid = link_to_uuid(rel_paper["link"])

            # Register if not already in registry
            if rel_uuid not in PAPER_REGISTRY:
                # Generate summary for new paper (use title as summary for now)
                PAPER_REGISTRY[rel_uuid] = PaperInfo(
                    session_id=session_id,
                    link=rel_paper["link"],
                    title=rel_paper["title"],
                    query=paper_info.query,  # Use original query
                    summary=rel_paper["title"]  # Use title as summary
                )
                logger.debug(f"[/api/search_paper] Registered new paper: uuid={rel_uuid}, link={rel_paper['link']}")

            # Convert distance to similarity
            similarity = 1.0 - min(rel_paper["distance"], 1.0)

            papers.append({
                "paper_id": rel_uuid,
                "metadata": {
                    "title": rel_paper["title"],
                    "summary": PAPER_REGISTRY[rel_uuid].summary[:2000]
                },
                "similarity": round(similarity, 2)
            })

        logger.info(f"[/api/search_paper] Returning {len(papers)} related papers")
        return jsonify(papers)

    except Exception as e:
        logger.error(f"[/api/search_paper] Error: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error", "message": "Failed to process search_paper request"}), 500

@app.post("/api/chat")
def api_chat():
    """
    Chat about a specific paper.

    Frontend API Contract:
    Request: {"paper_id": "uuid", "message": "string", "conversation_history": [{"role": "user|assistant", "content": "string"}]}
    Response: {"response": "string", "paper_context": {"title": "string", "relevant_sections": ["string"]}}
    """
    try:
        body = request.get_json(force=True) or {}
        paper_id = (body.get("paper_id") or "").strip()
        message = (body.get("message") or "").strip()
        conversation_history = body.get("conversation_history", [])

        logger.debug(f"[/api/chat] Received request: paper_id={paper_id}, message='{message[:50]}...', history_len={len(conversation_history)}")

        # Validate parameters
        if not paper_id:
            logger.warning("[/api/chat] Missing paper_id parameter")
            return jsonify({"error": "Invalid request", "message": "paper_id is required"}), 400

        if not message:
            logger.warning("[/api/chat] Missing message parameter")
            return jsonify({"error": "Invalid request", "message": "message is required"}), 400

        try:
            uuid.UUID(paper_id)  # Validate UUID format
        except ValueError:
            logger.warning(f"[/api/chat] Invalid UUID format: {paper_id}")
            return jsonify({"error": "Invalid request", "message": "paper_id must be a valid UUID"}), 400

        # Look up paper in registry
        if paper_id not in PAPER_REGISTRY:
            logger.warning(f"[/api/chat] Paper not found: {paper_id}")
            return jsonify({"error": "Not found", "message": "Paper with specified ID not found"}), 404

        paper_info = PAPER_REGISTRY[paper_id]
        session_id = paper_info.session_id
        link = paper_info.link
        title = paper_info.title

        logger.debug(f"[/api/chat] Found paper: title='{title}', link={link}")

        # Get session
        if session_id not in SESSIONS:
            logger.warning(f"[/api/chat] Session not found, creating new session: {session_id}")
            SESSIONS[session_id] = {
                "orig_query": paper_info.query,
                "system_summary": paper_info.summary,
                "top3": [{"title": title, "link": link}],
                "history": []
            }

        sess = SESSIONS[session_id]

        # Reuse logic from serve.py /chat endpoint
        k_chunks = int(body.get("k_chunks", 8))

        logger.debug(f"[/api/chat] Retrieving paper chunks: k_chunks={k_chunks}")

        # Restrict to this paper's chunks by Link metadata
        try:
            retriever = vectorstore.as_retriever(
                search_type="similarity",
                search_kwargs={"k": k_chunks, "filter": {"Link": link}}
            )
            docs = retriever.get_relevant_documents(message)
        except Exception:
            pool = vectorstore.similarity_search_with_score(message, k=k_chunks*3)
            docs = [d for d, _ in pool if (d.metadata.get("Link") or d.metadata.get("link")) == link][:k_chunks]

        logger.debug(f"[/api/chat] Retrieved {len(docs)} relevant chunks")

        snippets = _fmt_snippets(docs, max_chars=450)

        # Generate answer using LLM
        llm_output = LLMChain(llm=llm, prompt=PAPER_CHAT_PROMPT).run({
            "orig_query": sess["orig_query"],
            "system_summary": sess["system_summary"],
            "paper_title": title,
            "paper_link": link,
            "snippets": snippets,
            "message": message
        }).strip()

        # Extract only the generated answer (after "Grounded answer:")
        # The LLM often repeats the prompt, so we extract just the answer
        if "Grounded answer:" in llm_output:
            answer = llm_output.split("Grounded answer:")[-1].strip()
        else:
            # Fallback: extract text after user message section
            answer = llm_output.split("User message:")[-1].strip() if "User message:" in llm_output else llm_output

        logger.info(f"[/api/chat] Generated answer: {answer[:100]}...")

        # Update session history
        sess["history"].append(("user", message))
        sess["history"].append(("assistant", answer))

        # Extract relevant sections from grounding documents
        relevant_sections = list(set([
            d.metadata.get("Title") or d.metadata.get("title") or "Untitled"
            for d in docs
        ]))[:3]  # Limit to top 3 unique sections

        response = {
            "response": answer,
            "paper_context": {
                "title": title,
                "relevant_sections": relevant_sections
            }
        }

        logger.info("[/api/chat] Chat response generated successfully")
        return jsonify(response)

    except Exception as e:
        logger.error(f"[/api/chat] Error: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error", "message": "Failed to process chat request"}), 500

if __name__ == "__main__":
    logger.info(f"Starting adapted backend server on http://{HOST}:{API_PORT}")
    logger.info("Available endpoints:")
    logger.info("  GET  /health - Health check")
    logger.info("  POST /api/search - Search for papers")
    logger.info("  POST /api/search_paper - Get related papers")
    logger.info("  POST /api/chat - Chat about a paper")
    app.run(host=HOST, port=API_PORT, debug=False, use_reloader=False)
