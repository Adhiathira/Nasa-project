# Utility Functions

This directory contains utility functions used throughout the 3D Research Graph MVP application.

## Graph Transformation Utilities

### `transformPapersToGraph()`

Transforms API Paper data into GraphNode and GraphLink format for the Graph3D component.

**File**: `graphTransform.ts`

**Purpose**: Convert Paper[] responses from the search API into the graph visualization format.

#### Function Signature

```typescript
function transformPapersToGraph(papers: Paper[]): {
  nodes: GraphNode[];
  links: GraphLink[];
}
```

#### Features

- **Input validation**: Validates papers array and all required fields
- **Node transformation**: Maps each paper to a GraphNode with:
  - `id`: paper_id (UUID)
  - `name`: paper title
  - `summary`: paper abstract
  - `val`: similarity score scaled to 0-10 for node sizing
  - `color`: cosmic blue (#4a9eff) for all initial nodes
- **Link generation**: Returns empty array for initial search (links added during "Expand" operations)
- **Comprehensive logging**: DEBUG level logs for transformation tracking
- **Error handling**: Throws descriptive errors for invalid input

#### Usage

```typescript
import { transformPapersToGraph } from '../utils/graphTransform';
import { searchPapers } from '../services/api';

// After API call
const papers = await searchPapers('quantum computing');
const { nodes, links } = transformPapersToGraph(papers);

// Pass to Graph3D component
<Graph3D nodes={nodes} links={links} />
```

#### With React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { transformPapersToGraph } from '../utils/graphTransform';

function SearchResults({ query }: { query: string }) {
  const { data: papers } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchPapers(query)
  });

  const graphData = papers
    ? transformPapersToGraph(papers)
    : { nodes: [], links: [] };

  return <Graph3D {...graphData} />;
}
```

#### Testing

Comprehensive test suite available in `graphTransform.test.ts`:

```bash
npm test -- graphTransform.test.ts
```

Test coverage includes:
- ✓ Basic transformation with multiple papers
- ✓ Empty array handling
- ✓ Input validation (null, undefined, non-array)
- ✓ Required field validation (paper_id, metadata, title, summary, similarity)
- ✓ Similarity scaling (0-1 → 0-10)
- ✓ Color assignment (cosmic blue for all nodes)

All 10 tests passing as of implementation.

#### Examples

See `graphTransform.example.ts` for detailed usage examples including:
- Basic usage with search results
- React component integration
- Empty results handling
- Error handling patterns
- Similarity scaling demonstrations

#### Future Enhancements

- Add link generation logic for "Expand" operations
- Support for different node colors based on expansion session
- Link width mapping based on similarity scores
- Batch transformation optimizations for large datasets

## Import Pattern

All utilities are exported through the central `index.ts`:

```typescript
// Recommended import
import { transformPapersToGraph } from '../utils';

// Also works
import { transformPapersToGraph } from '../utils/graphTransform';
```

## TypeScript

All utilities are written in TypeScript with:
- Full type annotations
- Strict mode enabled
- No `any` types
- Comprehensive JSDoc comments
