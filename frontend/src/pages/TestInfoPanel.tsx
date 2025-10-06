import { useState } from 'react';
import InfoPanel from '../components/InfoPanel';
import type { Paper } from '../types/api';

/**
 * Test page for InfoPanel component
 *
 * Navigate to http://localhost:5173/test-info-panel to view
 *
 * This page demonstrates:
 * - InfoPanel slide-in/out animation
 * - Frosted glass effect
 * - Close button functionality
 * - Mode 1: Search Results View (query and paper count)
 * - Mode 2: Paper Details View (title, summary, buttons)
 */
function TestInfoPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

  // Mock paper data for testing Paper Details View
  const mockPaper: Paper = {
    paper_id: 'test-paper-123',
    metadata: {
      title: 'Quantum Machine Learning: Bridging Quantum Computing and Artificial Intelligence',
      summary: 'This paper explores the intersection of quantum computing and machine learning, presenting novel algorithms that leverage quantum phenomena to enhance classical ML approaches. We demonstrate significant speedups in training deep neural networks using quantum-enhanced optimization techniques. Our results show a 10x improvement in convergence rates for specific problem domains, particularly in high-dimensional feature spaces. The study includes comprehensive benchmarks against classical methods and discusses the practical implications for near-term quantum devices. We also address the challenges of noise and decoherence in current quantum hardware and propose error mitigation strategies. This work paves the way for practical quantum advantage in machine learning applications.'
    },
    similarity: 0.92
  };

  const handleExpand = (paperId: string) => {
    console.log('Expand clicked for paper:', paperId);
    alert(`Expand functionality triggered for paper: ${paperId}`);
  };

  const handleChat = (paperId: string) => {
    console.log('Chat clicked for paper:', paperId);
    alert(`Chat functionality triggered for paper: ${paperId}`);
  };

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden">
      {/* Cosmic background for better visualization */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-black pointer-events-none" />
      
      {/* Test content */}
      <div className="relative z-0 p-8 text-white max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">InfoPanel Test Page</h1>
        <p className="text-white/70 mb-8">
          This page demonstrates the InfoPanel component with both Search Results View and Paper Details View.
        </p>

        <div className="space-y-4">
          {/* Panel visibility toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-semibold"
          >
            {isOpen ? 'Close Panel' : 'Open Panel'}
          </button>

          {/* Mode toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedPaper(null)}
              className={`px-6 py-3 rounded-lg transition-all font-semibold ${
                !selectedPaper
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Mode 1: Search Results
            </button>
            <button
              onClick={() => setSelectedPaper(mockPaper)}
              className={`px-6 py-3 rounded-lg transition-all font-semibold ${
                selectedPaper
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Mode 2: Paper Details
            </button>
          </div>

          {/* Current mode indicator */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Current Mode</h2>
            <p className="text-white/90 mb-4">
              {selectedPaper ? (
                <span className="text-[#4a9eff]">Paper Details View</span>
              ) : (
                <span className="text-[#4a9eff]">Search Results View</span>
              )}
            </p>
            <h3 className="text-sm font-semibold mb-2 text-white/70">Features Visible:</h3>
            <ul className="space-y-1 text-sm text-white/70">
              {selectedPaper ? (
                <>
                  <li>• Paper title display</li>
                  <li>• Scrollable summary section (max-height: 300px)</li>
                  <li>• Expand button (white background)</li>
                  <li>• Chat button (outline style)</li>
                  <li>• Divider between content and actions</li>
                </>
              ) : (
                <>
                  <li>• Search query with quotes</li>
                  <li>• Paper count with cosmic blue accent</li>
                  <li>• Helper text for node interaction</li>
                </>
              )}
            </ul>
          </div>

          {/* General test scenarios */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">General Features</h2>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Panel slides in from right when open</li>
              <li>• Frosted glass backdrop-blur effect</li>
              <li>• Close button with hover effects</li>
              <li>• Smooth 300ms slide animation</li>
              <li>• Conditional rendering based on selectedPaper prop</li>
            </ul>
          </div>
        </div>
      </div>

      {/* InfoPanel Component */}
      <InfoPanel
        isOpen={isOpen}
        searchQuery="quantum computing applications in machine learning"
        paperCount={42}
        onClose={() => setIsOpen(false)}
        selectedPaper={selectedPaper}
        onExpand={handleExpand}
        onChat={handleChat}
      />
    </div>
  );
}

export default TestInfoPanel;
