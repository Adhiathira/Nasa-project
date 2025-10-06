import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.resolve()
# ChromaDB is in the parent directory of scripts/
CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", str(BASE_DIR.parent / "chroma_nasa"))
DATA_CSV = os.getenv("DATA_CSV", str(BASE_DIR / "data" / "papers.csv"))

# Text splitting
TEXT_CHUNK_SIZE = int(os.getenv("TEXT_CHUNK_SIZE", "500"))
TEXT_CHUNK_OVERLAP = int(os.getenv("TEXT_CHUNK_OVERLAP", "50"))

# Embeddings
EMBED_MODEL = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

# LLM
LLM_MODEL_ID = os.getenv("LLM_MODEL_ID", "TinyLlama/TinyLlama-1.1B-Chat-v1.0")

# Server
HOST = os.getenv("HOST", "0.0.0.0")
# PORT is for original serve.py (default 7895)
PORT = int(os.getenv("PORT", "7895"))
# API_PORT is for serve_adapted.py - the frontend-compatible API server (default 8000)
API_PORT = int(os.getenv("API_PORT", "8000"))

# CORS settings for frontend
# CORS_ORIGINS is comma-separated list of allowed origins
# Default "*" allows all origins (development mode)
# For production, set to specific origins: "http://localhost:5173,https://yourdomain.com"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

# Retrival defaults
TOP_K = int(os.getenv("TOP_K", "4"))
POOL_K = int(os.getenv("POOL_K", "12"))
DIST_THRESHOLD = float(os.getenv("DIST_THRESHOLD", "0.30"))  # cosine *distance* (lower = better)

# Misc
DEVICE = "cuda" if os.getenv("FORCE_CPU", "0") != "1" and \
                 (os.getenv("CUDA_VISIBLE_DEVICES") or "").strip() != "" else "cpu"
