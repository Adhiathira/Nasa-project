import { useState } from 'react';
import Graph3D, { type GraphNode, type GraphLink } from '../components/Graph3D';

/**
 * Test page for the Graph3D component
 *
 * Demonstrates:
 * - Multiple nodes with different colors and sizes
 * - Multiple links between nodes with varying colors and widths
 * - Node click interactions
 * - Dynamic data updates
 */
const TestGraphPage = () => {
  // Sample graph data - a small network of research papers
  const [nodes] = useState<GraphNode[]>([
    {
      id: '1',
      name: 'Introduction to Neural Networks',
      summary: 'A foundational paper on neural network architectures',
      color: '#4a9eff', // Cosmic blue
      val: 6
    },
    {
      id: '2',
      name: 'Deep Learning Advances',
      summary: 'Recent advances in deep learning techniques',
      color: '#ff6b6b', // Red
      val: 8
    },
    {
      id: '3',
      name: 'Transformer Architecture',
      summary: 'Attention is all you need - transformer models',
      color: '#51cf66', // Green
      val: 7
    },
    {
      id: '4',
      name: 'Computer Vision Applications',
      summary: 'Applications of deep learning in computer vision',
      color: '#ffd43b', // Yellow
      val: 5
    },
    {
      id: '5',
      name: 'Natural Language Processing',
      summary: 'NLP techniques using neural networks',
      color: '#a78bfa', // Purple
      val: 6
    }
  ]);

  const [links] = useState<GraphLink[]>([
    {
      source: '1',
      target: '2',
      color: '#4a9eff',
      value: 2
    },
    {
      source: '1',
      target: '3',
      color: '#51cf66',
      value: 3
    },
    {
      source: '2',
      target: '3',
      color: '#ff6b6b',
      value: 1.5
    },
    {
      source: '2',
      target: '4',
      color: '#ffd43b',
      value: 2.5
    },
    {
      source: '3',
      target: '5',
      color: '#a78bfa',
      value: 2
    },
    {
      source: '4',
      target: '5',
      color: '#4a9eff',
      value: 1
    }
  ]);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const handleNodeClick = (node: GraphNode) => {
    console.log('Node clicked:', node);
    setSelectedNode(node);
  };

  return (
    <div className="w-screen h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <h1 className="text-2xl font-bold text-white mb-2">
          Graph3D Component Test
        </h1>
        <p className="text-gray-400 text-sm">
          Testing 3d-force-graph integration with multiple nodes and edges
        </p>
      </div>

      {/* Graph Container */}
      <div className="flex-1 w-full h-full">
        <Graph3D
          nodes={nodes}
          links={links}
          onNodeClick={handleNodeClick}
          backgroundColor="#000000"
          className="w-full h-full"
        />
      </div>

      {/* Selected Node Info Panel */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md rounded-lg p-4 max-w-sm border border-white/20">
          <h3 className="text-white font-semibold mb-2">Selected Node</h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-300">
              <span className="font-medium">ID:</span> {selectedNode.id}
            </p>
            <p className="text-gray-300">
              <span className="font-medium">Title:</span> {selectedNode.name}
            </p>
            {selectedNode.summary && (
              <p className="text-gray-300">
                <span className="font-medium">Summary:</span> {selectedNode.summary}
              </p>
            )}
            <p className="text-gray-300">
              <span className="font-medium">Size:</span> {selectedNode.val || 4}
            </p>
            <p className="text-gray-300">
              <span className="font-medium">Color:</span>{' '}
              <span
                className="inline-block w-4 h-4 rounded"
                style={{ backgroundColor: selectedNode.color || '#4a9eff' }}
              />
            </p>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="mt-3 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-sm transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md rounded-lg p-4 max-w-xs border border-white/20">
        <h3 className="text-white font-semibold mb-2">Controls</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Drag to rotate the graph</li>
          <li>• Scroll to zoom in/out</li>
          <li>• Click a node to view details</li>
          <li>• Hover over nodes to see titles</li>
        </ul>
        <div className="mt-3 pt-3 border-t border-white/20">
          <p className="text-gray-400 text-xs">
            {nodes.length} nodes, {links.length} links
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestGraphPage;
