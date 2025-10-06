import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Props for the Node3D component
 */
interface Node3DProps {
  /**
   * Hex color for the sphere node (default: #4a9eff - cosmic blue)
   */
  color?: string;
  /**
   * Additional CSS classes for the canvas container
   */
  className?: string;
  /**
   * Optional paper title to display above the node sphere
   */
  paper_title?: string;
  /**
   * Optional UUID identifier for the node, used for linking nodes together
   * and tracking relationships in the research graph. Maps to paper_id from backend API.
   */
  uuid?: string;
}

/**
 * Node3D Component
 *
 * Renders an interactive 3D sphere using Three.js with manual orbital controls.
 * Features:
 * - Mouse drag to rotate camera around the sphere
 * - Mouse wheel to zoom in/out
 * - Emissive glow effect for cosmic theme
 * - Smooth 60fps rendering
 * - Proper cleanup on unmount
 */
const Node3D: React.FC<Node3DProps> = ({
  color = '#4a9eff',
  className = '',
  paper_title,
  uuid
}) => {
  // Canvas element reference
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js object references for cleanup
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const lightsRef = useRef<THREE.Light[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const textSpriteRef = useRef<THREE.Sprite | null>(null);

  // Mouse interaction state - using ref to avoid re-renders during drag
  const isDraggingRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cameraPositionRef = useRef({ theta: 0, phi: Math.PI / 2, radius: 5 });

  /**
   * Creates a THREE.Sprite with text rendered on a canvas texture
   * @param text - The text to render
   * @returns A THREE.Sprite object with the text, or null if text is empty
   */
  const createTextSprite = (text: string): THREE.Sprite | null => {
    if (!text || text.trim() === '') {
      return null;
    }

    // Create canvas for text rendering
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;

    // Set canvas width (power of 2 for better WebGL performance)
    canvas.width = 512;

    // Configure text rendering (must be set before measuring text)
    context.font = '48px Arial, Inter, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Text wrapping configuration
    const maxWidth = 480; // Maximum text width in pixels (leaving margin for canvas edges)
    const maxLines = 3; // Maximum number of lines before truncation
    const lineHeight = 60; // Vertical spacing between lines in pixels

    // Word wrapping algorithm
    const lines: string[] = [];
    const words = text.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = context.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        // Current line is full, push it and start a new line
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Word fits on current line
        currentLine = testLine;
      }
    }

    // Add the last line
    if (currentLine) {
      lines.push(currentLine);
    }

    // Truncate if exceeds maxLines
    if (lines.length > maxLines) {
      lines.splice(maxLines); // Keep only first maxLines
      // Add ellipsis to the last line
      const lastLine = lines[maxLines - 1];
      const ellipsis = '...';
      // Ensure the last line with ellipsis fits within maxWidth
      let truncatedLine = lastLine;
      while (context.measureText(truncatedLine + ellipsis).width > maxWidth && truncatedLine.length > 0) {
        truncatedLine = truncatedLine.slice(0, -1);
      }
      lines[maxLines - 1] = truncatedLine + ellipsis;
    }

    // Adjust canvas height based on number of lines
    // Base height 128px + additional space for extra lines
    const baseHeight = 128;
    const additionalHeight = Math.max(0, (lines.length - 1) * lineHeight);
    canvas.height = baseHeight + additionalHeight;

    // Add semi-transparent background for better readability
    context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Re-apply text rendering configuration after canvas resize
    context.font = '48px Arial, Inter, sans-serif';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Draw each line of text, centered vertically
    const totalTextHeight = (lines.length - 1) * lineHeight;
    const startY = (canvas.height / 2) - (totalTextHeight / 2);

    lines.forEach((line, index) => {
      const y = startY + (index * lineHeight);
      context.fillText(line, canvas.width / 2, y);
    });

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create sprite material with the texture
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });

    // Create sprite
    const sprite = new THREE.Sprite(spriteMaterial);

    // Scale sprite appropriately (width to height ratio of canvas)
    const spriteScale = 3;
    sprite.scale.set(spriteScale * (canvas.width / canvas.height), spriteScale, 1);

    // Position above the sphere (y = 2.8)
    sprite.position.set(0, 2.8, 0);

    return sprite;
  };

  // Initialization effect - runs once to create the scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black cosmic background
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    // Add ambient light (soft overall illumination)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    lightsRef.current.push(ambientLight);

    // Add directional light (creates depth and shadows)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    lightsRef.current.push(directionalLight);

    // Add second directional light from opposite side for better illumination
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -3, -5);
    scene.add(directionalLight2);
    lightsRef.current.push(directionalLight2);

    // Create sphere geometry (32 segments for smooth appearance)
    const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);

    // Create material with emissive glow (initial color will be set in color effect)
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.3,
      metalness: 0.3,
      roughness: 0.4
    });

    // Create mesh and add to scene
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, 0);

    // Store UUID in userData for node linking
    if (uuid) {
      sphere.userData.uuid = uuid;
    }

    scene.add(sphere);
    sphereRef.current = sphere;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Update camera position based on spherical coordinates
      const { theta, phi, radius } = cameraPositionRef.current;
      camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(0, 0, 0);

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    // Handle mouse wheel for zoom (needs passive: false to allow preventDefault)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Zoom sensitivity
      const zoomSensitivity = 0.001;

      // Update camera radius (distance from sphere)
      cameraPositionRef.current.radius += e.deltaY * zoomSensitivity;

      // Clamp radius between min (2) and max (10)
      cameraPositionRef.current.radius = Math.max(
        2,
        Math.min(10, cameraPositionRef.current.radius)
      );
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('wheel', handleWheel);

      // Cancel animation loop
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }

      // Remove all objects from scene before disposal
      if (sceneRef.current) {
        while (sceneRef.current.children.length > 0) {
          const object = sceneRef.current.children[0];
          sceneRef.current.remove(object);
        }
        // Clear the scene
        sceneRef.current.clear();
      }

      // Dispose lights
      lightsRef.current.forEach(light => {
        light.dispose();
      });
      lightsRef.current = [];

      // Dispose sphere geometry and material
      if (sphereRef.current) {
        sphereRef.current.geometry.dispose();
        if (Array.isArray(sphereRef.current.material)) {
          sphereRef.current.material.forEach(m => m.dispose());
        } else {
          sphereRef.current.material.dispose();
        }
      }

      // Dispose text sprite and its resources
      if (textSpriteRef.current) {
        const spriteMaterial = textSpriteRef.current.material as THREE.SpriteMaterial;
        if (spriteMaterial.map) {
          spriteMaterial.map.dispose();
        }
        spriteMaterial.dispose();
        textSpriteRef.current = null;
      }

      // Dispose renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      // Clear references
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      sphereRef.current = null;
    };
  }, []); // Empty deps - runs once only

  // Color update effect - runs when color changes
  useEffect(() => {
    if (sphereRef.current?.material) {
      const material = sphereRef.current.material as THREE.MeshStandardMaterial;
      material.color.set(new THREE.Color(color));
      material.emissive.set(new THREE.Color(color));
      material.needsUpdate = true;
    }
  }, [color]); // Only depends on color

  // UUID update effect - runs when uuid changes
  useEffect(() => {
    if (sphereRef.current) {
      if (uuid) {
        sphereRef.current.userData.uuid = uuid;
      } else {
        // Remove uuid from userData if no longer provided
        delete sphereRef.current.userData.uuid;
      }
    }
  }, [uuid]); // Only depends on uuid

  // Paper title update effect - runs when paper_title changes
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove existing text sprite if it exists
    if (textSpriteRef.current) {
      sceneRef.current.remove(textSpriteRef.current);

      // Dispose of the sprite's resources
      const spriteMaterial = textSpriteRef.current.material as THREE.SpriteMaterial;
      if (spriteMaterial.map) {
        spriteMaterial.map.dispose();
      }
      spriteMaterial.dispose();
      textSpriteRef.current = null;
    }

    // Create and add new text sprite if paper_title is provided
    if (paper_title) {
      const textSprite = createTextSprite(paper_title);
      if (textSprite) {
        sceneRef.current.add(textSprite);
        textSpriteRef.current = textSprite;
      }
    }
  }, [paper_title]); // Only depends on paper_title

  // Mouse down handler - start dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    mouseRef.current = { x: e.clientX, y: e.clientY };

    // Update cursor directly via DOM manipulation
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing';
    }
  };

  // Mouse move handler - rotate camera
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;

    // Calculate mouse movement delta
    const deltaX = e.clientX - mouseRef.current.x;
    const deltaY = e.clientY - mouseRef.current.y;

    // Update mouse position
    mouseRef.current = { x: e.clientX, y: e.clientY };

    // Sensitivity factor for rotation
    const rotationSensitivity = 0.005;

    // Update spherical coordinates
    cameraPositionRef.current.theta -= deltaX * rotationSensitivity;
    cameraPositionRef.current.phi -= deltaY * rotationSensitivity;

    // Clamp phi to prevent camera flipping (0.1 to PI - 0.1)
    cameraPositionRef.current.phi = Math.max(
      0.1,
      Math.min(Math.PI - 0.1, cameraPositionRef.current.phi)
    );
  };

  // Mouse up handler - stop dragging
  const handleMouseUp = () => {
    isDraggingRef.current = false;

    // Update cursor directly via DOM manipulation
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  };

  // Mouse leave handler - stop dragging if mouse leaves canvas
  const handleMouseLeave = () => {
    isDraggingRef.current = false;

    // Update cursor directly via DOM manipulation
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'block',
        cursor: 'grab' // Initial cursor, updated via DOM in event handlers
      }}
    />
  );
};

export default Node3D;
