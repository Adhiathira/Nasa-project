# Quick Start Guide - serve_adapted.py

## Prerequisites

1. **ChromaDB Index**: Ensure ChromaDB index is built
   ```bash
   python build_index.py
   ```

2. **Dependencies**: Install Python dependencies
   ```bash
   pip install flask flask-cors torch transformers langchain langchain-community chromadb sentence-transformers bitsandbytes accelerate
   ```

## Starting the Server

### Option 1: Default Port (7895)
```bash
cd /Users/delusionalmakubex/Documents/projects/nasa-hack/actual-backend/scripts
python serve_adapted.py
```

### Option 2: Custom Port (8000 for frontend)
```bash
cd /Users/delusionalmakubex/Documents/projects/nasa-hack/actual-backend/scripts
PORT=8000 python serve_adapted.py
```

### Option 3: With Custom Log Level
```bash
LOG_LEVEL=INFO PORT=8000 python serve_adapted.py
```

## Server Endpoints

Once running, the server provides:

- **GET /health** - Health check
- **POST /api/search** - Search papers
- **POST /api/search_paper** - Get related papers
- **POST /api/chat** - Chat about a paper

## Quick Test Commands

### 1. Health Check
```bash
curl http://localhost:7895/health
```

Expected: `{"status": "ok"}`

### 2. Search Papers
```bash
curl -X POST http://localhost:7895/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "photosynthesis"}'
```

Expected: JSON array of papers with `paper_id`, `metadata`, `similarity`

### 3. Get Related Papers (use paper_id from search result)
```bash
curl -X POST http://localhost:7895/api/search_paper \
  -H "Content-Type: application/json" \
  -d '{"paper_id": "YOUR_PAPER_UUID_HERE"}'
```

### 4. Chat About Paper (use paper_id from search result)
```bash
curl -X POST http://localhost:7895/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "paper_id": "YOUR_PAPER_UUID_HERE",
    "message": "What are the key findings?"
  }'
```

## Frontend Integration

Update frontend `.env.local`:
```bash
VITE_API_BASE_URL=http://localhost:7895
```

Or if running on port 8000:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Troubleshooting

### Server Won't Start
- **Issue**: Port already in use
- **Solution**: Use a different port with `PORT=8001 python serve_adapted.py`

### ChromaDB Not Found
- **Issue**: `chroma_nasa` directory not found
- **Solution**: Run `python build_index.py` first to create the index

### CUDA Out of Memory
- **Issue**: GPU memory exhausted
- **Solution**: The LLM uses 4-bit quantization, but if still failing, try:
  ```bash
  FORCE_CPU=1 python serve_adapted.py
  ```

### Paper Not Found (404)
- **Issue**: `paper_id` from previous session not found
- **Solution**: The server uses in-memory registry. Restart clears registry. Search again to register papers.

## Performance Notes

- **First Request**: Slow (~10-30 seconds) due to LLM and vectorstore loading
- **Subsequent Requests**: Faster (~1-5 seconds depending on query complexity)
- **Memory Usage**: ~4-6 GB RAM for LLM + vectorstore
- **GPU**: Recommended but optional (4-bit quantization fits on most GPUs)

## Logging

Logs show detailed flow:
```
[2025-10-05 22:45:30] INFO - serve_adapted - Loading embeddings: sentence-transformers/all-MiniLM-L6-v2
[2025-10-05 22:45:35] INFO - serve_adapted - Loading LLM: TinyLlama/TinyLlama-1.1B-Chat-v1.0 (4-bit NF4)
[2025-10-05 22:46:00] INFO - serve_adapted - Starting adapted backend server on http://0.0.0.0:7895
```

Set `LOG_LEVEL=DEBUG` for more detailed logs.

## Next Steps

1. Start the backend: `python serve_adapted.py`
2. Start the frontend: `cd ../../frontend && npm run dev`
3. Open browser: `http://localhost:5173`
4. Search for papers and test the 3D visualization!
