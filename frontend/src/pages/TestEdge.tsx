import React, { useState } from 'react';
import Graph3D from '../components/Graph3D';
import type { GraphNode, GraphLink } from '../components/Graph3D';

/**
 * TestEdge Page
 *
 * Test page demonstrating Graph3D component with two nodes connected by an edge.
 * Shows interactive controls to adjust:
 * - Color (applied to both nodes and edge)
 * - Thickness (edge thickness)
 * - Similarity (affects final edge thickness)
 */
const TestEdge: React.FC = () => {
  // Edge and node configuration state
  const [color, setColor] = useState<string>('#4a9eff'); // Cosmic blue
  const [thickness, setThickness] = useState<number>(1.0);
  const [similarity, setSimilarity] = useState<number>(0.5);

  // Node metadata
  const sourceNode = {
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Source Paper: Quantum Computing Applications',
    summary: 'Research on quantum computing algorithms and applications'
  };

  const targetNode = {
    uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    title: 'Target Paper: Machine Learning for Physics',
    summary: 'Applications of ML techniques in physics research'
  };

  // Create graph data
  const nodes: GraphNode[] = [
    {
      id: sourceNode.uuid,
      name: sourceNode.title,
      summary: sourceNode.summary,
      color: color,
      val: 4
    },
    {
      id: targetNode.uuid,
      name: targetNode.title,
      summary: targetNode.summary,
      color: color,
      val: 4
    }
  ];

  const links: GraphLink[] = [
    {
      source: sourceNode.uuid,
      target: targetNode.uuid,
      color: color,
      value: thickness * similarity
    }
  ];

  // Node click handler
  const handleNodeClick = (node: GraphNode) => {
    console.log('Node clicked:', node.name);
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Cosmic background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-black to-black pointer-events-none" />

      {/* Full-screen Graph3D Component */}
      <div className="absolute inset-0">
        <Graph3D
          nodes={nodes}
          links={links}
          onNodeClick={handleNodeClick}
          backgroundColor="#000000"
          className="w-full h-full"
        />
      </div>

      {/* Control Panel */}
      <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md rounded-lg p-6 text-white shadow-xl border border-white/20 space-y-4 min-w-[300px]" style={{ zIndex: 20 }}>
        <h2 className="text-xl font-bold mb-4">Node & Edge Controls</h2>

        {/* Color Control */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Color (Nodes & Edge)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer border-2 border-white/30"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 bg-black/30 border border-white/30 rounded px-3 py-2 text-sm font-mono"
              placeholder="#4a9eff"
            />
          </div>
        </div>

        {/* Thickness Control */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Base Thickness: <span className="font-mono">{thickness.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={thickness}
            onChange={(e) => setThickness(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Similarity Control */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Similarity: <span className="font-mono">{similarity.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={similarity}
            onChange={(e) => setSimilarity(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-white/60">
            Edge Width = {thickness.toFixed(2)} × {similarity.toFixed(2)} = <span className="font-bold">{(thickness * similarity).toFixed(3)}</span>
          </p>
        </div>

        {/* Node Information */}
        <div className="pt-4 border-t border-white/20 space-y-2">
          <h3 className="text-sm font-semibold text-white/80">Node Information</h3>
          <div className="text-xs space-y-2">
            <div className="space-y-1">
              <p className="text-white/60 font-mono">Source Node:</p>
              <p className="text-white/80">{sourceNode.title}</p>
              <p className="text-white/40 font-mono text-[10px]">UUID: {sourceNode.uuid.slice(0, 18)}...</p>
            </div>
            <div className="space-y-1">
              <p className="text-white/60 font-mono">Target Node:</p>
              <p className="text-white/80">{targetNode.title}</p>
              <p className="text-white/40 font-mono text-[10px]">UUID: {targetNode.uuid.slice(0, 18)}...</p>
            </div>
          </div>
        </div>

        {/* Edge Width Info */}
        <div className="pt-4 border-t border-white/20 space-y-2">
          <h3 className="text-sm font-semibold text-white/80">Edge Properties</h3>
          <div className="text-xs space-y-1 font-mono">
            <div>
              <span className="text-white/60">Color:</span> {color}
            </div>
            <div>
              <span className="text-white/60">Width:</span> {(thickness * similarity).toFixed(3)}
            </div>
          </div>
        </div>

        {/* Preset Colors */}
        <div className="pt-4 border-t border-white/20">
          <h3 className="text-sm font-semibold mb-2">Color Presets</h3>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setColor('#4a9eff')}
              className="w-full h-8 rounded border-2 border-white/30 hover:border-white/60 transition-colors"
              style={{ backgroundColor: '#4a9eff' }}
              title="Cosmic Blue"
            />
            <button
              onClick={() => setColor('#ff4a4a')}
              className="w-full h-8 rounded border-2 border-white/30 hover:border-white/60 transition-colors"
              style={{ backgroundColor: '#ff4a4a' }}
              title="Red"
            />
            <button
              onClick={() => setColor('#4aff4a')}
              className="w-full h-8 rounded border-2 border-white/30 hover:border-white/60 transition-colors"
              style={{ backgroundColor: '#4aff4a' }}
              title="Green"
            />
            <button
              onClick={() => setColor('#ffff4a')}
              className="w-full h-8 rounded border-2 border-white/30 hover:border-white/60 transition-colors"
              style={{ backgroundColor: '#ffff4a' }}
              title="Yellow"
            />
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setColor('#4a9eff');
            setThickness(1.0);
            setSimilarity(0.5);
          }}
          className="w-full bg-white/20 hover:bg-white/30 transition-colors rounded px-4 py-2 text-sm font-medium"
        >
          Reset to Defaults
        </button>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white shadow-xl border border-white/20 max-w-md" style={{ zIndex: 20 }}>
        <h3 className="text-lg font-bold mb-2">Graph3D Interactive Demo</h3>
        <p className="text-sm text-white/80 leading-relaxed">
          This demonstrates the Graph3D component with two nodes connected by an edge using 3d-force-graph.
          Adjust color, thickness, and similarity to see real-time updates. Click nodes to log interactions. Drag to rotate, scroll to zoom.
        </p>
      </div>

      {/* Back to Home Button */}
      <div className="absolute top-8 left-8" style={{ zIndex: 20 }}>
        <a
          href="/"
          className="inline-block bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 text-white border border-white/20 transition-colors text-sm font-medium"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
};

export default TestEdge;
