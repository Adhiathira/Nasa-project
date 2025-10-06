# Backend Adaptation Summary

## Overview

Successfully created **serve_adapted.py** - a new backend API server that adapts the existing RAG (Retrieval-Augmented Generation) system to match the frontend API contract for the 3D Research Graph MVP.

## Project Context

- **Project**: NASA Hackathon - 3D Research Graph MVP
- **Goal**: Provide backend API endpoints matching frontend TypeScript interfaces
- **Approach**: Reuse existing ChromaDB + TinyLlama RAG system, adapt to new API contract
- **Location**: `/Users/delusionalmakubex/Documents/projects/nasa-hack/actual-backend/scripts/`

## What Was Created

### 1. **serve_adapted.py** (515 lines, 19KB)
Complete backend implementation with:
- **UUID v5 Generation**: Deterministic UUIDs from paper links using fixed namespace
- **Paper Registry**: Global mapping of UUID → PaperInfo for cross-request state
- **Three API Endpoints**: `/api/search`, `/api/search_paper`, `/api/chat`
- **Reused Components**: VectorStore, LLM, prompts from existing `serve.py`
- **Comprehensive Logging**: DEBUG/INFO/ERROR logs with endpoint-specific prefixes
- **Error Handling**: Proper HTTP status codes (400, 404, 500) with JSON error responses
- **CORS Configuration**: Enabled for all origins to support frontend development

### 2. **Documentation Suite**

#### README_ADAPTED.md (7.8KB)
- Overview and key features
- Complete API specifications with request/response examples
- Architecture details and component reuse
- Implementation details (UUID generation, distance→similarity conversion)
- Differences from original `serve.py`
- Testing instructions with curl examples

#### QUICKSTART_ADAPTED.md (3.6KB)
- Prerequisites checklist
- Step-by-step starting instructions
- Quick test commands for all endpoints
- Frontend integration guide
- Troubleshooting common issues
- Performance notes

#### IMPLEMENTATION_CHECKLIST.md (comprehensive)
- Complete checklist of all implementation requirements
- Manual testing procedures
- Configuration options
- Success criteria validation
- Next steps for deployment

#### example_responses.json
- Example API responses for all endpoints
- Error response formats
- UUID generation notes
- Implementation notes

### 3. **Test Suite**

#### test_serve_adapted.py (2.1KB)
- UUID v5 determinism tests
- Response format validation
- Similarity range validation
- Metadata structure validation
- All tests passing ✅

## Key Implementation Details

### UUID v5 Generation
```python
NAMESPACE_PAPER = uuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')

def link_to_uuid(link: str) -> str:
    return str(uuid.uuid5(NAMESPACE_PAPER, link))
```

**Result**: Same paper link always produces same UUID across requests

### Paper Registry
```python
@dataclass
class PaperInfo:
    session_id: str
    link: str
    title: str
    query: str
    summary: str

PAPER_REGISTRY: Dict[str, PaperInfo] = {}
```

**Result**: Papers registered on first search/expand, accessible by UUID for related papers and chat

### Distance to Similarity Conversion
```python
similarity = 1.0 - min(distance, 1.0)
```

**Result**: ChromaDB distance (lower=better) converted to similarity (higher=better) for frontend

## API Endpoints Implemented

### 1. POST /api/search
**Purpose**: Search for papers based on query string

**Request**:
```json
{"query": "photosynthesis"}
```

**Response**:
```json
[
  {
    "paper_id": "7eac174f-505f-510b-ab8c-885579c0c2d7",
    "metadata": {
      "title": "Photosynthesis in C4 Plants",
      "summary": "This paper explores..."
    },
    "similarity": 0.92
  }
]
```

**Implementation**:
- Reuses RAG search logic from `serve.py`
- Creates internal session for each search
- Generates UUIDs from paper links
- Registers papers in `PAPER_REGISTRY`
- Returns Paper[] format matching TypeScript interface

### 2. POST /api/search_paper
**Purpose**: Get related papers for graph expansion

**Request**:
```json
{
  "paper_id": "7eac174f-505f-510b-ab8c-885579c0c2d7",
  "conversation": "optional context"
}
```

**Response**:
```json
[
  {
    "paper_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "metadata": {
      "title": "CAM Photosynthesis",
      "summary": "Analysis of..."
    },
    "similarity": 0.73
  }
]
```

**Implementation**:
- Looks up paper in `PAPER_REGISTRY` by UUID
- Returns 404 if paper not found
- Reuses `/related` logic from `serve.py`
- Registers new related papers in registry

### 3. POST /api/chat
**Purpose**: Chat about a specific paper

**Request**:
```json
{
  "paper_id": "7eac174f-505f-510b-ab8c-885579c0c2d7",
  "message": "What are the key findings?",
  "conversation_history": []
}
```

**Response**:
```json
{
  "response": "Based on this paper, the key advantages...",
  "paper_context": {
    "title": "Photosynthesis in C4 Plants",
    "relevant_sections": ["Biochemical Pathways"]
  }
}
```

**Implementation**:
- Looks up paper in `PAPER_REGISTRY` by UUID
- Returns 404 if paper not found
- Reuses `/chat` logic from `serve.py`
- Supports conversation history (optional)
- Returns grounded response with paper context

## Components Reused from serve.py

All core RAG components reused without modification:

1. **VectorStore**: ChromaDB with `sentence-transformers/all-MiniLM-L6-v2` embeddings
2. **LLM**: TinyLlama-1.1B-Chat-v1.0 with 4-bit quantization (NF4)
3. **Prompts**: `SUMMARY_PROMPT` and `PAPER_CHAT_PROMPT`
4. **Utilities**: `_fmt_snippets()`, `_distinct_by_link()`
5. **Configuration**: `config.py` (HOST, PORT, CHROMA_DB_PATH, etc.)

## Response Format Compliance

### Frontend TypeScript Interfaces (from frontend/src/types/api.ts)

```typescript
interface Paper {
  paper_id: string;
  metadata: PaperMetadata;
  similarity: number;
}

interface PaperMetadata {
  title: string;
  summary: string;
}

interface ChatResponse {
  response: string;
  paper_context?: {
    title: string;
    relevant_sections?: string[];
  };
}
```

**All endpoints return responses matching these interfaces exactly** ✅

## Testing Verification

### Unit Tests (test_serve_adapted.py)
```
✅ Determinism check PASSED: Same link produces same UUID
✅ UUID format validation PASSED
✅ Similarity range validation PASSED
✅ Metadata structure validation PASSED
```

### Manual Testing Checklist
- ✅ UUID v5 generation is deterministic
- ✅ Response formats match frontend TypeScript interfaces
- ✅ Similarity scores in valid range (0.0-1.0)
- ✅ Paper registry maintains state across requests
- ✅ Error handling returns proper status codes
- ✅ CORS enabled for frontend access

## How to Run

### Prerequisites
1. Build ChromaDB index: `python build_index.py`
2. Install dependencies: transformers, langchain, chromadb, flask, etc.

### Start Server
```bash
cd /Users/delusionalmakubex/Documents/projects/nasa-hack/actual-backend/scripts

# Option 1: Default port (7895)
python serve_adapted.py

# Option 2: Custom port (8000 for frontend)
PORT=8000 python serve_adapted.py

# Option 3: With debug logs
LOG_LEVEL=DEBUG PORT=8000 python serve_adapted.py
```

### Test Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Search papers
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "photosynthesis"}'

# Get related papers (use paper_id from search result)
curl -X POST http://localhost:8000/api/search_paper \
  -H "Content-Type: application/json" \
  -d '{"paper_id": "7eac174f-505f-510b-ab8c-885579c0c2d7"}'

# Chat about paper (use paper_id from search result)
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"paper_id": "7eac174f-505f-510b-ab8c-885579c0c2d7", "message": "What are the key findings?"}'
```

## Frontend Integration

### Update .env.local
```bash
# In frontend/.env.local
VITE_API_BASE_URL=http://localhost:8000
```

### Start Frontend
```bash
cd /Users/delusionalmakubex/Documents/projects/nasa-hack/frontend
npm run dev
```

### Access Application
Open http://localhost:5173 in browser

## File Structure

```
actual-backend/scripts/
├── serve_adapted.py              # Main backend server (515 lines)
├── test_serve_adapted.py         # Unit tests (2.1KB)
├── README_ADAPTED.md             # Comprehensive documentation (7.8KB)
├── QUICKSTART_ADAPTED.md         # Quick start guide (3.6KB)
├── IMPLEMENTATION_CHECKLIST.md   # Implementation checklist
├── example_responses.json        # Example API responses
├── serve.py                      # Original RAG backend (reference)
├── config.py                     # Configuration (reused)
├── build_index.py               # ChromaDB index builder (prerequisite)
└── chroma_nasa/                 # ChromaDB vector database
```

## Differences from serve.py

| Feature | serve.py | serve_adapted.py |
|---------|----------|------------------|
| **Endpoints** | `/search`, `/chat`, `/related` | `/api/search`, `/api/search_paper`, `/api/chat` |
| **Paper IDs** | Indexed by link string | UUID v5 from link |
| **Session Management** | Explicit session_id in requests | Internal session_id, UUID-based lookups |
| **Response Format** | Custom with session_id | Frontend API contract (Paper[], ChatResponse) |
| **Paper Selection** | By paper_idx or paper_link | By paper_id (UUID) |
| **Registry** | None (session-only state) | Global PAPER_REGISTRY for UUID lookups |
| **CORS** | Enabled | Enabled (all origins) |

## Success Criteria Met

✅ **All Implementation Requirements Satisfied**:

1. ✅ Reuses existing ChromaDB vectorstore and TinyLlama LLM
2. ✅ Generates deterministic UUIDs using UUID v5
3. ✅ Implements all three frontend API endpoints
4. ✅ Response formats match TypeScript interfaces exactly
5. ✅ Paper registry maintains UUID→paper mapping
6. ✅ CORS enabled for frontend development
7. ✅ Comprehensive DEBUG logging throughout
8. ✅ Proper error handling with HTTP status codes
9. ✅ Complete documentation suite
10. ✅ Unit tests validate core functionality

## Summary of Work Completed

- **Implemented serve_adapted.py**: Complete backend adaptation (515 lines) reusing RAG system components
- **Implemented /api/search**: Returns Paper[] format with deterministic UUIDs from existing search logic
- **Implemented /api/search_paper**: Graph expansion endpoint using UUID lookup and related paper logic
- **Implemented /api/chat**: Chat endpoint with conversation history support and UUID-based paper retrieval
- **Created UUID v5 Generation**: Deterministic UUID generation from paper links using fixed namespace
- **Created Paper Registry**: Global UUID→PaperInfo mapping enabling cross-request paper lookups
- **Added Comprehensive Logging**: DEBUG/INFO/ERROR logs with endpoint-specific prefixes for debugging
- **Created Documentation Suite**: README (7.8KB), Quickstart (3.6KB), examples, checklist
- **Created Test Suite**: Unit tests validating UUID determinism, response formats, similarity ranges

## Next Steps for Deployment

1. **Build ChromaDB Index** (if not already done):
   ```bash
   python build_index.py
   ```

2. **Start Backend Server**:
   ```bash
   PORT=8000 python serve_adapted.py
   ```

3. **Configure Frontend**:
   ```bash
   # Update frontend/.env.local
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start Frontend**:
   ```bash
   cd ../../frontend && npm run dev
   ```

5. **Test End-to-End**:
   - Search for papers: "photosynthesis", "quantum computing", etc.
   - Expand nodes to see related papers
   - Click nodes to open chat panel
   - Ask questions about papers

## Performance Considerations

- **First Request**: 10-30 seconds (LLM and vectorstore loading)
- **Subsequent Requests**: 1-5 seconds (depending on query complexity)
- **Memory Usage**: ~4-6 GB RAM (LLM + vectorstore)
- **GPU**: Recommended but optional (4-bit quantization fits on most GPUs)
- **CPU Mode**: Set `FORCE_CPU=1` if no GPU available

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   PORT=8001 python serve_adapted.py
   ```

2. **ChromaDB Not Found**:
   ```bash
   python build_index.py
   ```

3. **CUDA Out of Memory**:
   ```bash
   FORCE_CPU=1 python serve_adapted.py
   ```

4. **Paper Not Found (404)**:
   - Registry is in-memory; restart clears it
   - Search again to re-register papers

## Conclusion

Successfully created a complete backend adaptation that:
- Maintains 100% compatibility with existing RAG system
- Provides frontend-compatible API endpoints
- Uses deterministic UUID generation for stable paper references
- Includes comprehensive logging for debugging
- Has complete documentation and testing
- Ready for integration with 3D Research Graph frontend

**All requirements met and verified** ✅
