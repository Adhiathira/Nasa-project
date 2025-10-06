# Technical Specifications

## API Specifications

### Base Configuration
- **Base URL**: Configured via environment variable `VITE_API_BASE_URL`
- **Default Development URL**: `http://localhost:8000`
- **Protocol**: HTTP/HTTPS with REST architectural style
- **Content-Type**: `application/json`
- **Accept**: `application/json`
- **CORS**: Enabled for cross-origin requests from frontend

### API Endpoints

#### 1. Search Papers Endpoint
**POST** `/api/search`

Searches for research papers based on a query string and returns a list of relevant papers.

**Request:**
```http
POST /api/search
Content-Type: application/json

{
  "query": "string"  // Required: Search query for research papers (e.g., "photosynthesis", "quantum computing")
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "paper_id": "string",     // UUID: Unique identifier for the paper
    "metadata": {
      "title": "string",      // Paper title
      "summary": "string"     // Short summary or abstract of the paper
    },
    "similarity": number      // Float: Similarity score between 0 and 1 (e.g., 0.87)
  }
]
```

**Response Example:**
```json
[
  {
    "paper_id": "550e8400-e29b-41d4-a716-446655440000",
    "metadata": {
      "title": "Photosynthesis in C4 Plants: Mechanisms and Evolution",
      "summary": "This paper explores the evolutionary adaptations of C4 photosynthesis and its efficiency advantages in warm climates."
    },
    "similarity": 0.92
  },
  {
    "paper_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "metadata": {
      "title": "Light-Dependent Reactions in Photosynthesis",
      "summary": "A comprehensive review of the light-dependent reactions occurring in the thylakoid membranes of chloroplasts."
    },
    "similarity": 0.87
  }
]
```

**Error Responses:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid request",
  "message": "Query parameter is required and must be a non-empty string"
}
```

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "Internal server error",
  "message": "Failed to process search request"
}
```

#### 2. Search Related Papers Endpoint
**POST** `/api/search_paper`

Retrieves papers related to a specific paper, used for expanding the graph visualization.

**Request:**
```http
POST /api/search_paper
Content-Type: application/json

{
  "paper_id": "string",        // Required: UUID of the paper to find related papers for
  "conversation": "string"     // Optional: Context from chat conversation to influence related paper selection
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "paper_id": "string",     // UUID: Unique identifier for the related paper
    "metadata": {
      "title": "string",      // Paper title
      "summary": "string"     // Short summary or abstract of the paper
    },
    "similarity": number      // Float: Similarity score to the source paper (0-1)
  }
]
```

**Response Example:**
```json
[
  {
    "paper_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "metadata": {
      "title": "CAM Photosynthesis: An Adaptation to Arid Environments",
      "summary": "Analysis of Crassulacean Acid Metabolism as an evolutionary response to water scarcity."
    },
    "similarity": 0.73
  },
  {
    "paper_id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    "metadata": {
      "title": "Rubisco: Structure, Function, and Engineering",
      "summary": "Detailed examination of the most abundant protein on Earth and its role in carbon fixation."
    },
    "similarity": 0.68
  }
]
```

**Error Responses:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid request",
  "message": "paper_id is required and must be a valid UUID"
}
```

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "Not found",
  "message": "Paper with specified ID not found"
}
```

#### 3. Chat Endpoint
**POST** `/api/chat`

Handles chat messages for a specific paper node, providing contextual conversation about the research.

**Request:**
```http
POST /api/chat
Content-Type: application/json

{
  "paper_id": "string",        // Required: UUID of the paper being discussed
  "message": "string",         // Required: User's message or question
  "conversation_history": [    // Optional: Previous messages for context
    {
      "role": "user" | "assistant",
      "content": "string"
    }
  ]
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "response": "string",        // Assistant's response to the user's message
  "paper_context": {           // Optional: Additional paper context used in response
    "title": "string",
    "relevant_sections": ["string"]
  }
}
```

**Response Example:**
```json
{
  "response": "The C4 photosynthesis pathway mentioned in this paper is indeed more efficient in hot climates. It concentrates CO2 around Rubisco, reducing photorespiration that typically occurs at high temperatures.",
  "paper_context": {
    "title": "Photosynthesis in C4 Plants: Mechanisms and Evolution",
    "relevant_sections": ["Biochemical Pathways", "Evolutionary Advantages"]
  }
}
```

## Data Models

### Paper Object
```typescript
interface Paper {
  paper_id: string;           // UUID v4 format
  metadata: PaperMetadata;
  similarity: number;         // Range: 0.0 to 1.0
}

interface PaperMetadata {
  title: string;              // Max length: 500 characters
  summary: string;            // Max length: 2000 characters
  // Additional fields may be added in future versions:
  // authors?: string[];
  // publication_date?: string;
  // journal?: string;
  // doi?: string;
}
```

### Graph Node Data Structure
```typescript
interface GraphNode {
  id: string;                 // paper_id
  name: string;               // Paper title
  summary: string;            // Paper summary
  group?: number;             // Expansion group identifier for coloring
  x?: number;                 // 3D position coordinate
  y?: number;                 // 3D position coordinate
  z?: number;                 // 3D position coordinate
  fx?: number;                // Fixed x position (for pinned nodes)
  fy?: number;                // Fixed y position
  fz?: number;                // Fixed z position
}
```

### Graph Edge Data Structure
```typescript
interface GraphEdge {
  source: string;             // Source paper_id
  target: string;             // Target paper_id
  value: number;              // Similarity score (0-1), affects edge width
  color?: string;             // Hex color for expansion session
  expandSessionId?: string;   // Unique identifier for the expansion that created this edge
}
```

### Frontend State Structure
```typescript
interface AppState {
  // Search state
  searchQuery: string;
  isSearching: boolean;

  // Graph data
  nodes: GraphNode[];
  edges: GraphEdge[];

  // UI state
  selectedNode: string | null;
  expandedNodes: Set<string>;
  chatSessions: Map<string, ChatSession>;

  // Visualization settings
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  };

  // Session management
  expandSessions: Map<string, {
    sessionId: string;
    color: string;
    timestamp: number;
  }>;
}

interface ChatSession {
  paperId: string;
  messages: ChatMessage[];
  isOpen: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
```

## Authentication & Security

### Current Implementation (MVP)
- **No Authentication**: The MVP operates without user authentication or authorization
- **Open Access**: All endpoints are publicly accessible without API keys
- **Session Management**: No user sessions; all state is maintained client-side

### Security Measures
- **Input Validation**:
  - Query strings sanitized and length-limited (max 500 characters)
  - UUIDs validated against proper format
  - Message content length limited (max 5000 characters)

- **Rate Limiting** (Planned):
  - 60 requests per minute per IP address
  - 10 concurrent expand requests per client

- **CORS Configuration**:
  ```python
  # Backend CORS settings
  CORS_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative dev port
    # Production origins to be added
  ]
  ```

- **Error Handling**:
  - Generic error messages to prevent information leakage
  - Detailed errors logged server-side only
  - Stack traces never exposed to clients

### Future Security Enhancements
- JWT-based authentication for user accounts
- API key management for third-party integrations
- Rate limiting per user account
- Request signing for sensitive operations
- WebSocket authentication for real-time features

## Error Handling

### HTTP Status Codes
| Code | Meaning | Usage |
|------|---------|--------|
| 200 | OK | Successful request with data returned |
| 201 | Created | Resource successfully created (future use) |
| 400 | Bad Request | Invalid request parameters or format |
| 404 | Not Found | Requested resource (paper) not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error during processing |
| 503 | Service Unavailable | Backend service temporarily unavailable |

### Error Response Format
```json
{
  "error": "string",          // Error category (e.g., "Validation Error")
  "message": "string",        // Human-readable error description
  "code": "string",           // Optional: Machine-readable error code
  "details": {}               // Optional: Additional error context
}
```

### Client-Side Error Handling
```typescript
// Example error handling in TanStack Query
const { data, error, isLoading } = useQuery({
  queryKey: ['search', query],
  queryFn: async () => {
    const response = await fetch(`${API_BASE_URL}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Search failed');
    }

    return response.json();
  },
  retry: 3,
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
});
```

## Performance Requirements

### Response Time Targets
- **Search Endpoint**: < 500ms for up to 50 results
- **Related Papers Endpoint**: < 300ms for up to 20 results
- **Chat Endpoint**: < 1000ms for response generation

### Frontend Performance
- **Initial Load**: < 3 seconds on standard broadband
- **3D Rendering**: Maintain 30+ FPS with up to 500 nodes
- **Interaction Latency**: < 100ms for user interactions

### Optimization Strategies
- **API Response Caching**:
  - Search results cached for 5 minutes
  - Related papers cached per paper_id
  - TanStack Query handles client-side caching

- **Bundle Optimization**:
  - Code splitting for lazy loading
  - Tree shaking to eliminate unused code
  - Dynamic imports for 3D visualization library

- **3D Rendering Optimization**:
  - Level-of-detail (LOD) for distant nodes
  - Frustum culling for off-screen elements
  - Instanced rendering for similar geometries

### Resource Limits
- **Maximum Nodes**: 1000 nodes in visualization
- **Maximum Edges**: 5000 edges between nodes
- **Payload Size**: Maximum 10MB response size
- **Concurrent Requests**: 10 simultaneous API calls

## WebSocket Specifications (Future)

### Real-time Features (Planned)
```typescript
// WebSocket connection for future real-time features
interface WebSocketMessage {
  type: 'node_update' | 'chat_message' | 'collaboration';
  payload: any;
  timestamp: number;
}

// Connection endpoint: ws://localhost:8000/ws
// Authentication: Via query parameter or initial handshake
```

## Development & Testing

### API Testing with curl

**Test Search Endpoint:**
```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "photosynthesis"}'
```

**Test Related Papers:**
```bash
curl -X POST http://localhost:8000/api/search_paper \
  -H "Content-Type: application/json" \
  -d '{"paper_id": "550e8400-e29b-41d4-a716-446655440000"}'
```

**Test Chat Endpoint:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "paper_id": "550e8400-e29b-41d4-a716-446655440000",
    "message": "What are the key findings of this paper?"
  }'
```

### Mock Data Generation
The backend mock service should generate consistent test data:

```python
# Example mock data generator structure
import uuid
import random

def generate_mock_papers(query: str, count: int = 10):
    """Generate mock paper data for testing"""
    topics = {
        "photosynthesis": [
            "C4 Plants", "CAM Metabolism", "Light Reactions",
            "Carbon Fixation", "Chloroplast Structure"
        ],
        "quantum": [
            "Quantum Entanglement", "Superposition",
            "Quantum Computing", "Wave Functions"
        ]
    }

    papers = []
    for i in range(count):
        paper = {
            "paper_id": str(uuid.uuid4()),
            "metadata": {
                "title": f"{random.choice(topics.get(query, ['Research']))} Study {i+1}",
                "summary": f"This paper explores aspects of {query}..."
            },
            "similarity": round(random.uniform(0.5, 0.99), 2)
        }
        papers.append(paper)

    return sorted(papers, key=lambda x: x['similarity'], reverse=True)
```

## Integration Requirements

### Frontend Integration
```typescript
// API service configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Example API service
class ResearchAPIService {
  async searchPapers(query: string): Promise<Paper[]> {
    const response = await fetch(`${API_CONFIG.baseURL}/api/search`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ query })
    });
    return response.json();
  }

  async getRelatedPapers(paperId: string, conversation?: string): Promise<Paper[]> {
    const response = await fetch(`${API_CONFIG.baseURL}/api/search_paper`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ paper_id: paperId, conversation })
    });
    return response.json();
  }

  async sendChatMessage(paperId: string, message: string): Promise<ChatResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}/api/chat`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ paper_id: paperId, message })
    });
    return response.json();
  }
}
```

### 3D Visualization Integration
```typescript
// 3d-force-graph integration
import ForceGraph3D from '3d-force-graph';

const graphData = {
  nodes: papers.map(paper => ({
    id: paper.paper_id,
    name: paper.metadata.title,
    summary: paper.metadata.summary,
    val: paper.similarity * 10  // Node size based on similarity
  })),
  links: edges.map(edge => ({
    source: edge.source,
    target: edge.target,
    value: edge.value,
    color: edge.color
  }))
};

// Graph configuration
const graph = ForceGraph3D()
  .graphData(graphData)
  .nodeLabel('name')
  .nodeVal('val')
  .linkWidth('value')
  .linkColor('color')
  .onNodeClick(handleNodeClick);
```

## Versioning

### API Versioning Strategy
- **Current Version**: v1 (implicit, no version in URL for MVP)
- **Future Versioning**: URL path-based (e.g., `/api/v2/search`)
- **Backward Compatibility**: Maintain for 6 months minimum
- **Deprecation Notice**: 3 months advance notice for breaking changes

### Response Version Headers
```http
X-API-Version: 1.0.0
X-Deprecation-Warning: Endpoint will be deprecated on 2024-12-31
```

## Compliance & Standards

### Data Formats
- **Dates**: ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
- **UUIDs**: Version 4, lowercase with hyphens
- **Coordinates**: Floating point with 6 decimal precision
- **Colors**: Hexadecimal format (#RRGGBB)

### HTTP Standards
- RESTful design principles
- Proper HTTP method semantics
- Standard status codes
- JSON:API specification consideration for future

### Accessibility (Frontend)
- ARIA labels for 3D visualization controls
- Keyboard navigation support for essential features
- Screen reader announcements for state changes
- High contrast mode support (future)

## Monitoring & Logging

### Logging Levels
```python
# Backend logging configuration
import logging

logging.basicConfig(
    level=os.environ.get('LOG_LEVEL', 'DEBUG'),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Log categories
logger.debug("Detailed trace information")     # Development only
logger.info("Key operation completed")         # Production
logger.warning("Performance threshold exceeded") # Production
logger.error("Request failed with error")      # Production
logger.critical("System failure")              # Production
```

### Metrics to Track
- API response times per endpoint
- Error rates and types
- Node/edge count in active graphs
- WebGL performance metrics
- Bundle size and load times

## Dependencies & Requirements

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "3d-force-graph": "^1.73.0",
    "three": "^0.160.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/three": "^0.160.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

### Backend Dependencies
```txt
# requirements.txt
fastapi==0.109.0
uvicorn==0.27.0
pydantic==2.5.0
python-dotenv==1.0.0
cors==1.0.0
```

### Browser Requirements
- Chrome 90+
- Safari 14+
- Edge 90+
- WebGL 2.0 support required
- Minimum 4GB RAM recommended
- GPU acceleration recommended

## Future Technical Considerations

### Scalability Path
1. **Phase 1 (Current)**: Mock backend with in-memory data
2. **Phase 2**: Real data integration with research paper APIs
3. **Phase 3**: Database persistence with PostgreSQL/MongoDB
4. **Phase 4**: Microservices architecture for scaling
5. **Phase 5**: ML-powered paper recommendations

### Performance Optimizations
- Server-side rendering for initial load (Next.js migration)
- GraphQL for efficient data fetching
- WebAssembly for computationally intensive graph operations
- Service Workers for offline capability
- CDN distribution for global access

### Additional Features
- Multi-user collaboration via WebSockets
- Export graph as image/3D model
- Advanced search filters and facets
- Citation network analysis
- Paper recommendation engine
- Integration with reference managers (Zotero, Mendeley)