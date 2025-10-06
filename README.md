# 3D Research Graph MVP

An interactive 3D visualization platform for exploring NASA research papers and their relationships. Built with React, Three.js, and a RAG-powered backend.

## 💡 Vision: Human-Machine Collaboration in Research

We believe humans and machines should work together in the future. Currently, we have two extremes of search:

1. **Google Search**: Designed for everyone, prioritizing simplicity and ease of use for the general public
2. **LLM Chat-based Search**: Where we expect the AI to do everything autonomously

**We believe the sweet spot exists in the middle** — where humans and machines collaborate effectively.

While this collaborative approach may be challenging to implement for the general population, **researchers represent an ideal subset of users** who possess the domain knowledge to meaningfully augment LLMs. They can guide the exploration, make informed decisions about relevance, and connect insights that AI might miss.

**That's why we're building a context-aware search engine** where researchers maintain control of their discovery process. By visualizing relationships between papers in 3D space, researchers can:

- **Choose their own path** through the research landscape
- **Understand connections** between different papers visually
- **Leverage AI assistance** for summaries and insights without losing agency
- **Build knowledge graphs** that reflect their unique research journey

This isn't just search — it's **collaborative knowledge discovery**.

## 📹 Product Demo

**Watch the full product demonstration:**

https://github.com/user-attachments/assets/863de073-319d-4730-ad9d-0553ebc41687

## 🚀 Features

- **Interactive 3D Graph**: Visualize research papers as 3D nodes in space using `3d-force-graph`
- **Semantic Search**: Search NASA research papers using natural language queries
- **Relationship Exploration**: Expand nodes to discover related papers
- **AI-Powered Chat**: Ask questions about individual papers using RAG (Retrieval-Augmented Generation)
- **Intelligent Connections**: Edge thickness represents similarity scores between papers
- **Color-Coded Expansions**: Each expansion session gets a unique color for easy tracking

## 🏗️ Architecture

### Frontend
- **Framework**: React + TypeScript + Vite
- **3D Engine**: `3d-force-graph` (Three.js-based)
- **State Management**: Zustand
- **API Integration**: TanStack Query (React Query)
- **Styling**: TailwindCSS
- **Platform**: Desktop-only (Chrome, Edge, Safari)

### Backend
- **Framework**: Flask (Python)
- **Vector Database**: ChromaDB with `sentence-transformers/all-MiniLM-L6-v2` embeddings
- **LLM**: TinyLlama-1.1B-Chat-v1.0 (fp16 on MPS for macOS)
- **RAG Pipeline**: LangChain for retrieval and generation

## 📦 Deployment

### Prerequisites
- **Frontend**: Node.js 22+ and npm
- **Backend**: Python 3.10+ and pip

### Option 1: Docker (Recommended for Frontend)

#### Frontend with Docker
```bash
cd frontend
docker-compose up
```

The frontend will be available at `http://localhost:5173`

#### Backend (Manual)
```bash
cd actual-backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
API_PORT=8000 python scripts/serve_adapted.py
```

The backend will be available at `http://localhost:8000`

### Option 2: Local Development (Frontend Alternative)

#### Frontend (Development Mode)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### Backend (Same as Above)
Follow the backend setup instructions from Option 1.

### Environment Configuration

#### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000
```

#### Backend (.env.local)
The backend uses configuration from `actual-backend/scripts/config.py`. Default settings:
- API Port: 8000
- ChromaDB Path: `./chroma_nasa`
- Embedding Model: `sentence-transformers/all-MiniLM-L6-v2`
- LLM Model: `TinyLlama/TinyLlama-1.1B-Chat-v1.0`

## 🔌 API Endpoints

The backend provides three main endpoints:

### POST `/api/search`
Search research papers by query.

**Request:**
```json
{
  "query": "photosynthesis in space"
}
```

**Response:**
```json
{
  "summary": "AI-generated summary of search results",
  "papers": [
    {
      "paper_id": "uuid-v5",
      "metadata": {
        "title": "Paper Title",
        "summary": "Paper summary",
        "link": "https://..."
      },
      "similarity": 0.87
    }
  ]
}
```

### POST `/api/search_paper`
Find papers related to a specific paper.

**Request:**
```json
{
  "paper_id": "uuid-v5",
  "conversation": "optional context string"
}
```

**Response:**
```json
{
  "papers": [
    {
      "paper_id": "uuid-v5",
      "metadata": {
        "title": "Related Paper Title",
        "summary": "Related paper summary",
        "link": "https://..."
      },
      "similarity": 0.73
    }
  ]
}
```

### POST `/api/chat`
Chat about a specific paper using RAG.

**Request:**
```json
{
  "paper_id": "uuid-v5",
  "message": "What are the key findings?"
}
```

**Response:**
```json
{
  "response": "AI-generated answer based on paper content",
  "paper_context": {
    "title": "Paper Title",
    "relevant_sections": ["Section 1", "Section 2"]
  }
}
```

## 🎯 Usage Flow

1. **Search**: Enter a research topic (e.g., "photosynthesis", "Mars exploration")
2. **Explore 3D Graph**:
   - Rotate, zoom, and pan the 3D visualization
   - Hover over nodes to see paper titles
   - Click nodes to view details
3. **Expand**: Click "Expand" on any paper to discover related research
4. **Chat**: Click "Chat" to ask questions about a specific paper
5. **Reset**: Click the reset button to start a new search

## 📚 Project Structure

```
nasa-hack/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── store/              # Zustand state management
│   │   ├── types/              # TypeScript interfaces
│   │   └── services/           # API integration
│   ├── Dockerfile              # Frontend container config
│   └── docker-compose.yml      # Docker orchestration
├── actual-backend/             # Python RAG backend
│   ├── scripts/
│   │   ├── serve_adapted.py    # Main API server
│   │   ├── build_index.py      # ChromaDB indexing
│   │   └── config.py           # Configuration
│   ├── chroma_nasa/            # Vector database
│   ├── data/                   # Research papers dataset
│   └── requirements.txt        # Python dependencies
├── project-documentation/      # Technical documentation
└── videos/                     # Product demo videos
```

## 🛠️ Development

### Backend Data Indexing
If you need to rebuild the ChromaDB index with new papers:

```bash
cd actual-backend
source .venv/bin/activate
python scripts/build_index.py --csv data/papers.csv --db ./chroma_nasa
```

### Frontend Development
```bash
cd frontend
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

### Backend Development
```bash
cd actual-backend
source .venv/bin/activate
API_PORT=8000 python scripts/serve_adapted.py
```

## 📝 Technical Documentation

For detailed technical specifications, see:
- [Project Overview](./project-documentation/project-overview.md)
- [Technical Specifications](./project-documentation/technical-specs.md)
- [Architecture](./project-documentation/architecture.md)
- [Backend Adaptation Summary](./actual-backend/BACKEND_ADAPTATION_SUMMARY.md)

## 🐛 Recent Fixes

- ✅ Fixed `/api/search` endpoint to return clean summaries (no prompt text)
- ✅ Fixed `/api/chat` endpoint to return clean responses (no internal prompts)
- ✅ All endpoints now fully compliant with frontend TypeScript interfaces

See [CHAT_FIX_SUMMARY.md](./CHAT_FIX_SUMMARY.md) and [FIX_SUMMARY.md](./FIX_SUMMARY.md) for details.

## 🎨 UI/UX Features

- **Cosmic Background**: Black (#000000) with faint blue glow
- **3D Nodes**: Spheres with subtle outer glow
- **Smart Edges**: Color-coded by expansion session, width by similarity
- **Smooth Camera**: Fluid zoom, pan, and rotation transitions
- **Detail Panel**: Frosted-glass card with paper information
- **Chat Interface**: Clean two-column message layout

## 🚨 Known Limitations

- **Desktop Only**: Not optimized for mobile devices
- **LLM Quality**: TinyLlama (1.1B parameters) has limited capabilities compared to larger models
- **No Authentication**: Demo version, no user accounts or persistence
- **Local Only**: Not configured for production deployment

## 📄 License

This is a NASA hackathon project for demonstration purposes.

## 🤝 Contributing

This is an MVP built for rapid prototyping. For development guidelines and contribution process, see [CLAUDE.md](./CLAUDE.md).
