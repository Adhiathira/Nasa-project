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
