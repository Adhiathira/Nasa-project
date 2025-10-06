# 3D Research Graph Mock Backend API

Mock REST API service providing test data for the 3D Research Graph visualization frontend. This service generates consistent mock research paper data for testing graph visualization and interaction features.

## Features

- **Mock Paper Search**: Returns relevant research papers based on search queries
- **Related Papers**: Provides related papers for graph expansion functionality
- **Paper Chat**: Mock AI-style responses about specific papers
- **Deterministic Data**: Consistent results for the same queries
- **Comprehensive Logging**: DEBUG-level logging throughout the application
- **CORS Enabled**: Ready for frontend integration
- **Input Validation**: Request validation using Pydantic models

## Quick Start

### Installation

1. Install Python dependencies:

```bash
cd backend
pip install -r requirements.txt
```

### Running the Service

Start the server using uvicorn:

```bash
uvicorn app:app --reload
```

Or run directly with Python:

```bash
python app.py
```

The API will be available at: `http://localhost:8000`

### Configuration

Environment variables can be configured in the `.env` file:

```
LOG_LEVEL=DEBUG    # Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
HOST=0.0.0.0       # Server host
PORT=8000          # Server port
```

## API Endpoints

### Base URL
`http://localhost:8000`

### Health Check

**GET** `/health`

Returns service health status.

```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "3D Research Graph Mock API"
}
```

---

### 1. Search Papers

**POST** `/api/search`

Search for research papers based on a query string. Returns 5-10 mock papers relevant to the query.

**Request Body:**
```json
{
  "query": "photosynthesis"
}
```

**Example curl command:**
```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "photosynthesis"}'
```

**Response (200 OK):**
```json
[
  {
    "paper_id": "a1b2c3d4-e5f6-7890-ab12-34567890abcd",
    "metadata": {
      "title": "C4 Photosynthesis in Tropical Grasses: Mechanisms and Evolution",
      "summary": "This paper explores the evolutionary adaptations of C4 photosynthesis in tropical grasses, examining the biochemical pathways that concentrate CO2 around Rubisco to reduce photorespiration..."
    },
    "similarity": 0.92
  },
  {
    "paper_id": "b2c3d4e5-f6a7-8901-bc23-4567890abcde",
    "metadata": {
      "title": "Light-Dependent Reactions in Thylakoid Membranes",
      "summary": "A comprehensive review of the light-dependent reactions occurring in the thylakoid membranes of chloroplasts..."
    },
    "similarity": 0.87
  }
]
```

**Supported Topics:**
- photosynthesis
- quantum computing
- machine learning
- climate change
- neuroscience
- artificial intelligence
- genetics

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid request",
  "message": "Query parameter is required and must be a non-empty string"
}
```

---

### 2. Get Related Papers

**POST** `/api/search_paper`

Retrieve papers related to a specific paper for graph expansion. Returns 3-7 related papers.

**Request Body:**
```json
{
  "paper_id": "a1b2c3d4-e5f6-7890-ab12-34567890abcd",
  "conversation": "optional context from chat"
}
```

**Example curl command:**
```bash
curl -X POST http://localhost:8000/api/search_paper \
  -H "Content-Type: application/json" \
  -d '{"paper_id": "a1b2c3d4-e5f6-7890-ab12-34567890abcd"}'
```

**Response (200 OK):**
```json
[
  {
    "paper_id": "c3d4e5f6-a7b8-9012-cd34-567890abcdef",
    "metadata": {
      "title": "CAM Photosynthesis: Adaptation to Arid Environments",
      "summary": "Analysis of Crassulacean Acid Metabolism as an evolutionary response to water scarcity..."
    },
    "similarity": 0.73
  },
  {
    "paper_id": "d4e5f6a7-b8c9-0123-de45-67890abcdef1",
    "metadata": {
      "title": "Rubisco: Structure, Function, and Evolutionary Engineering",
      "summary": "Detailed examination of ribulose-1,5-bisphosphate carboxylase/oxygenase (Rubisco)..."
    },
    "similarity": 0.68
  }
]
```

**Error Response (404 Not Found):**
```json
{
  "error": "Not found",
  "message": "Paper with specified ID not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid request",
  "message": "paper_id must be a valid UUID format"
}
```

---

### 3. Chat About Paper

**POST** `/api/chat`

Send a message about a specific paper and receive a mock AI-generated response.

**Request Body:**
```json
{
  "paper_id": "a1b2c3d4-e5f6-7890-ab12-34567890abcd",
  "message": "What are the key findings of this paper?",
  "conversation_history": [
    {
      "role": "user",
      "content": "Tell me about this paper"
    },
    {
      "role": "assistant",
      "content": "This paper explores C4 photosynthesis mechanisms..."
    }
  ]
}
```

**Example curl command:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "paper_id": "a1b2c3d4-e5f6-7890-ab12-34567890abcd",
    "message": "What are the key findings of this paper?"
  }'
```

**Response (200 OK):**
```json
{
  "response": "The key findings of this research indicate significant contributions to the field. The researchers employed rigorous experimental design to validate their findings regarding C4 photosynthesis mechanisms and evolutionary adaptations...",
  "paper_context": {
    "title": "C4 Photosynthesis in Tropical Grasses: Mechanisms and Evolution",
    "relevant_sections": ["C4 plants", "carbon fixation", "evolution"]
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Not found",
  "message": "Paper with specified ID not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid request",
  "message": "Message cannot be empty or whitespace only"
}
```

---

## Testing Workflow

### 1. Start the Server
```bash
uvicorn app:app --reload
```

Watch for the startup message:
```
3D Research Graph Mock API Starting...
API URL: http://0.0.0.0:8000
Log Level: DEBUG
Available Endpoints:
  POST /api/search - Search for research papers
  POST /api/search_paper - Get related papers
  POST /api/chat - Chat about a paper
```

### 2. Test Search Endpoint

Search for photosynthesis papers:
```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "photosynthesis"}'
```

Search for quantum computing papers:
```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "quantum computing"}'
```

### 3. Test Related Papers Endpoint

First, get a paper ID from the search results, then:
```bash
curl -X POST http://localhost:8000/api/search_paper \
  -H "Content-Type: application/json" \
  -d '{"paper_id": "YOUR_PAPER_ID_HERE"}'
```

### 4. Test Chat Endpoint

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "paper_id": "YOUR_PAPER_ID_HERE",
    "message": "What are the main contributions of this research?"
  }'
```

### 5. Check Logs

The server logs will show DEBUG-level output for all requests:
```
2025-10-05 12:00:00 - __main__ - DEBUG - Received search request - Query: 'photosynthesis'
2025-10-05 12:00:00 - __main__ - DEBUG - Validating search request...
2025-10-05 12:00:00 - __main__ - INFO - Searching for papers matching query: 'photosynthesis'
2025-10-05 12:00:00 - __main__ - DEBUG - Generated 8 mock papers
2025-10-05 12:00:00 - __main__ - INFO - Search completed successfully - Returned 8 papers
```

## Mock Data

The service provides consistent mock data across topics:

- **Photosynthesis**: 8 papers covering C4, CAM, Rubisco, chloroplasts, etc.
- **Quantum Computing**: 7 papers on qubits, algorithms, error correction, etc.
- **Machine Learning**: 7 papers on deep learning, transformers, GANs, etc.
- **Climate Change**: 6 papers on temperature trends, sea level, ocean acidification
- **Neuroscience**: 6 papers on neuroplasticity, brain networks, neurotransmitters
- **Artificial Intelligence**: 6 papers on LLMs, AI safety, multi-modal learning
- **Genetics**: 6 papers on CRISPR, epigenetics, single-cell sequencing

### Data Characteristics

- **Deterministic UUIDs**: Same query returns same paper IDs
- **Realistic Content**: Detailed titles and summaries for each topic
- **Similarity Scores**: Range from 0.50 to 0.99
- **Paper Relationships**: Related papers are from same or related topics
- **Topic Clustering**: Papers grouped by research area

## Development

### Project Structure
```
backend/
├── app.py              # FastAPI application with endpoints
├── mock_data.py        # Mock data generator
├── requirements.txt    # Python dependencies
├── .env               # Environment configuration
└── README.md          # This file
```

### Adding New Topics

To add new research topics, edit `mock_data.py`:

1. Add topic to `TOPICS` dictionary with papers list
2. Include title, summary, and keywords for each paper
3. Update `_get_related_topics()` to define topic relationships

### Logging Levels

Adjust logging verbosity by changing `LOG_LEVEL` in `.env`:

- **DEBUG**: Detailed trace information (development)
- **INFO**: Key operations and successes (production)
- **WARNING**: Important warnings
- **ERROR**: Error messages
- **CRITICAL**: Critical system failures

## API Documentation

Interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## CORS Configuration

The service allows requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev port)
- `*` (All origins for development)

To restrict CORS in production, modify the `CORS_ORIGINS` list in `app.py`.

## Dependencies

- **FastAPI 0.109.0**: Modern web framework for building APIs
- **Uvicorn 0.27.0**: ASGI server for running FastAPI
- **Pydantic 2.5.0**: Data validation using Python type hints
- **python-dotenv 1.0.0**: Environment variable management

## Troubleshooting

### Port Already in Use
If port 8000 is occupied, change the port in `.env`:
```
PORT=8001
```

### Import Errors
Ensure all dependencies are installed:
```bash
pip install -r requirements.txt
```

### CORS Errors
Check that the frontend URL is included in `CORS_ORIGINS` in `app.py`.

### No Papers Returned
The mock data generator matches queries to topics. Try searching for:
- "photosynthesis"
- "quantum computing"
- "machine learning"
- "climate change"
- "neuroscience"
- "artificial intelligence"
- "genetics"

## Production Deployment

For production deployment:

1. Set `LOG_LEVEL=INFO` in `.env`
2. Configure specific CORS origins (remove `*`)
3. Use a production ASGI server like Gunicorn with Uvicorn workers
4. Enable HTTPS
5. Add rate limiting middleware
6. Consider containerizing with Docker

## License

This is a mock service for development and testing purposes.
