# Graph Transformation Architecture

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         HomePage Component                       │
│                                                                  │
│  ┌──────────────┐                                               │
│  │  SearchBar   │  User enters query                            │
│  │  Component   │─────────┐                                     │
│  └──────────────┘         │                                     │
│                           ↓                                     │
│  ┌───────────────────────────────────────┐                     │
│  │   TanStack Query (React Query)        │                     │
│  │                                        │                     │
│  │   useQuery({                          │                     │
│  │     queryKey: ['search', query],      │                     │
│  │     queryFn: () => searchPapers(...)  │                     │
│  │   })                                  │                     │
│  └───────────────────────────────────────┘                     │
│                           │                                     │
│                           ↓                                     │
│  ┌───────────────────────────────────────┐                     │
│  │       API Service Layer               │                     │
│  │  (frontend/src/services/api.ts)       │                     │
│  │                                        │                     │
│  │  async function searchPapers(query) { │                     │
│  │    const response = await fetch(      │                     │
│  │      '/api/search',                   │                     │
│  │      { method: 'POST', ... }          │                     │
│  │    );                                 │                     │
│  │    return response.json();            │                     │
│  │  }                                    │                     │
│  └───────────────────────────────────────┘                     │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ↓
        ┌────────────────────────────────────┐
        │   Backend API (FastAPI/Python)     │
        │   POST /api/search                 │
        │   Returns: Paper[]                 │
        └────────────────────────────────────┘
                            │
                            ↓
┌───────────────────────────┼─────────────────────────────────────┐
│                    HomePage Component                            │
│                           │                                      │
│                           ↓                                      │
│  ┌────────────────────────────────────────┐                     │
│  │  Paper[] from API Response             │                     │
│  │                                         │                     │
│  │  [                                      │                     │
│  │    {                                    │                     │
│  │      paper_id: "uuid",                  │                     │
│  │      metadata: {                        │                     │
│  │        title: "...",                    │                     │
│  │        summary: "..."                   │                     │
│  │      },                                 │                     │
│  │      similarity: 0.85                   │                     │
│  │    },                                   │                     │
│  │    ...                                  │                     │
│  │  ]                                      │                     │
│  └────────────────────────────────────────┘                     │
│                           │                                      │
│                           ↓                                      │
│  ┌────────────────────────────────────────┐                     │
│  │  transformPapersToGraph(papers)        │ ← NEW UTILITY       │
│  │  (frontend/src/utils/graphTransform.ts)│                     │
│  │                                         │                     │
│  │  1. Validate input (array check)       │                     │
│  │  2. Validate each paper fields         │                     │
│  │  3. Transform Paper → GraphNode:       │                     │
│  │     - id = paper_id                    │                     │
│  │     - name = title                     │                     │
│  │     - summary = summary                │                     │
│  │     - val = similarity * 10            │                     │
│  │     - color = '#4a9eff'                │                     │
│  │  4. Create empty links array           │                     │
│  │  5. Log transformation details         │                     │
│  └────────────────────────────────────────┘                     │
│                           │                                      │
│                           ↓                                      │
│  ┌────────────────────────────────────────┐                     │
│  │  { nodes: GraphNode[], links: [] }     │                     │
│  │                                         │                     │
│  │  nodes: [                               │                     │
│  │    {                                    │                     │
│  │      id: "uuid",                        │                     │
│  │      name: "Paper Title",               │                     │
│  │      summary: "Abstract...",            │                     │
│  │      val: 8.5,                          │                     │
│  │      color: "#4a9eff"                   │                     │
│  │    },                                   │                     │
│  │    ...                                  │                     │
│  │  ]                                      │                     │
│  │  links: []                              │                     │
│  └────────────────────────────────────────┘                     │
│                           │                                      │
│                           ↓                                      │
│  ┌────────────────────────────────────────┐                     │
│  │    Graph3D Component                   │                     │
│  │    (frontend/src/components/Graph3D.tsx)│                    │
│  │                                         │                     │
│  │    <Graph3D                             │                     │
│  │      nodes={graphData.nodes}            │                     │
│  │      links={graphData.links}            │                     │
│  │      onNodeClick={handleNodeClick}      │                     │
│  │    />                                   │                     │
│  └────────────────────────────────────────┘                     │
│                           │                                      │
│                           ↓                                      │
│  ┌────────────────────────────────────────┐                     │
│  │  3D Force Graph Visualization          │                     │
│  │  (3d-force-graph + Three.js)           │                     │
│  │                                         │                     │
│  │  - Renders nodes as spheres            │                     │
│  │  - Node size based on val (similarity) │                     │
│  │  - Cosmic blue color (#4a9eff)         │                     │
│  │  - Interactive controls (zoom, rotate) │                     │
│  │  - Click handlers for interactions     │                     │
│  └────────────────────────────────────────┘                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Type Flow

```typescript
// API Response Type
interface Paper {
  paper_id: string;
  metadata: {
    title: string;
    summary: string;
  };
  similarity: number;  // 0-1 range
}

// ↓ Transform via transformPapersToGraph()

// Graph3D Input Type
interface GraphNode {
  id: string;          // = paper_id
  name: string;        // = metadata.title
  summary: string;     // = metadata.summary
  val: number;         // = similarity * 10 (scaled to 0-10)
  color: string;       // = '#4a9eff' (cosmic blue)
  x?: number;          // Set by force simulation
  y?: number;          // Set by force simulation
  z?: number;          // Set by force simulation
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  color?: string;
  value?: number;
}

// For initial search: links = []
// Links are created during "Expand" operations
```

## Component Hierarchy

```
App
 └── HomePage
      ├── SearchBar (hidden after search)
      ├── Graph3D
      │    └── ForceGraph3D (3d-force-graph library)
      │         └── Three.js Scene
      │              ├── Sphere Meshes (nodes)
      │              └── Line Segments (links)
      └── DetailPanel (future: shown on node click)
```

## State Management

```typescript
// HomePage State
{
  searchQuery: string,           // Current search query
  isSearchActive: boolean,       // Show graph vs search bar
  selectedNode: GraphNode | null // For detail panel
}

// TanStack Query Cache
{
  ['search', query]: Paper[],    // Cached search results
  // Future: ['expand', nodeId]: Paper[]
  // Future: ['chat', nodeId]: ChatMessage[]
}

// Graph3D Internal State
{
  nodes: GraphNode[],            // All visible nodes
  links: GraphLink[],            // All visible links
  graphInstance: ForceGraph3D    // 3D graph renderer
}
```

## Future Enhancements

### Expand Operation

When user clicks "Expand" on a node:

```
1. Fetch related papers: POST /api/search_paper { paper_id }
2. Transform new papers to nodes with transformPapersToGraph()
3. Create links between source node and new nodes:
   - source: original node id
   - target: new node id
   - color: unique color for this expansion session
   - value: similarity score (0-1)
4. Append new nodes and links to existing graph data
5. Update Graph3D component with merged data
```

### Link Generation

Future utility function:

```typescript
function createLinksForExpansion(
  sourceNodeId: string,
  targetNodes: GraphNode[],
  expandSessionId: string,
  color: string
): GraphLink[] {
  return targetNodes.map(target => ({
    source: sourceNodeId,
    target: target.id,
    color: color,
    value: target.val / 10  // Convert back to 0-1 range
  }));
}
```

## Performance Considerations

- **Initial load**: ~10-50 nodes (fast rendering)
- **After expansions**: Up to 500 nodes (target: 30+ FPS)
- **Caching**: TanStack Query caches API responses
- **Memoization**: Graph3D uses React.memo for expensive renders
- **Three.js cleanup**: Proper disposal in useEffect cleanup

## Testing Strategy

1. **Unit tests**: transformPapersToGraph utility (10 tests ✓)
2. **Integration tests**: API → Transform → Graph3D (manual)
3. **Visual tests**: Playwright MCP for UI verification (minimal)
4. **Manual testing**: User acceptance testing (primary approach for MVP)

## Error Boundaries

```typescript
// HomePage should wrap Graph3D in error boundary
<ErrorBoundary fallback={<ErrorDisplay />}>
  <Graph3D nodes={nodes} links={links} />
</ErrorBoundary>

// transformPapersToGraph throws on invalid input
// Catch and display user-friendly error message
```
