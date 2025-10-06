import { useEffect, useRef } from 'react';
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';

/**
 * Represents a node in the 3D graph
 */
export interface GraphNode {
  id: string;                    // Unique node ID (paper_id/UUID)
  name: string;                  // Node label (paper title)
  summary?: string;              // Paper summary (for tooltips)
  color?: string;                // Node color (hex)
  val?: number;                  // Node size value (default: 4)
  x?: number;                    // 3D coordinates (optional, set by force simulation)
  y?: number;
  z?: number;
}

/**
 * Represents a link/edge between two nodes in the 3D graph
 */
export interface GraphLink {
  source: string | GraphNode;    // Source node ID or object
  target: string | GraphNode;    // Target node ID or object
  color?: string;                // Link color (hex, e.g., #4a9eff)
  value?: number;                // Link width/strength (default: 1)
}

/**
 * Props for the Graph3D component
 */
export interface Graph3DProps {
  nodes: GraphNode[];            // Array of nodes to render
  links: GraphLink[];            // Array of links/edges to render
  onNodeClick?: (node: GraphNode) => void;  // Optional click handler
  backgroundColor?: string;      // Background color (default: #000000)
  className?: string;            // Additional CSS classes
}

/**
 * Graph3D Component
 *
 * A 3D force-directed graph visualization component using the 3d-force-graph library.
 * Renders nodes as glowing spheres and links as colored edges in a cosmic-themed 3D space.
 *
 * Features:
 * - Custom node appearance with emissive glow effects
 * - Configurable node colors and sizes
 * - Orbital controls (drag to rotate, scroll to zoom)
 * - Interactive node click handlers
 * - Dynamic data updates without recreating the graph
 * - Proper cleanup to prevent memory leaks
 */
const Graph3D: React.FC<Graph3DProps> = ({
  nodes,
  links,
  onNodeClick,
  backgroundColor = '#000000',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);

  // Initialize graph on mount
  useEffect(() => {
    if (!containerRef.current) return;

    console.debug('[Graph3D] Initializing 3D force graph');

    // Create the graph instance
    // Note: Runtime uses Kapsule pattern, but TypeScript definitions expect 'new'
    const graph = new ForceGraph3D(containerRef.current)
      .graphData({ nodes: [], links: [] })
      .nodeLabel('name')  // Show node name on hover
      .nodeVal((node: any) => node.val || 4)  // Node size
      .nodeColor((node: any) => node.color || '#4a9eff')  // Default cosmic blue
      .nodeThreeObject((node: any) => {
        // Create custom sphere with emissive material for glow effect
        const nodeVal = node.val || 4;
        const geometry = new THREE.SphereGeometry(nodeVal, 32, 32);
        const nodeColor = node.color || '#4a9eff';

        const material = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.3,
          metalness: 0.3,
          roughness: 0.4
        });

        return new THREE.Mesh(geometry, material);
      })
      .linkColor((link: any) => link.color || '#4a9eff')  // Default cosmic blue
      .linkWidth((link: any) => link.value || 1)  // Link thickness
      .linkOpacity(0.6)  // Semi-transparent for depth perception
      .backgroundColor(backgroundColor);

    // Set up node click handler if provided
    if (onNodeClick) {
      graph.onNodeClick((node: any) => {
        console.debug('[Graph3D] Node clicked:', node.id);
        onNodeClick(node);
      });
    }

    graphRef.current = graph;

    console.debug('[Graph3D] Graph initialized successfully');

    // Cleanup on unmount
    return () => {
      console.debug('[Graph3D] Cleaning up graph instance');
      if (graphRef.current) {
        // Call destructor if available
        if (typeof graphRef.current._destructor === 'function') {
          graphRef.current._destructor();
        }
        graphRef.current = null;
      }
    };
  }, []); // Empty deps - only initialize once

  // Update graph data when nodes/links change
  useEffect(() => {
    if (graphRef.current && (nodes.length > 0 || links.length > 0)) {
      console.debug('[Graph3D] Updating graph data:', {
        nodeCount: nodes.length,
        linkCount: links.length
      });

      graphRef.current.graphData({ nodes, links });
    }
  }, [nodes, links]);

  // Update background color when it changes
  useEffect(() => {
    if (graphRef.current) {
      console.debug('[Graph3D] Updating background color:', backgroundColor);
      graphRef.current.backgroundColor(backgroundColor);
    }
  }, [backgroundColor]);

  // Update click handler when it changes
  useEffect(() => {
    if (graphRef.current) {
      if (onNodeClick) {
        console.debug('[Graph3D] Updating node click handler');
        graphRef.current.onNodeClick((node: any) => {
          console.debug('[Graph3D] Node clicked:', node.id);
          onNodeClick(node);
        });
      } else {
        // Remove handler if none provided
        graphRef.current.onNodeClick(null);
      }
    }
  }, [onNodeClick]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
      data-testid="graph3d-container"
    />
  );
};

export default Graph3D;
