import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Props for the Edge3D component
 */
interface Edge3DProps {
  /**
   * 3D position of source node
   */
  sourcePosition: { x: number; y: number; z: number };
  /**
   * 3D position of target node
   */
  targetPosition: { x: number; y: number; z: number };
  /**
   * Hex color for the edge (default: #4a9eff - cosmic blue)
   */
  color?: string;
  /**
   * Base thickness multiplier (default: 1.0)
   */
  thickness?: number;
  /**
   * Similarity score 0-1 (affects final thickness, default: 0.5)
   */
  similarity?: number;
  /**
   * Additional CSS classes for the canvas container
   */
  className?: string;
}

/**
 * Edge3D Component
 *
 * Renders a 3D curved edge connecting two nodes using Three.js.
 * Features:
 * - TubeGeometry with QuadraticBezierCurve3 for natural molecular-style connections
 * - Emissive glow effect matching Node3D aesthetic
 * - Semi-transparent material for depth perception
 * - Thickness based on similarity score
 * - Smooth 60fps rendering
 * - Proper cleanup on unmount
 */
const Edge3D: React.FC<Edge3DProps> = ({
  sourcePosition,
  targetPosition,
  color = '#4a9eff',
  thickness = 1.0,
  similarity = 0.5,
  className = ''
}) => {
  // Canvas element reference
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js object references for cleanup
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const edgeMeshRef = useRef<THREE.Mesh | null>(null);
  const lightsRef = useRef<THREE.Light[]>([]);
  const animationIdRef = useRef<number | null>(null);

  /**
   * Calculates the midpoint between source and target positions
   * @param source - Source position
   * @param target - Target position
   * @returns Midpoint vector
   */
  const calculateMidpoint = (
    source: { x: number; y: number; z: number },
    target: { x: number; y: number; z: number }
  ): THREE.Vector3 => {
    return new THREE.Vector3(
      (source.x + target.x) / 2,
      (source.y + target.y) / 2,
      (source.z + target.z) / 2
    );
  };

  /**
   * Calculates control point for quadratic bezier curve
   * Offsets perpendicular to direct line for natural arc
   * @param source - Source position
   * @param target - Target position
   * @returns Control point vector
   */
  const calculateControlPoint = (
    source: { x: number; y: number; z: number },
    target: { x: number; y: number; z: number }
  ): THREE.Vector3 => {
    const sourceVec = new THREE.Vector3(source.x, source.y, source.z);
    const targetVec = new THREE.Vector3(target.x, target.y, target.z);

    // Calculate midpoint
    const midpoint = calculateMidpoint(source, target);

    // Calculate direction vector from source to target
    const direction = new THREE.Vector3().subVectors(targetVec, sourceVec);

    // Calculate perpendicular offset (use up vector as reference)
    const up = new THREE.Vector3(0, 1, 0);
    const perpendicular = new THREE.Vector3().crossVectors(direction, up).normalize();

    // If direction is parallel to up vector, use a different reference vector
    if (perpendicular.length() < 0.001) {
      const right = new THREE.Vector3(1, 0, 0);
      perpendicular.crossVectors(direction, right).normalize();
    }

    // Offset magnitude is 20% of the distance between nodes
    const distance = direction.length();
    const offsetMagnitude = distance * 0.2;

    // Apply offset to midpoint
    const controlPoint = midpoint.clone().add(
      perpendicular.multiplyScalar(offsetMagnitude)
    );

    return controlPoint;
  };

  /**
   * Creates a curved tube geometry connecting source and target
   * @param source - Source position
   * @param target - Target position
   * @param tubeDiameter - Diameter of the tube
   * @returns TubeGeometry
   */
  const createEdgeGeometry = (
    source: { x: number; y: number; z: number },
    target: { x: number; y: number; z: number },
    tubeDiameter: number
  ): THREE.TubeGeometry => {
    const sourceVec = new THREE.Vector3(source.x, source.y, source.z);
    const targetVec = new THREE.Vector3(target.x, target.y, target.z);
    const controlPoint = calculateControlPoint(source, target);

    // Create quadratic bezier curve
    const curve = new THREE.QuadraticBezierCurve3(sourceVec, controlPoint, targetVec);

    // Create tube geometry along the curve
    // Parameters: path, tubular segments, radius, radial segments, closed
    const tubeGeometry = new THREE.TubeGeometry(
      curve,
      64, // Tubular segments (smoothness along curve)
      tubeDiameter / 2, // Radius (half of diameter)
      8, // Radial segments (circular smoothness)
      false // Not closed
    );

    return tubeGeometry;
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

    // Position camera to view the edge - use midpoint as focus
    const midpoint = calculateMidpoint(sourcePosition, targetPosition);
    const sourceVec = new THREE.Vector3(sourcePosition.x, sourcePosition.y, sourcePosition.z);
    const targetVec = new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);
    const distance = sourceVec.distanceTo(targetVec);

    // Position camera at a distance that shows the entire edge
    const cameraDistance = Math.max(distance * 1.5, 10);
    camera.position.set(midpoint.x, midpoint.y, midpoint.z + cameraDistance);
    camera.lookAt(midpoint.x, midpoint.y, midpoint.z);
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

    // Add directional light (creates depth)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    lightsRef.current.push(directionalLight);

    // Add second directional light from opposite side for better illumination
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -3, -5);
    scene.add(directionalLight2);
    lightsRef.current.push(directionalLight2);

    // Calculate edge thickness based on similarity
    // Final thickness = baseThickness * similarity * 0.3
    const edgeDiameter = thickness * similarity * 0.3;

    // Create edge geometry
    const edgeGeometry = createEdgeGeometry(sourcePosition, targetPosition, edgeDiameter);

    // Create material with emissive glow
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8,
      metalness: 0.3,
      roughness: 0.4
    });

    // Create mesh and add to scene
    const edgeMesh = new THREE.Mesh(edgeGeometry, edgeMaterial);
    scene.add(edgeMesh);
    edgeMeshRef.current = edgeMesh;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

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

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);

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

      // Dispose edge geometry and material
      if (edgeMeshRef.current) {
        edgeMeshRef.current.geometry.dispose();
        if (Array.isArray(edgeMeshRef.current.material)) {
          edgeMeshRef.current.material.forEach(m => m.dispose());
        } else {
          edgeMeshRef.current.material.dispose();
        }
      }

      // Dispose renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      // Clear references
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      edgeMeshRef.current = null;
    };
  }, []); // Empty deps - runs once only

  // Color update effect - runs when color changes
  useEffect(() => {
    if (edgeMeshRef.current?.material) {
      const material = edgeMeshRef.current.material as THREE.MeshStandardMaterial;
      material.color.set(new THREE.Color(color));
      material.emissive.set(new THREE.Color(color));
      material.needsUpdate = true;
    }
  }, [color]); // Only depends on color

  // Position update effect - runs when source or target position changes
  useEffect(() => {
    if (!sceneRef.current || !edgeMeshRef.current) return;

    // Calculate new thickness based on similarity
    const edgeDiameter = thickness * similarity * 0.3;

    // Remove old edge mesh
    sceneRef.current.remove(edgeMeshRef.current);

    // Dispose old geometry and material
    edgeMeshRef.current.geometry.dispose();
    if (Array.isArray(edgeMeshRef.current.material)) {
      edgeMeshRef.current.material.forEach(m => m.dispose());
    } else {
      edgeMeshRef.current.material.dispose();
    }

    // Create new edge geometry with updated positions
    const newGeometry = createEdgeGeometry(sourcePosition, targetPosition, edgeDiameter);

    // Create new material (reuse color)
    const newMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8,
      metalness: 0.3,
      roughness: 0.4
    });

    // Create new mesh
    const newEdgeMesh = new THREE.Mesh(newGeometry, newMaterial);
    sceneRef.current.add(newEdgeMesh);
    edgeMeshRef.current = newEdgeMesh;

    // Update camera position to view the new edge
    if (cameraRef.current) {
      const midpoint = calculateMidpoint(sourcePosition, targetPosition);
      const sourceVec = new THREE.Vector3(sourcePosition.x, sourcePosition.y, sourcePosition.z);
      const targetVec = new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);
      const distance = sourceVec.distanceTo(targetVec);

      const cameraDistance = Math.max(distance * 1.5, 10);
      cameraRef.current.position.set(midpoint.x, midpoint.y, midpoint.z + cameraDistance);
      cameraRef.current.lookAt(midpoint.x, midpoint.y, midpoint.z);
    }
  }, [sourcePosition, targetPosition, thickness, similarity, color]); // Depends on positions, thickness, similarity, and color

  // Thickness/Similarity update effect - runs when thickness or similarity changes
  // Note: This is already handled in the position update effect above
  // Included here for clarity and future extensibility

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block'
      }}
    />
  );
};

export default Edge3D;
