# Database Schema

## Database Status
**Note**: This project is currently in the planning phase. As per the Product Requirements Document and technical specifications, **no database is implemented or planned for the MVP**. The application operates as a frontend-focused demonstration with mock backend services providing in-memory test data.

## Architecture Decision
The MVP follows a **stateless, database-free architecture** by design:
- All data is provided through mock REST API endpoints
- No persistent storage layer is implemented
- Session data exists only in client-side memory
- This approach simplifies the MVP development and deployment

## Mock Data Structure
While no database exists, the mock backend service operates with the following in-memory data structures:

### Paper Data Model
The mock service generates and returns paper objects with this structure:
```json
{
  "paper_id": "UUID v4 string",
  "metadata": {
    "title": "string (max 500 chars)",
    "summary": "string (max 2000 chars)"
  },
  "similarity": "float (0.0-1.0)"
}
```

### Data Relationships
The mock service simulates the following relationships:
- **Paper → Related Papers**: One-to-many relationship where each paper can have multiple related papers
- **Similarity Scores**: Float values between 0 and 1 representing the relatedness between papers
- **Expansion Sessions**: Tracked client-side to maintain which papers were expanded from which nodes

### Client-Side State Management
The frontend maintains the following data structures in Zustand store:
```typescript
// Graph Node (in-memory representation)
{
  id: string,           // paper_id
  name: string,         // paper title
  summary: string,      // paper summary
  group?: number,       // expansion group for coloring
  x?: number,          // 3D position
  y?: number,
  z?: number,
  fx?: number,         // fixed position (pinned nodes)
  fy?: number,
  fz?: number
}

// Graph Edge (in-memory representation)
{
  source: string,       // source paper_id
  target: string,       // target paper_id
  value: number,        // similarity score
  color?: string,       // hex color for session
  expandSessionId?: string
}

// Chat Session (client-side only)
{
  paperId: string,
  messages: Array<{
    role: 'user' | 'assistant',
    content: string,
    timestamp: number
  }>,
  isOpen: boolean
}
```

## Mock Data Generation Strategy
The Python mock backend generates test data using:
```python
# Predefined topic mappings for realistic paper generation
topics = {
  "photosynthesis": [
    "C4 Plants",
    "CAM Metabolism",
    "Light Reactions",
    "Carbon Fixation",
    "Chloroplast Structure"
  ],
  "quantum": [
    "Quantum Entanglement",
    "Superposition",
    "Quantum Computing",
    "Wave Functions"
  ]
  # Additional topics as needed
}

# Random UUID generation for paper IDs
# Random similarity scores between 0.5 and 0.99
# Consistent seed for reproducible test data (optional)
```

## API Data Flow
Since there's no database, data flows as follows:

1. **Search Flow**:
   - Client sends search query to `/api/search`
   - Mock service generates list of papers with UUIDs
   - Papers returned with similarity scores
   - Client stores in Zustand state management

2. **Expansion Flow**:
   - Client sends paper_id to `/api/search_paper`
   - Mock service generates related papers
   - New edges created with similarity scores
   - Client updates graph visualization

3. **Chat Flow**:
   - Client sends message with paper_id to `/api/chat`
   - Mock service generates contextual response
   - Conversation stored client-side only
   - No persistence between sessions

## Future Database Considerations
While out of scope for the MVP, the architecture documentation indicates potential future database implementation:

### Potential Technology Choices
- **PostgreSQL**: For structured paper metadata and relationships
- **MongoDB**: For flexible document storage of paper content
- **Neo4j**: For graph-based paper relationship queries
- **Redis**: For caching frequently accessed papers

### Potential Schema Design (Future)
If a database were to be implemented in the future, the schema might include:

```sql
-- Example PostgreSQL schema (NOT IMPLEMENTED)
-- Papers table
CREATE TABLE papers (
  paper_id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  authors JSONB,
  publication_date DATE,
  journal VARCHAR(255),
  doi VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Paper relationships table
CREATE TABLE paper_relationships (
  id SERIAL PRIMARY KEY,
  source_paper_id UUID REFERENCES papers(paper_id),
  target_paper_id UUID REFERENCES papers(paper_id),
  similarity_score DECIMAL(3,2),
  relationship_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User sessions (if authentication added)
CREATE TABLE user_sessions (
  session_id UUID PRIMARY KEY,
  user_id UUID,
  graph_state JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat conversations (if persistence needed)
CREATE TABLE chat_conversations (
  id SERIAL PRIMARY KEY,
  paper_id UUID REFERENCES papers(paper_id),
  messages JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Data Volume Estimates
For planning purposes, if a database were implemented:
- **Papers**: 10,000+ research papers initially
- **Relationships**: Average 10-20 related papers per paper
- **Storage**: ~1-2GB for paper metadata
- **Growth Rate**: 100-500 new papers per month

## Performance Considerations
Current mock service performance targets:
- **Search Response**: < 500ms for up to 50 results
- **Related Papers**: < 300ms for up to 20 results
- **No Query Optimization Needed**: All data generated on-the-fly
- **No Indexing Required**: No persistent storage to index

## Migration Path
If transitioning from mock to real database:
1. Define database schema based on actual API requirements
2. Implement data access layer (DAL) with same interface as mock
3. Migrate mock data generation to seed scripts
4. Add database connection pooling and error handling
5. Implement proper migrations for schema changes
6. Add backup and recovery procedures

## Current Implementation Summary
- **Database Type**: None (stateless mock service)
- **Data Persistence**: None (in-memory only during session)
- **Storage Location**: Client-side browser memory (Zustand store)
- **Data Generation**: Python mock service with random data
- **Session Management**: No server-side sessions
- **User Data**: No user accounts or authentication
- **Backup Strategy**: Not applicable for MVP

## Notes for Developers
1. All "database" operations are simulated in the mock backend service
2. Paper IDs are generated UUIDs that exist only during the session
3. No data persists between application restarts
4. The frontend should handle all state management
5. Mock service should return consistent data structure per the API specs
6. When implementing the mock service, use predictable seeds for testing

---

*Last Updated: 2025-10-05*
*Document Status: Reflects current MVP planning phase with no database implementation*