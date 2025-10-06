# Components Documentation

## SearchBar Component

### Overview
A futuristic, pill-shaped search bar with animated glowing borders designed for the 3D Research Graph MVP. Features cosmic blue/purple glow effects and smooth 60fps animations.

### Location
`/Users/delusionalmakubex/Documents/projects/nasa-hack/frontend/src/components/SearchBar.tsx`

### Features
- **Animated Glowing Border**: Rotating conic gradient creates a traveling light effect
- **Cosmic Aesthetic**: Blue/purple color scheme matching the research graph theme
- **Pill-Shaped Design**: Fully rounded borders for modern appearance
- **Smooth Animations**: 60fps performance with GPU-accelerated CSS animations
- **TypeScript**: Full type safety with proper type definitions
- **Accessible**: ARIA labels and keyboard support (Enter key)
- **Responsive Input**: Blue caret color and placeholder transitions

### Visual Design Elements

#### Colors
- **Primary Blue**: #3b82f6
- **Light Blue**: #60a5fa
- **Purple**: #8b5cf6
- **Cyan**: #06b6d4
- **Background**: black/60 (transparent black)
- **Text**: white
- **Placeholder**: gray-400

#### Animations
1. **Rotating Gradient** (4s cycle): Conic gradient rotates around perimeter
2. **Pulse Effect** (3s cycle): Secondary glow layer breathes in/out
3. **Hover Effects**: Icon color change and scale animation
4. **Active State**: Button press scale down (active:scale-95)

#### Blur Layers
- **Outer Glow**: 8px blur with conic gradient
- **Inner Glow**: 4px blur with linear gradient
- **Box Shadows**: Multiple shadow layers for depth

### Props

```typescript
interface SearchBarProps {
  placeholder?: string;              // Default: "Search research papers..."
  onSearch?: (query: string) => void;  // Optional callback when search is triggered
  className?: string;                // Additional CSS classes
}
```

### Usage

#### Basic Usage
```tsx
import SearchBar from './components/SearchBar';

function App() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <SearchBar />
    </div>
  );
}
```

#### With Custom Placeholder
```tsx
<SearchBar placeholder="Search papers..." />
```

#### With Search Callback
```tsx
function App() {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Add custom search logic here
  };

  return <SearchBar onSearch={handleSearch} />;
}
```

#### With Custom Styling
```tsx
<SearchBar className="max-w-2xl" />
```

### Functionality

#### Search Triggers
1. **Enter Key**: Press Enter while input is focused
2. **Search Button**: Click the search icon on the right

#### Validation
- Empty queries (no text) are not triggered
- Whitespace-only queries are not triggered
- Only non-empty, trimmed queries trigger search

#### Console Output
When search is triggered, the component logs:
```
Search query: [your query text]
```

### Testing

#### Unit Tests
Location: `/Users/delusionalmakubex/Documents/projects/nasa-hack/frontend/src/components/SearchBar.test.tsx`

**Test Coverage:**
- ✓ Renders with default placeholder text
- ✓ Renders with custom placeholder text
- ✓ Updates input value when user types
- ✓ Calls onSearch callback when Enter key is pressed
- ✓ Calls onSearch callback when search button is clicked
- ✓ Does not trigger search for empty query
- ✓ Does not trigger search for whitespace-only query
- ✓ Logs query to console when no callback is provided

**Run Tests:**
```bash
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:ui       # UI mode
```

#### Browser Testing
See `/Users/delusionalmakubex/Documents/projects/nasa-hack/frontend/TESTING_CHECKLIST.md` for comprehensive manual testing checklist.

**Quick Browser Test:**
1. Start dev server: `npm run dev`
2. Open http://localhost:5173/
3. Type "test query" in search bar
4. Press Enter or click search icon
5. Check browser console for: `Search query: test query`

### Browser Compatibility
- Chrome (latest) - Fully supported
- Edge (latest) - Fully supported
- Safari (latest) - Fully supported
- Desktop only (no mobile support in MVP)

### Performance Characteristics
- **Animation Performance**: 60fps smooth animations
- **GPU Acceleration**: CSS transforms and opacity only
- **Bundle Impact**: ~1KB additional (with lucide-react icon)
- **Re-render Optimization**: Controlled input with minimal re-renders

### Dependencies
- **lucide-react**: For the search icon (Search component)
- **React**: useState hook for controlled input
- **TailwindCSS**: Utility classes for base styling
- **Custom CSS**: Inline keyframe animations

### Implementation Details

#### Animation Strategy
- **Conic Gradient**: Creates color wheel effect that rotates
- **Blur Filters**: Layered blur for glowing depth effect
- **CSS Keyframes**: Custom animations defined in component
- **Transform**: GPU-accelerated rotation and scaling

#### State Management
- Single state variable: `query` (string)
- Controlled input pattern
- No external state management needed

#### Event Handlers
- `handleSearch()`: Triggers search with validation
- `handleKeyDown()`: Listens for Enter key press
- `onChange()`: Updates query state
- `onClick()`: Triggers search on button click

### Accessibility
- **ARIA Label**: Search button has `aria-label="Search"`
- **Keyboard Support**: Full keyboard navigation (Tab, Enter)
- **Focus States**: Visual focus indicator on input
- **Screen Readers**: Proper semantic HTML and labels

### Future Enhancements (Not Implemented)
- Search suggestions/autocomplete
- Recent searches history
- Voice search input
- Keyboard shortcuts (Ctrl+K)
- Search filters
- Loading states
- API integration

### Known Limitations
- No API integration (console.log only)
- Desktop-only (no mobile responsive design)
- No search history persistence
- No advanced search options

### Styling Customization

#### Changing Glow Colors
Edit the inline styles in SearchBar.tsx:
```tsx
background: 'conic-gradient(from 0deg, transparent 0%, #YOUR_COLOR1 25%, #YOUR_COLOR2 50%, #YOUR_COLOR3 75%, transparent 100%)'
```

#### Adjusting Animation Speed
Modify the keyframes in the style tag:
```css
.animate-spin-slow {
  animation: spin-slow 4s linear infinite;  /* Change 4s to your desired speed */
}
```

#### Modifying Size
Adjust the padding and min-width:
```tsx
className="... px-8 py-4 ... min-w-[400px]"  // Change these values
```

### Troubleshooting

#### Animation Not Visible
- Check that background is dark (black recommended)
- Verify blur filters are supported in browser
- Check for conflicting CSS styles

#### Tests Failing
- Ensure vitest is installed: `npm install -D vitest`
- Check test setup file exists: `src/test/setup.ts`
- Run `npm run test:run` to see detailed errors

#### TypeScript Errors
- Verify type-only import for KeyboardEvent
- Check that all props are properly typed
- Run `npx tsc --noEmit` to check for errors

#### Build Errors
- Ensure all dependencies are installed
- Check for proper TypeScript configuration
- Run `npm run build` to see detailed errors

### Support
For issues or questions, refer to:
- Implementation guide: `SEARCHBAR_IMPLEMENTATION.md`
- Testing checklist: `TESTING_CHECKLIST.md`
- Project tech stack: `project-documentation/tech-stack.md`

---

## Edge3D Component

### Overview
A 3D curved edge component that renders an interactive tube connecting two node positions using Three.js. Features cosmic-themed emissive glow effects, dynamic thickness based on similarity scores, and smooth 60fps rendering.

### Location
`/Users/delusionalmakubex/Documents/projects/nasa-hack/frontend/src/components/Edge3D.tsx`

### Features
- **3D Curved Tube**: Connects two positions using quadratic bezier curves
- **Emissive Glow Effect**: Cosmic-themed glow matching Node3D aesthetic
- **Semi-Transparent Material**: Provides depth perception in 3D space
- **Dynamic Color Changes**: Real-time color updates via props
- **Similarity-Based Thickness**: Visual weight reflects relationship strength (0-1 scale)
- **Smooth 60fps Rendering**: GPU-accelerated Three.js performance
- **Automatic Camera Positioning**: Adjusts to view entire edge based on length
- **Proper Cleanup**: Disposes all Three.js objects on unmount

### Visual Design Elements

#### Colors
- **Default**: #4a9eff (cosmic blue)
- **Customizable**: Via color prop (hex format)
- **Emissive Glow**: Matches edge color with 0.5 intensity

#### Material Properties
- **Opacity**: 0.8 (semi-transparent)
- **Emissive Intensity**: 0.5
- **Metalness**: 0.3
- **Roughness**: 0.4
- **Double-Sided**: Yes (visible from all angles)

#### Geometry
- **Type**: TubeGeometry with circular cross-section
- **Tubular Segments**: 64 (smooth curve)
- **Radial Segments**: 8 (circular shape)
- **Control Point Offset**: 20% of distance, perpendicular to direct line
- **Curve Type**: Quadratic bezier for natural arc

#### Thickness Calculation
- **Formula**: `baseThickness × similarity × 0.3`
- **Default Base Thickness**: 1.0
- **Default Similarity**: 0.5
- **Result**: Thickness dynamically reflects relationship strength

### Props

```typescript
interface Edge3DProps {
  sourcePosition: { x: number; y: number; z: number };  // 3D position of source node
  targetPosition: { x: number; y: number; z: number };  // 3D position of target node
  color?: string;            // Hex color (default: #4a9eff - cosmic blue)
  thickness?: number;        // Base thickness multiplier (default: 1.0)
  similarity?: number;       // Similarity score 0-1 (default: 0.5, affects visual weight)
  className?: string;        // Additional CSS classes for canvas container
}
```

### Usage

#### Basic Usage
```tsx
import Edge3D from './components/Edge3D';

function App() {
  return (
    <div className="w-full h-screen">
      <Edge3D
        sourcePosition={{ x: -5, y: 0, z: 0 }}
        targetPosition={{ x: 5, y: 0, z: 0 }}
      />
    </div>
  );
}
```

#### With Custom Color and Thickness
```tsx
<Edge3D
  sourcePosition={{ x: -5, y: 0, z: 0 }}
  targetPosition={{ x: 5, y: 0, z: 0 }}
  color="#ef4444"
  thickness={2.0}
  similarity={0.8}
/>
```

#### Connecting Two Nodes
```tsx
function GraphView() {
  const nodeA = { x: -3, y: 2, z: 0 };
  const nodeB = { x: 3, y: -2, z: 1 };

  return (
    <div className="relative w-full h-screen">
      <Edge3D
        sourcePosition={nodeA}
        targetPosition={nodeB}
        color="#22c55e"
        similarity={0.73}
      />
    </div>
  );
}
```

### Functionality

#### Dynamic Updates
- **Color Changes**: Update material in real-time
- **Position Changes**: Recalculate curve and geometry
- **Thickness/Similarity Changes**: Update tube radius instantly
- **Performance**: All updates use React useEffect for optimal rendering

#### Camera Behavior
- **Auto-Adjusts**: Views entire edge based on length
- **Distance Formula**: 1.5× edge length (minimum)
- **Look At**: Always focused on edge midpoint
- **Aspect Ratio**: Smooth handling of window dimensions

### Testing

#### Test Page
**Location**: `http://localhost:5173/test_edge`

**Features**:
- Color picker with presets (cosmic blue, red, green, yellow)
- Thickness slider (0.1 to 3.0)
- Similarity slider (0.0 to 1.0)
- Real-time final thickness display
- Reset to defaults button

**Run Test Page**:
```bash
npm run dev
# Navigate to http://localhost:5173/test_edge
```

### Browser Compatibility
- Chrome (latest) - Fully supported
- Safari (latest) - Fully supported
- Edge (latest) - Fully supported
- Desktop only (no mobile support in MVP)
- Requires WebGL 2.0 support

### Performance Characteristics
- **Rendering**: 60fps with smooth animations
- **GPU Acceleration**: Three.js hardware-accelerated rendering
- **Geometry Updates**: Efficient recalculation on position changes
- **Re-render Optimization**: Minimal re-renders via useRef pattern
- **Memory Management**: Proper disposal prevents memory leaks

### Dependencies
- **three**: Three.js library for 3D rendering
- **@types/three**: TypeScript definitions
- **React**: useRef, useEffect hooks
- **TailwindCSS**: Utility classes for container styling

### Implementation Details

#### Curve Algorithm
- **Type**: Quadratic bezier curve for natural arc
- **Control Point**: Perpendicular to direct line between nodes
- **Offset**: 20% of edge distance for subtle curvature
- **Calculation**: Midpoint + perpendicular vector offset

#### State Management
- **Three.js Objects**: All stored in refs (no state)
- **Dynamic Updates**: Via useEffect dependencies
- **No External State**: Self-contained component
- **Ref Pattern**: Avoids unnecessary re-renders

#### Cleanup
- **Geometry Disposal**: Frees GPU memory on unmount
- **Material Disposal**: Includes texture cleanup
- **Light Disposal**: Removes ambient light
- **Renderer Disposal**: Cleans up WebGL context
- **Animation Frame**: Cancels requestAnimationFrame loop

### Known Limitations
- No interactive controls (visual only component)
- Fixed camera position per edge instance
- Desktop-only (not responsive)
- Positions must be provided externally
- Single edge per component instance

### Future Enhancements (Not Implemented)
- Interactive edge selection/highlighting
- Animated particle flow along edge path
- Variable thickness along path (taper effect)
- Multiple edges in single component
- Label/tooltip support
- Click handlers for edge interaction

### Styling Customization

#### Changing Default Color
Edit the default prop value in Edge3D.tsx:
```tsx
color = '#4a9eff'  // Change to your desired hex color
```

#### Adjusting Material Appearance
Modify the material properties:
```tsx
edgeMaterial.opacity = 0.8;          // Transparency (0-1)
edgeMaterial.emissiveIntensity = 0.5; // Glow strength (0-1)
edgeMaterial.metalness = 0.3;         // Metallic look (0-1)
edgeMaterial.roughness = 0.4;         // Surface roughness (0-1)
```

#### Modifying Curve Shape
Adjust the control point offset:
```tsx
const offset = 0.2;  // Change from 0.2 (20%) to desired value
```

### Troubleshooting

#### Edge Not Visible
- Check that positions are different (not identical)
- Verify WebGL is supported in browser
- Ensure container has width and height
- Check color contrast against background

#### Performance Issues
- Reduce tubular segments (currently 64)
- Simplify material properties
- Check GPU acceleration is enabled
- Monitor Chrome DevTools Performance tab

#### Position Updates Not Working
- Verify position props are changing
- Check useEffect dependencies array
- Ensure new position objects trigger re-render
- Test with console.log in useEffect

#### TypeScript Errors
- Verify Three.js types are installed: `npm install -D @types/three`
- Check position object structure matches interface
- Run `npx tsc --noEmit` to check for errors

### Support
For issues or questions, refer to:
- Test page: `http://localhost:5173/test_edge`
- Component source: `frontend/src/components/Edge3D.tsx`
- Project tech stack: `project-documentation/tech-stack.md`

---

## Graph3D Component

### Overview
A unified 3D force-directed graph visualization component using the 3d-force-graph library. Renders multiple nodes as glowing spheres connected by colored edges in a cosmic-themed 3D space. Provides a single canvas solution with built-in force simulation, orbital controls, and interactive click handlers.

### Location
`/Users/delusionalmakubex/Documents/projects/nasa-hack/frontend/src/components/Graph3D.tsx`

### Features
- **Unified 3D Visualization**: Single canvas rendering all nodes and edges (no layering issues)
- **Force-Directed Layout**: Built-in physics simulation for natural graph arrangement
- **Custom Node Rendering**: Glowing spheres with emissive Three.js materials
- **Interactive Controls**: Orbital controls (drag to rotate, scroll to zoom)
- **Dynamic Updates**: Real-time graph data updates without recreation
- **Node Click Handlers**: Optional callback for node interaction
- **Customizable Appearance**: Colors, sizes, and styles via props
- **GPU Acceleration**: Three.js hardware-accelerated rendering
- **Proper Cleanup**: Automatic disposal of Three.js objects on unmount
- **TypeScript**: Full type safety with comprehensive interfaces

### Visual Design Elements

#### Colors
- **Default Node Color**: #4a9eff (cosmic blue)
- **Default Link Color**: #4a9eff (cosmic blue)
- **Background**: #000000 (black cosmic theme)
- **Customizable**: All colors via props (hex format)

#### Node Material Properties
- **Geometry**: SphereGeometry with 32 segments (smooth spheres)
- **Node Size**: Configurable via `val` property (default: 4)
- **Emissive Glow**: Matches node color with 0.3 intensity
- **Metalness**: 0.3 (subtle metallic appearance)
- **Roughness**: 0.4 (semi-glossy surface)
- **Material Type**: MeshStandardMaterial for realistic lighting

#### Link Properties
- **Color**: Customizable per link (default: cosmic blue)
- **Width**: Based on `value` property (default: 1)
- **Opacity**: 0.6 (semi-transparent for depth perception)
- **Rendering**: Native 3d-force-graph link rendering

#### Force Simulation
- **Physics Engine**: d3-force-3d (integrated in 3d-force-graph)
- **Auto-Layout**: Nodes arrange naturally based on connections
- **Configurable**: Can disable or customize force parameters
- **Real-time**: Updates dynamically as graph changes

### Props

```typescript
interface GraphNode {
  id: string;                    // Unique node ID (paper_id/UUID)
  name: string;                  // Node label (paper title)
  summary?: string;              // Paper summary (for tooltips)
  color?: string;                // Node color (hex, default: #4a9eff)
  val?: number;                  // Node size value (default: 4)
  x?: number;                    // 3D coordinates (optional, set by force simulation)
  y?: number;
  z?: number;
}

interface GraphLink {
  source: string | GraphNode;    // Source node ID or object
  target: string | GraphNode;    // Target node ID or object
  color?: string;                // Link color (hex, default: #4a9eff)
  value?: number;                // Link width/strength (default: 1)
}

interface Graph3DProps {
  nodes: GraphNode[];            // Array of nodes to render
  links: GraphLink[];            // Array of links/edges to render
  onNodeClick?: (node: GraphNode) => void;  // Optional click handler
  backgroundColor?: string;      // Background color (default: #000000)
  className?: string;            // Additional CSS classes
}
```

### Usage

#### Basic Usage
```tsx
import Graph3D from './components/Graph3D';

const nodes = [
  { id: '1', name: 'Node A', color: '#4a9eff', val: 4 },
  { id: '2', name: 'Node B', color: '#ef4444', val: 6 }
];

const links = [
  { source: '1', target: '2', color: '#22c55e', value: 2 }
];

function App() {
  return (
    <div className="w-full h-screen">
      <Graph3D nodes={nodes} links={links} />
    </div>
  );
}
```

#### With Click Handler
```tsx
function GraphView() {
  const handleNodeClick = (node: GraphNode) => {
    console.log('Clicked:', node.name);
    // Navigate to paper detail page, open modal, etc.
  };

  return (
    <div className="w-full h-screen">
      <Graph3D
        nodes={nodes}
        links={links}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}
```

#### Dynamic Updates
```tsx
function InteractiveGraph() {
  const [graphData, setGraphData] = useState({ nodes, links });

  const addNode = () => {
    const newNode = {
      id: crypto.randomUUID(),
      name: 'New Paper',
      color: '#8b5cf6',
      val: 5
    };

    setGraphData({
      ...graphData,
      nodes: [...graphData.nodes, newNode]
    });
  };

  return (
    <div className="w-full h-screen">
      <Graph3D nodes={graphData.nodes} links={graphData.links} />
      <button onClick={addNode}>Add Node</button>
    </div>
  );
}
```

#### Custom Colors and Sizes
```tsx
const coloredNodes = [
  { id: '1', name: 'Paper 1', color: '#ef4444', val: 6 },  // Red, large
  { id: '2', name: 'Paper 2', color: '#22c55e', val: 4 },  // Green, medium
  { id: '3', name: 'Paper 3', color: '#3b82f6', val: 8 }   // Blue, extra large
];

const coloredLinks = [
  { source: '1', target: '2', color: '#eab308', value: 2 },  // Yellow, thick
  { source: '2', target: '3', color: '#06b6d4', value: 1 }   // Cyan, thin
];

<Graph3D
  nodes={coloredNodes}
  links={coloredLinks}
  backgroundColor="#0a0a0a"
/>
```

### Functionality

#### Node Interactions
- **Hover**: Displays node name as tooltip (built-in)
- **Click**: Triggers optional `onNodeClick` callback
- **Drag**: Moves individual nodes (repositions them)
- **Debug Logging**: Console logs for click events

#### Camera Controls
- **Rotate**: Click and drag to rotate view
- **Zoom**: Scroll wheel to zoom in/out
- **Pan**: Right-click and drag (or shift+drag)
- **Auto-Orbit**: Can be enabled via 3d-force-graph API

#### Dynamic Updates
- **Add/Remove Nodes**: Update nodes array, component re-renders
- **Add/Remove Links**: Update links array, component re-renders
- **Change Colors**: Modify node/link color properties
- **Change Sizes**: Modify node `val` property
- **No Recreation**: Graph instance persists, only data updates

#### Force Simulation Behavior
- **Auto-Start**: Begins simulation on data load
- **Convergence**: Settles into stable layout after ~100 iterations
- **Reheat**: Simulation restarts when data changes
- **Customizable**: Can modify force parameters via ref access

### Testing

#### Test Page
**Location**: `http://localhost:5173/test_edge`

**Features**:
- 2 nodes connected by 1 edge
- Interactive color picker for edge
- Thickness slider (0.1 to 3.0)
- Similarity slider (0.0 to 1.0)
- Demonstrates dynamic updates
- Tests node click handlers
- Verifies orbital controls

**Run Test Page**:
```bash
cd frontend
npm run dev
# Navigate to http://localhost:5173/test_edge
```

**Manual Testing**:
1. Verify nodes render as glowing spheres
2. Check edge connects nodes correctly
3. Test drag to rotate camera
4. Test scroll to zoom
5. Click nodes to verify handler fires
6. Adjust colors/sizes dynamically
7. Verify smooth 60fps performance

### Browser Compatibility
- Chrome (latest) - Fully supported
- Edge (latest) - Fully supported
- Safari (latest) - Fully supported
- Desktop only (no mobile support in MVP)
- Requires WebGL 2.0 support

### Performance Characteristics
- **Node Count**: Handles 500+ nodes efficiently
- **FPS**: Maintains 60fps with hundreds of nodes
- **GPU Acceleration**: Three.js hardware rendering
- **Memory**: Proper cleanup prevents leaks
- **Re-render Optimization**: Only updates graph data, not entire instance
- **Force Simulation**: Auto-pauses when stable

### Dependencies
- **3d-force-graph**: ^1.79.0 (core visualization library)
- **three**: ^0.180.0 (3D rendering engine)
- **@types/three**: TypeScript definitions
- **React**: useRef, useEffect hooks
- **TailwindCSS**: Utility classes for container

### Implementation Details

#### Initialization Strategy
- **Single Instance**: Graph created once on mount
- **Ref Pattern**: Graph stored in ref to avoid re-creation
- **Separate Effects**: Different useEffect hooks for data, background, click handler
- **Cleanup**: Destructor called on unmount

#### State Management
- **No Internal State**: Component is controlled by props
- **Ref-Based**: All Three.js objects in refs
- **Minimal Re-renders**: Only when props change
- **External State**: Graph data managed by parent component

#### Node Rendering Pipeline
1. 3d-force-graph calls `.nodeThreeObject()` for each node
2. Custom function creates SphereGeometry with node's `val` size
3. MeshStandardMaterial applied with emissive glow
4. Three.js Mesh returned to graph library
5. Library adds mesh to scene and manages lifecycle

#### Link Rendering
- **Native**: Uses 3d-force-graph's built-in link rendering
- **Color Mapping**: `.linkColor()` accessor function
- **Width Mapping**: `.linkWidth()` accessor function
- **Opacity**: Global `.linkOpacity()` setting

#### Event Handling
- **Node Click**: `.onNodeClick()` method with callback
- **Type Safety**: Node parameter typed as GraphNode
- **Debug Logging**: Console logs for click events
- **Optional Handler**: Can remove by passing null

### Key Advantages Over Separate Components
- **Single Canvas**: No z-index or layering issues
- **Unified Rendering**: All objects in same Three.js scene
- **Force Simulation**: Natural graph layout without manual positioning
- **Better Performance**: One WebGL context instead of multiple
- **Built-in Controls**: Orbital controls included
- **Integrated Physics**: d3-force-3d handles node positioning
- **Architecture Compliance**: Matches technical-specs.md design

### Known Limitations
- Force simulation may move nodes automatically (can disable if needed)
- Container must have explicit width and height (100% requires parent sizing)
- Desktop-only (no mobile responsive design in MVP)
- No built-in edge labels or tooltips
- Camera is global (not per-node like Edge3D component)
- TypeScript definitions use 'new' but runtime uses Kapsule pattern (works but shows warning)

### Future Enhancements (Not Implemented)
- Edge labels and tooltips
- Animated particle flow along edges
- Node clustering and grouping
- Search/filter functionality
- Mini-map for navigation
- Export to image/SVG
- Custom force parameters UI
- Link click handlers
- Multi-selection support

### Styling Customization

#### Changing Default Node Color
Edit the component defaults:
```tsx
.nodeColor((node: any) => node.color || '#YOUR_COLOR')  // Change #4a9eff
```

#### Adjusting Node Glow Intensity
Modify the emissiveIntensity:
```tsx
const material = new THREE.MeshStandardMaterial({
  emissiveIntensity: 0.3,  // Change 0.3 to 0.5 for brighter glow
  // ...
});
```

#### Changing Node Size Formula
Modify the SphereGeometry:
```tsx
const nodeVal = node.val || 4;  // Change default from 4
const geometry = new THREE.SphereGeometry(nodeVal, 32, 32);  // Adjust radius multiplier
```

#### Adjusting Link Opacity
Change the global setting:
```tsx
.linkOpacity(0.6)  // Change from 0.6 to 0.8 for more opaque
```

#### Customizing Force Simulation
Access via graph ref:
```tsx
graphRef.current
  .d3Force('charge').strength(-120)  // Repulsion strength
  .d3Force('link').distance(30);     // Link distance
```

### Troubleshooting

#### Nodes/Links Not Visible
- Check that container has width and height set
- Verify nodes array is not empty
- Ensure WebGL is supported in browser
- Check browser console for errors
- Verify color contrast against background

#### Performance Issues
- Reduce node count or simplify geometry
- Lower sphere segment count (from 32 to 16)
- Disable force simulation after convergence
- Check GPU acceleration is enabled
- Monitor Chrome DevTools Performance tab

#### Graph Not Updating
- Ensure props are new object references
- Check useEffect dependencies are correct
- Verify graphRef.current is not null
- Test with console.log in useEffect
- Confirm graph instance initialized successfully

#### Click Handler Not Firing
- Verify onNodeClick prop is passed correctly
- Check that nodes are rendered (not hidden)
- Ensure no other elements blocking clicks
- Test with console.log in handler
- Check browser console for errors

#### Force Simulation Issues
- Wait for simulation to converge (1-2 seconds)
- Check that links reference valid node IDs
- Ensure nodes have unique IDs
- Verify source/target are strings or objects
- Test with simple 2-3 node graph first

#### TypeScript Errors
- Ensure types are installed: `npm install -D @types/three`
- Check node/link interfaces match GraphNode/GraphLink
- Verify 3d-force-graph types are available
- Run `npx tsc --noEmit` for detailed errors
- Note: 'new ForceGraph3D' may show warning but works correctly

### Comparison: Graph3D vs Edge3D + Node3D

| Feature | Graph3D | Edge3D + Node3D |
|---------|---------|-----------------|
| Canvas Count | 1 unified canvas | Multiple canvases (N nodes + M edges) |
| Layering | No z-index issues | Requires careful z-index management |
| Performance | Better (single WebGL context) | Worse (multiple contexts) |
| Layout | Auto force-directed | Manual positioning required |
| Controls | Built-in orbital controls | Separate per component |
| Use Case | Complete graph visualization | Individual component testing |
| Architecture | Matches tech specs | Component library |

**Recommendation**: Use Graph3D for production graph visualization. Use Edge3D/Node3D only for component testing or isolated demos.

### Support
For issues or questions, refer to:
- Test page: `http://localhost:5173/test_edge`
- Component source: `frontend/src/components/Graph3D.tsx`
- Architecture docs: `project-documentation/technical-specs.md`
- Project tech stack: `project-documentation/tech-stack.md`
