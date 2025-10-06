# InfoPanel - Quick Start Guide

## 1. Test the Component (Standalone)

```bash
cd frontend
npm run dev
# Navigate to: http://localhost:5173/test-info-panel
```

**What to verify:**
- Panel slides in/out smoothly
- Close button (X) works
- Frosted glass effect visible
- Text is readable
- Cosmic blue accent on paper count

---

## 2. Integrate into HomePage

Add these changes to `/Users/delusionalmakubex/Documents/projects/nasa-hack/frontend/src/pages/HomePage.tsx`:

### A. Add imports
```typescript
import { useState, useEffect } from 'react';  // Add useState, useEffect
import InfoPanel from '../components/InfoPanel';  // Add this line
```

### B. Add state variable (inside HomePage function)
```typescript
const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
```

### C. Update store destructuring
```typescript
// Change from:
const { isSearchActive, papers, reset, setSelectedNode } = useAppStore();

// To:
const { isSearchActive, papers, searchQuery, reset, setSelectedNode } = useAppStore();
//                                 ^^^^^^^^^^^ Add searchQuery
```

### D. Add auto-open logic
```typescript
// Add this useEffect after the graphData useMemo
useEffect(() => {
  if (isSearchActive && papers.length > 0) {
    setIsInfoPanelOpen(true);
  }
}, [isSearchActive, papers.length]);
```

### E. Update reset handler
```typescript
// Change from:
const handleReset = () => {
  console.log('[HomePage] Reset button clicked, returning to search view');
  reset();
};

// To:
const handleReset = () => {
  console.log('[HomePage] Reset button clicked, returning to search view');
  setIsInfoPanelOpen(false);  // Add this line
  reset();
};
```

### F. Add InfoPanel to graph view JSX

Insert this code **after** the `<Graph3D>` component and **before** the reset button:

```typescript
{/* Info Panel - Slides in from right */}
<InfoPanel
  isOpen={isInfoPanelOpen}
  searchQuery={searchQuery}
  paperCount={papers.length}
  onClose={() => setIsInfoPanelOpen(false)}
/>
```

**Complete graph view section should look like:**
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

---

## 3. Test Integration

1. Navigate to http://localhost:5173
2. Search for: "quantum computing"
3. Verify:
   - Panel slides in when graph appears
   - Query shows: "quantum computing"
   - Paper count is correct
   - Close button (X) works
   - Panel slides out smoothly
   - Reset button still works

---

## Troubleshooting

**Panel doesn't appear:**
- Check `isOpen` prop is true
- Verify import statement is correct
- Check browser console for errors

**Panel appears but no animation:**
- Verify TailwindCSS is loaded
- Check `transition-transform` class is applied

**Text not visible:**
- Verify cosmic background is present
- Check browser supports backdrop-filter

**TypeScript errors:**
- Run: `npx tsc --noEmit`
- Check all imports are correct

---

## Files Reference

- **Component**: `src/components/InfoPanel.tsx`
- **Test Page**: `src/pages/TestInfoPanel.tsx`
- **Integration Guide**: `INFO_PANEL_INTEGRATION.md` (detailed)
- **Summary**: `INFO_PANEL_SUMMARY.md`
- **Checklist**: `INFO_PANEL_CHECKLIST.md`

---

## Component Props

```typescript
interface InfoPanelProps {
  isOpen: boolean;        // true = visible, false = hidden
  searchQuery: string;    // The search text to display
  paperCount: number;     // Number of papers found
  onClose: () => void;    // Called when X button clicked
}
```

---

**Need more details?** See `INFO_PANEL_INTEGRATION.md` for complete step-by-step guide.
