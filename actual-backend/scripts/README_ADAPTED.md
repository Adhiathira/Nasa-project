# Adapted Backend Server - serve_adapted.py

## Overview

`serve_adapted.py` is an adapted version of the existing `serve.py` RAG backend that implements the frontend API contract for the 3D Research Graph MVP. It reuses all existing components (ChromaDB vectorstore, TinyLlama LLM, prompts) while providing a frontend-compatible REST API.

## Key Features

### 1. **Deterministic UUID Generation**
- Uses UUID v5 with a fixed namespace to generate deterministic UUIDs from paper links
- Same paper link always produces the same UUID across requests
- Namespace: `6ba7b810-9dad-11d1-80b4-00c04fd430c8`

### 2. **Paper Registry**
- Maintains global `PAPER_REGISTRY` mapping UUID → PaperInfo
- Tracks paper metadata: session_id, link, title, query, summary
- Enables UUID-based lookups for related papers and chat

### 3. **Frontend API Contract**
Implements three endpoints matching TypeScript interfaces in `frontend/src/types/api.ts`:

#### **POST /api/search**
Search for papers based on query string.

**Request:**
```json
{
  "query": "photosynthesis"
}
```

**Response:**
```json
[
  {
    "paper_id": "550e8400-e29b-41d4-a716-446655440000",
    "metadata": {
      "title": "Photosynthesis in C4 Plants",
      "summary": "This paper explores the evolutionary adaptations..."
    },
    "similarity": 0.92
  }
]
```

#### **POST /api/search_paper**
Get related papers for graph expansion.

**Request:**
```json
{
  "paper_id": "550e8400-e29b-41d4-a716-446655440000",
  "conversation": "optional context from chat"
}
```

**Response:**
```json
[
  {
    "paper_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "metadata": {
      "title": "CAM Photosynthesis: An Adaptation to Arid Environments",
      "summary": "Analysis of Crassulacean Acid Metabolism..."
    },
    "similarity": 0.73
  }
]
```

#### **POST /api/chat**
Chat about a specific paper.

**Request:**
```json
{
  "paper_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "What are the key findings?",
  "conversation_history": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

**Response:**
```json
{
  "response": "The C4 photosynthesis pathway mentioned in this paper...",
  "paper_context": {
    "title": "Photosynthesis in C4 Plants",
    "relevant_sections": ["Biochemical Pathways", "Evolutionary Advantages"]
  }
}
```

## Architecture

### Components Reused from serve.py

1. **VectorStore**: ChromaDB with HuggingFace embeddings (`sentence-transformers/all-MiniLM-L6-v2`)
2. **LLM**: TinyLlama-1.1B-Chat-v1.0 with 4-bit quantization
3. **Prompts**: `SUMMARY_PROMPT` and `PAPER_CHAT_PROMPT`
4. **Utilities**: `_fmt_snippets()`, `_distinct_by_link()`

### New Components

1. **UUID v5 Generation**: `link_to_uuid(link: str) -> str`
2. **Paper Registry**: `PAPER_REGISTRY: Dict[str, PaperInfo]`
3. **Frontend API Endpoints**: `/api/search`, `/api/search_paper`, `/api/chat`

## Running the Server

### Prerequisites
Same as `serve.py`:
- Python 3.9+
- ChromaDB index built (run `build_index.py` first)
- Dependencies installed (transformers, langchain, etc.)

### Start Server
```bash
cd /Users/delusionalmakubex/Documents/projects/nasa-hack/actual-backend/scripts
python serve_adapted.py
```

Server will start on `http://0.0.0.0:7895` (configurable via `PORT` in `config.py`)

### Environment Variables (optional)
```bash
export PORT=8000  # Change port
export LOG_LEVEL=DEBUG  # Set log level
```

## Testing

### Unit Tests
```bash
python test_serve_adapted.py
```

Verifies:
- UUID v5 generation is deterministic
- Response formats match frontend contract
- Similarity scores are in valid range (0.0-1.0)

### curl Tests

**Test Search:**
```bash
curl -X POST http://localhost:7895/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "photosynthesis"}'
```

**Test Related Papers:**
```bash
curl -X POST http://localhost:7895/api/search_paper \
  -H "Content-Type: application/json" \
  -d '{"paper_id": "7eac174f-505f-510b-ab8c-885579c0c2d7"}'
```

**Test Chat:**
```bash
curl -X POST http://localhost:7895/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "paper_id": "7eac174f-505f-510b-ab8c-885579c0c2d7",
    "message": "What are the key findings?"
  }'
```

**Health Check:**
```bash
curl http://localhost:7895/health
```

## Implementation Details

### Distance to Similarity Conversion
ChromaDB returns cosine distance (lower = more similar). We convert to similarity:
```python
similarity = 1.0 - min(distance, 1.0)
```

### Session Management
- Each search creates an internal session (UUID hex[:8])
- Sessions store: orig_query, system_summary, top3 papers, chat history
- Papers registered in `PAPER_REGISTRY` reference their session_id

### Paper Registration Flow
1. Search returns papers with links
2. Generate UUID v5 from link: `uuid.uuid5(NAMESPACE_PAPER, link)`
3. Store in registry: `PAPER_REGISTRY[uuid] = PaperInfo(...)`
4. Return paper_id (UUID) to frontend
5. Related papers and chat look up by UUID

### Error Handling
- **400**: Missing/invalid parameters (query, paper_id, message)
- **404**: paper_id not found in registry
- **500**: Internal errors (vectorstore, LLM failures)

All errors return JSON:
```json
{
  "error": "Error category",
  "message": "Human-readable description"
}
```

## Logging

Comprehensive DEBUG logging throughout:
- `[/api/search]` prefix for search endpoint logs
- `[/api/search_paper]` prefix for related papers logs
- `[/api/chat]` prefix for chat endpoint logs

Example:
```
[2025-10-05 22:45:30] DEBUG - serve_adapted - [/api/search] Received request: query='photosynthesis'
[2025-10-05 22:45:31] INFO - serve_adapted - [/api/search] Found 4 top papers
[2025-10-05 22:45:31] DEBUG - serve_adapted - [/api/search] Registered paper: uuid=7eac174f-505f-510b-ab8c-885579c0c2d7
```

## CORS Configuration

CORS is enabled for all origins during development:
```python
CORS(app, origins="*")
```

For production, restrict to frontend domain:
```python
CORS(app, origins=["http://localhost:5173", "https://your-domain.com"])
```

## Differences from serve.py

| Feature | serve.py | serve_adapted.py |
|---------|----------|------------------|
| **Endpoints** | `/search`, `/chat`, `/related` | `/api/search`, `/api/search_paper`, `/api/chat` |
| **Paper IDs** | Indexed by link string | UUID v5 from link |
| **Session Management** | Explicit session_id in requests | Internal session_id, papers tracked by UUID |
| **Response Format** | Custom format with session_id | Frontend API contract (Paper[], ChatResponse) |
| **Paper Selection** | By paper_idx or paper_link | By paper_id (UUID) |
| **Registry** | None (session-only state) | Global PAPER_REGISTRY for UUID lookups |

## File Locations

- **Script**: `/Users/delusionalmakubex/Documents/projects/nasa-hack/actual-backend/scripts/serve_adapted.py`
- **Config**: `/Users/delusionalmakubex/Documents/projects/nasa-hack/actual-backend/scripts/config.py`
- **Test**: `/Users/delusionalmakubex/Documents/projects/nasa-hack/actual-backend/scripts/test_serve_adapted.py`
- **Frontend Types**: `/Users/delusionalmakubex/Documents/projects/nasa-hack/frontend/src/types/api.ts`

## Summary of Work Completed

- **Implemented serve_adapted.py**: Adapted RAG backend with UUID v5 generation and paper registry for UUID→paper mapping
- **Implemented /api/search**: Returns Paper[] format with deterministic UUIDs, reuses RAG search and summary logic
- **Implemented /api/search_paper**: Retrieves related papers using UUID lookup and /related logic from serve.py
- **Implemented /api/chat**: Chat endpoint with conversation history support, uses UUID-based paper lookup
- **Added comprehensive logging**: DEBUG logs throughout for request/response tracing
- **Created test suite**: test_serve_adapted.py validates UUID generation, determinism, and response formats
- **Verified response contracts**: All endpoints match frontend TypeScript interfaces exactly
