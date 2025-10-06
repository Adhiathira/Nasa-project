# Node3D Component Documentation

## Overview
The Node3D component is a reusable React component that renders an interactive 3D sphere using Three.js. It serves as the foundational building block for the 3D Research Graph visualization.

## Component Location
**File**: `frontend/src/components/Node3D.tsx`

## Purpose
- Display a single 3D sphere (node) with customizable color
- Provide interactive controls for rotation and zoom
- Serve as a prototype for the full graph node implementation

## Props Interface

```typescript
interface Node3DProps {
  color?: string;  // Hex color for the node (default: #4a9eff - cosmic blue)
}
```

## Features

### Visual Design
- **Sphere Geometry**: Radius 1.5 with 32x32 segments for smooth appearance
- **Material**: MeshStandardMaterial with configurable color
- **Glow Effect**: Emissive property at 0.3 intensity for cosmic theme
- **Background**: Black (#000000) matching the application's cosmic aesthetic

### Lighting Setup
- **Ambient Light**: 0.4 intensity for soft overall illumination
- **Directional Lights**: Two strategically positioned lights for depth and dimensionality

### Interactive Controls

#### Rotation
- **Action**: Click and drag with mouse
- **Behavior**: Camera orbits around the stationary sphere
- **Implementation**: Spherical coordinate system (theta, phi, radius)
- **Visual Feedback**: Cursor changes to grab/grabbing states

#### Zoom
- **Action**: Mouse wheel scroll
- **Behavior**: Camera moves closer/further from sphere
- **Constraints**: Clamped between 2 and 10 units distance
- **Implementation**: Adjusts camera Z position with smooth transitions

## Technical Implementation

### Three.js Architecture
- **Scene**: Standard Three.js scene with black background
- **Camera**: PerspectiveCamera positioned at (0, 0, 5) looking at origin
- **Renderer**: WebGLRenderer with antialiasing enabled
- **Animation Loop**: 60fps using requestAnimationFrame

### React Integration
- **Refs**: Canvas element and Three.js objects stored in useRef
- **Effects**: Scene initialization and cleanup in useEffect
- **Lifecycle**: Proper disposal of geometries, materials, and renderer on unmount
- **Responsiveness**: Window resize handler updates camera and renderer

### Event Handling
- Mouse down/move/up for rotation tracking
- Wheel event with `{passive: false}` to prevent browser warnings
- Proper cleanup of event listeners on component unmount

## Test Page

### Location
**Route**: `/test_node`
**File**: `frontend/src/pages/TestNodePage.tsx`

### Test Page Features

#### Color Picker
Six preset colors available:
- **Cosmic Blue** (#4a9eff) - Default
- **Purple** (#a855f7)
- **Green** (#22c55e)
- **Red** (#ef4444)
- **Orange** (#f59e0b)
- **Pink** (#ec4899)

#### UI Elements
- **Color Buttons**: Horizontal row with visual feedback and active state highlighting
- **Instructions Overlay**: Top-right corner with "Drag to rotate" and "Scroll to zoom" instructions
- **Navigation**: "Back to Home" button in top-left corner
- **Background**: Cosmic theme with animated stars, orbs, and vignette effect

## Usage Example

```typescript
import Node3D from './components/Node3D';

function MyComponent() {
  return (
    <div className="w-full h-screen">
      <Node3D color="#4a9eff" />
    </div>
  );
}
```

## Code Quality

### TypeScript
- Full type safety with proper interfaces
- No compilation errors
- Comprehensive JSDoc comments

### Performance
- 60fps rendering
- Efficient cleanup prevents memory leaks
- Responsive to window resize

### Accessibility
- Visual cursor feedback for interactions
- Clear instruction overlay

## Future Enhancements

Potential improvements for the full graph implementation:
1. Support for multiple nodes in a scene
2. Label/title display on hover
3. Click/selection interactions
4. Edge connections between nodes
5. Force-directed layout integration
6. Performance optimization for hundreds of nodes
7. Touch gesture support for tablets

## Related Files

- `frontend/src/components/Node3D.tsx` - Main component
- `frontend/src/pages/TestNodePage.tsx` - Test/demo page
- `frontend/src/pages/HomePage.tsx` - Main landing page
- `frontend/src/main.tsx` - Routing configuration

## Dependencies

- `three` (v0.180.0) - 3D graphics library
- `@types/three` (v0.180.0) - TypeScript definitions
- `react` (v19.1.1) - Component framework
- `react-router-dom` (v7.9.3) - Routing

## Testing

Manual testing performed on:
- Visual rendering with multiple colors
- Rotation controls (mouse drag)
- Zoom controls (mouse wheel)
- Component mounting/unmounting
- Window resize responsiveness
- Navigation to/from test page

## Development Notes

### Design Decisions
- Used Three.js directly instead of React Three Fiber for fine-grained control
- Implemented custom orbital controls instead of OrbitControls library for learning purposes
- Camera rotates around stationary sphere (not vice versa) for better control
- Event listeners use `{passive: false}` to prevent browser console warnings

### Browser Compatibility
- Chrome (latest) ✓
- Edge (latest) ✓
- Safari (latest) ✓
- Requires WebGL 2.0 support
