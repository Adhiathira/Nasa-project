# Integration Guide: transformPapersToGraph Utility

This guide shows how to integrate the `transformPapersToGraph` utility into the HomePage component for the 3D Research Graph MVP.

## Overview

The `transformPapersToGraph` utility transforms Paper[] data from the `/api/search` endpoint into the GraphNode[] and GraphLink[] format required by the Graph3D component.

## Integration Steps

### Step 1: Import the Utility

In your HomePage component, import the transformation utility:

```typescript
import { transformPapersToGraph } from '../utils/graphTransform';
// or
import { transformPapersToGraph } from '../utils';
```

### Step 2: Use with Search API

Here's how to integrate with the existing search flow:

```typescript
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchPapers } from '../services/api';
import { transformPapersToGraph } from '../utils';
import Graph3D from '../components/Graph3D';
import type { GraphNode } from '../components/Graph3D';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Fetch papers from API
  const { data: papers, isLoading, error } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchPapers(searchQuery),
    enabled: isSearchActive && searchQuery.length > 0
  });

  // Transform papers to graph format
  const graphData = papers
    ? transformPapersToGraph(papers)
    : { nodes: [], links: [] };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchActive(true);
  };

  const handleNodeClick = (node: GraphNode) => {
    console.log('Node clicked:', node);
    // TODO: Show detail panel with node.name and node.summary
  };

  return (
    <div className="h-screen w-screen bg-black">
      {/* Search bar - hide after search */}
      {!isSearchActive && (
        <SearchBar onSearch={handleSearch} />
      )}

      {/* 3D Graph visualization */}
      {isSearchActive && (
        <Graph3D
          nodes={graphData.nodes}
          links={graphData.links}
          onNodeClick={handleNodeClick}
          backgroundColor="#000000"
          className="w-full h-full"
        />
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white">Loading papers...</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-red-500">Error loading papers</div>
        </div>
      )}
    </div>
  );
}
```

### Step 3: Debugging

The utility includes comprehensive DEBUG logging. To see transformation logs:

1. Open browser DevTools console
2. Filter for `[transformPapersToGraph]` logs
3. You'll see:
   - Paper count being transformed
   - Node count created
   - Link count created (0 for initial search)
   - Sample node data for verification

Example console output:
```
[transformPapersToGraph] Transforming 15 papers to graph format
[transformPapersToGraph] Created 15 nodes
[transformPapersToGraph] Created 0 links
[transformPapersToGraph] Sample node: {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Quantum Computing Applications...',
  summary: 'This paper explores...',
  val: 8.5,
  color: '#4a9eff'
}
```

### Step 4: Error Handling

The utility throws errors for invalid input. Wrap in try-catch if needed:

```typescript
try {
  const { nodes, links } = transformPapersToGraph(papers);
  // Use nodes and links
} catch (error) {
  console.error('Graph transformation failed:', error.message);
  // Show error to user
}
```

Common errors:
- `"transformPapersToGraph: papers parameter must be an array"`
- `"Paper at index X is missing required field: paper_id"`
- `"Paper at index X is missing required field: metadata.title"`

## Data Flow

```
User Search
    ↓
SearchBar Component
    ↓
searchPapers() API call → /api/search
    ↓
Paper[] response
    ↓
transformPapersToGraph() utility
    ↓
{ nodes: GraphNode[], links: GraphLink[] }
    ↓
Graph3D Component
    ↓
3D Visualization
```

## Node Properties Explained

After transformation, each node has:

| Property | Source | Purpose | Example |
|----------|--------|---------|---------|
| `id` | `paper.paper_id` | Unique identifier | `'123e4567-e89b-12d3-a456-426614174000'` |
| `name` | `paper.metadata.title` | Node label | `'Quantum Computing Applications'` |
| `summary` | `paper.metadata.summary` | Tooltip/details | `'This paper explores...'` |
| `val` | `paper.similarity * 10` | Node size | `8.5` (from similarity 0.85) |
| `color` | Fixed value | Node color | `'#4a9eff'` (cosmic blue) |

## Similarity to Node Size Mapping

The utility scales similarity scores (0-1 range) to node sizes (0-10 range):

| Similarity | Node Size (val) | Visual Size |
|------------|-----------------|-------------|
| 1.0 | 10 | Largest sphere |
| 0.8 | 8 | Large sphere |
| 0.5 | 5 | Medium sphere |
| 0.2 | 2 | Small sphere |
| 0.0 | 0 | Smallest sphere |

## Links Explanation

For initial search results, `links` array is **always empty**. This is intentional:

- Initial search shows **standalone nodes** (papers)
- Links are created later during **"Expand" operations**
- When user clicks "Expand" on a node, related papers are fetched
- Links are then created between the expanded node and its related papers
- Each expansion session gets a unique color for its links

## Next Steps

After integrating this utility:

1. **Implement DetailPanel**: Show node details when clicked
2. **Implement Expand functionality**:
   - Fetch related papers via `/api/search_paper`
   - Create links between nodes
   - Assign unique colors per expansion session
3. **Implement Chat functionality**: Per-node conversations via `/api/chat`
4. **Add Reset button**: Clear graph and return to search

## Testing

Before deployment, verify:

```bash
# Run tests
npm test -- graphTransform.test.ts

# All 10 tests should pass:
# ✓ Basic transformation
# ✓ Empty array handling
# ✓ Input validation
# ✓ Field validation
# ✓ Similarity scaling
# ✓ Color assignment
```

## Files Created

- `/frontend/src/utils/graphTransform.ts` - Main utility function
- `/frontend/src/utils/graphTransform.test.ts` - Comprehensive test suite
- `/frontend/src/utils/graphTransform.example.ts` - Usage examples
- `/frontend/src/utils/index.ts` - Central export point
- `/frontend/src/utils/README.md` - Documentation

All files are production-ready and fully tested.
