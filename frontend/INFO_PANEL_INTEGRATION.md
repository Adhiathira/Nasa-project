# InfoPanel Integration Guide

This guide shows how to integrate the `InfoPanel` component into the HomePage to display search results information.

## Component Location
- **File**: `/Users/delusionalmakubex/Documents/projects/nasa-hack/frontend/src/components/InfoPanel.tsx`

## Integration Steps

### Step 1: Import the Component

Add the import to `HomePage.tsx`:

```typescript
import InfoPanel from '../components/InfoPanel';
```

### Step 2: Add State for Panel Control

Add a state variable to control panel visibility:

```typescript
import { useState } from 'react';

function HomePage() {
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);

  // ... existing code
}
```

### Step 3: Update Search Flow

Modify the search success flow to automatically open the panel:

```typescript
// In SearchBar's onSearch callback or in the graph view useEffect:
useEffect(() => {
  if (isSearchActive && papers.length > 0) {
    setIsInfoPanelOpen(true);
  }
}, [isSearchActive, papers.length]);
```

### Step 4: Add InfoPanel to Graph View

Insert the `InfoPanel` component in the graph view section:

```typescript
{isSearchActive && (
  <div className="relative w-full h-screen bg-black transition-opacity duration-500 ease-in-out">
    {/* 3D Force Graph Visualization */}
    <Graph3D
      nodes={graphData.nodes}
      links={graphData.links}
      onNodeClick={handleNodeClick}
      backgroundColor="#000000"
      className="w-full h-full"
    />

    {/* Info Panel - Slides in from right */}
    <InfoPanel
      isOpen={isInfoPanelOpen}
      searchQuery={searchQuery}
      paperCount={papers.length}
      onClose={() => setIsInfoPanelOpen(false)}
    />

    {/* Floating Reset Button - Bottom Left */}
    <button
      onClick={handleReset}
      className="absolute bottom-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white border border-white/20 transition-all active:scale-95"
      aria-label="Return to search and reset graph"
    >
      <RotateCcw className="w-5 h-5" />
      <span>New Search</span>
    </button>
  </div>
)}
```

### Step 5: Get searchQuery from Store

Update the destructuring to include `searchQuery`:

```typescript
const { isSearchActive, papers, searchQuery, reset, setSelectedNode } = useAppStore();
```

## Complete Example Code

Here's a complete example of HomePage.tsx with InfoPanel integrated:

```typescript
import { useMemo, useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Graph3D from '../components/Graph3D';
import InfoPanel from '../components/InfoPanel';
import useAppStore from '../store/useAppStore';
import { transformPapersToGraph } from '../utils/graphTransform';
import type { GraphNode } from '../components/Graph3D';

function HomePage() {
  // Local state for InfoPanel
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);

  // Get state from Zustand store
  const { isSearchActive, papers, searchQuery, reset, setSelectedNode } = useAppStore();

  // Auto-open panel when search completes
  useEffect(() => {
    if (isSearchActive && papers.length > 0) {
      setIsInfoPanelOpen(true);
    }
  }, [isSearchActive, papers.length]);

  // Transform papers to graph data using memoization
  const graphData = useMemo(() => {
    if (papers.length === 0) {
      console.debug('[HomePage] No papers available, returning empty graph data');
      return { nodes: [], links: [] };
    }

    console.debug('[HomePage] Transforming', papers.length, 'papers to graph format');
    const transformed = transformPapersToGraph(papers);
    console.debug('[HomePage] Graph data ready:', transformed.nodes.length, 'nodes,', transformed.links.length, 'links');
    return transformed;
  }, [papers]);

  // Handle node click events
  const handleNodeClick = (node: GraphNode) => {
    console.log('[HomePage] Node clicked:', node.id, node.name);
    setSelectedNode(node.id);
    // Future: Show detail panel
  };

  // Handle reset button click
  const handleReset = () => {
    console.log('[HomePage] Reset button clicked, returning to search view');
    setIsInfoPanelOpen(false);
    reset();
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden">
      {!isSearchActive ? (
        // Search View - Initial landing page with cosmic background
        <div className="cosmic-background min-h-screen relative overflow-hidden flex items-center justify-center transition-opacity duration-500 ease-in-out">
          {/* Animated stars layer */}
          <div className="stars-layer absolute inset-0 pointer-events-none" />

          {/* Cosmic gradient orbs */}
          <div className="cosmic-orb-1 absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none" />
          <div className="cosmic-orb-2 absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-25 blur-3xl pointer-events-none" />
          <div className="cosmic-orb-3 absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl pointer-events-none" />

          {/* Vignette effect */}
          <div className="vignette absolute inset-0 pointer-events-none" />

          {/* Main content */}
          <div className="relative z-10 text-center space-y-12">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-white mb-4 title-glow">
                3D Research Graph
              </h1>
              <p className="text-xl text-white/70">
                Explore research papers in a cosmic visualization
              </p>
            </div>

            <SearchBar />
          </div>
        </div>
      ) : (
        // Graph View - 3D visualization of search results
        <div className="relative w-full h-screen bg-black transition-opacity duration-500 ease-in-out">
          {/* 3D Force Graph Visualization */}
          <Graph3D
            nodes={graphData.nodes}
            links={graphData.links}
            onNodeClick={handleNodeClick}
            backgroundColor="#000000"
            className="w-full h-full"
          />

          {/* Info Panel - Slides in from right */}
          <InfoPanel
            isOpen={isInfoPanelOpen}
            searchQuery={searchQuery}
            paperCount={papers.length}
            onClose={() => setIsInfoPanelOpen(false)}
          />

          {/* Floating Reset Button - Bottom Left */}
          <button
            onClick={handleReset}
            className="absolute bottom-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white border border-white/20 transition-all active:scale-95"
            aria-label="Return to search and reset graph"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Search</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
```

## Testing the Integration

1. **Start the development server**:
   ```bash
   cd frontend
   npm run dev
   # Or use Docker:
   docker-compose up
   ```

2. **Manual Testing Steps**:
   - Navigate to http://localhost:5173
   - Enter a search query and press Enter/click search
   - Verify the InfoPanel slides in from the right
   - Check that search query and paper count are displayed correctly
   - Click the X button to close the panel
   - Verify the panel slides out smoothly
   - Click "New Search" to return to search view

3. **Expected Behavior**:
   - Panel should slide in when graph appears
   - Frosted glass effect should be visible
   - Close button should work smoothly
   - Panel should be positioned above graph but below reset button (z-index hierarchy)
   - Text should be readable with cosmic blue accent on paper count

## Customization Options

### Adjust Panel Width
Change the width in the className:
```typescript
className="... w-[400px] ..."  // Change 400px to desired width
```

### Modify Animation Speed
Change the duration:
```typescript
className="... duration-300 ..."  // Change to duration-500 for slower
```

### Change Background Opacity
Adjust the background:
```typescript
className="... bg-black/40 ..."  // Change /40 to /30 or /50
```

### Add Additional Content
Insert content in the content section:
```typescript
<div className="px-6 space-y-6">
  {/* Existing content */}

  {/* New content here */}
  <div className="space-y-2">
    <p className="text-sm text-white/50 uppercase tracking-wider">
      New Section
    </p>
    <p className="text-lg text-white/90">
      Additional information
    </p>
  </div>
</div>
```

## Notes

- The InfoPanel uses `absolute` positioning, so it must be within a `relative` parent
- Z-index is set to 10 to appear above the graph but below the reset button (z-20)
- The component is fully accessible with proper ARIA labels
- No tests were created per MVP guidelines - manual testing is preferred
- The panel state is managed locally in HomePage - could be moved to Zustand store if needed
