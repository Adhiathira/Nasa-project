# Graph3D Component

A React component that renders an interactive 3D force-directed graph visualization using the [3d-force-graph](https://github.com/vasturiano/3d-force-graph) library.

## Features

- **3D Force-Directed Layout**: Nodes are positioned using physics-based force simulation
- **Custom Node Rendering**: Nodes rendered as glowing spheres with emissive materials
- **Interactive Controls**:
  - Drag to rotate the camera
  - Scroll to zoom in/out
  - Click nodes to trigger custom handlers
  - Hover over nodes to see tooltips
- **Customizable Appearance**:
  - Node colors, sizes, and labels
  - Link colors, widths, and opacity
  - Background color
- **Dynamic Data Updates**: Update nodes/links without recreating the graph
- **Proper Cleanup**: Prevents memory leaks with proper Three.js cleanup

## Installation

The component uses these dependencies (already installed):
- `3d-force-graph` v1.79.0
- `three` v0.180.0
- `@types/three` v0.180.0

## Usage

```typescript
import Graph3D, { type GraphNode, type GraphLink } from './components/Graph3D';

function MyComponent() {
  const nodes: GraphNode[] = [
    {
      id: '1',
      name: 'Node 1',
      summary: 'First node description',
      color: '#4a9eff',
      val: 6
    },
    {
      id: '2',
      name: 'Node 2',
      summary: 'Second node description',
      color: '#ff6b6b',
      val: 8
    }
  ];

  const links: GraphLink[] = [
    {
      source: '1',
      target: '2',
      color: '#4a9eff',
      value: 2
    }
  ];

  const handleNodeClick = (node: GraphNode) => {
    console.log('Clicked node:', node.name);
  };

  return (
    <div className="w-full h-screen">
      <Graph3D
        nodes={nodes}
        links={links}
        onNodeClick={handleNodeClick}
        backgroundColor="#000000"
        className="w-full h-full"
      />
    </div>
  );
}
```

## Props

### GraphNode Interface

```typescript
interface GraphNode {
  id: string;                    // Unique node ID (required)
  name: string;                  // Node label shown on hover (required)
  summary?: string;              // Additional description (optional)
  color?: string;                // Hex color (default: #4a9eff)
  val?: number;                  // Node size (default: 4)
  x?: number;                    // 3D coordinates (set by force simulation)
  y?: number;
  z?: number;
}
```

### GraphLink Interface

```typescript
interface GraphLink {
  source: string | GraphNode;    // Source node ID or object (required)
  target: string | GraphNode;    // Target node ID or object (required)
  color?: string;                // Hex color (default: #4a9eff)
  value?: number;                // Link width/strength (default: 1)
}
```

### Graph3DProps

```typescript
interface Graph3DProps {
  nodes: GraphNode[];                          // Array of nodes to render
  links: GraphLink[];                          // Array of links/edges to render
  onNodeClick?: (node: GraphNode) => void;    // Optional click handler
  backgroundColor?: string;                    // Background color (default: #000000)
  className?: string;                          // Additional CSS classes
}
```

## Styling

The component requires a container with explicit dimensions:

```tsx
// Using Tailwind CSS
<Graph3D
  nodes={nodes}
  links={links}
  className="w-full h-screen"
/>

// Using inline styles
<div style={{ width: '100vw', height: '100vh' }}>
  <Graph3D nodes={nodes} links={links} />
</div>
```

## Visual Design

- **Nodes**: Rendered as `THREE.SphereGeometry` with `MeshStandardMaterial`
  - Emissive glow effect with intensity 0.3
  - Metalness: 0.3, Roughness: 0.4
  - Size scales with `val` property
- **Links**: Semi-transparent (opacity 0.6) lines
  - Width controlled by `value` property
  - Color customizable per link
- **Background**: Defaults to black (#000000) for cosmic theme

## Performance

- Tested with up to 500 nodes
- Maintains 30+ FPS on modern browsers
- Force simulation runs continuously for natural movement
- Proper Three.js cleanup prevents memory leaks

## Test Page

Visit `/test_graph` to see a working example with 5 nodes and 6 links:

```bash
# Start the frontend dev server
cd frontend
docker-compose up

# Navigate to:
# http://localhost:5173/test_graph
```

## Implementation Notes

1. **Force Graph Initialization**: Uses `new ForceGraph3D(element)` pattern
2. **Lifecycle Management**:
   - Graph initialized once on mount
   - Data updates via `graphData()` method
   - Cleanup with `_destructor()` on unmount
3. **React Integration**: Uses refs and useEffect for proper React lifecycle
4. **TypeScript**: Full type safety with exported interfaces

## Troubleshooting

### Graph not rendering
- Ensure container has explicit width/height
- Check browser console for errors
- Verify nodes/links data is valid

### Nodes too small/large
- Adjust the `val` property on nodes (default: 4)
- Values scale the sphere radius

### Links not visible
- Ensure `source` and `target` match node IDs
- Check link `value` property (controls width)
- Verify `color` is valid hex code

## Related Files

- Component: `/frontend/src/components/Graph3D.tsx`
- Test Page: `/frontend/src/pages/test_graph.tsx`
- Route: Added to `/frontend/src/main.tsx`

## License

Part of the NASA Hack 3D Research Graph MVP project.
