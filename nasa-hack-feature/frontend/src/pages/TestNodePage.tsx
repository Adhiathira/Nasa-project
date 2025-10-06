import { useState } from 'react'
import { Link } from 'react-router-dom'
import Node3D from '../components/Node3D'

/**
 * Color preset definition
 */
interface ColorPreset {
  name: string
  hex: string
}

/**
 * Paper title test data
 */
interface PaperTitle {
  name: string
  title: string
}

/**
 * Preset colors for the Node3D component
 */
const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Cosmic Blue', hex: '#4a9eff' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f59e0b' },
  { name: 'Pink', hex: '#ec4899' },
]

/**
 * Sample paper titles for testing with varying lengths
 * Each includes a mock UUID for testing node linking functionality
 */
const PAPER_TITLES: PaperTitle[] = [
  { name: 'None', title: '' },
  { name: 'Short', title: 'Quantum Computing Basics' },
  { name: 'Medium', title: 'Machine Learning Applications in Climate Science' },
  { name: 'Long', title: 'A Comprehensive Study of Neural Network Architectures for Natural Language Processing Tasks' },
  { name: 'Very Long', title: 'Deep Reinforcement Learning Approaches to Multi-Agent Systems in Complex Dynamic Environments with Partial Observability' },
]

/**
 * Sample UUID for testing node linking
 * In production, this would come from the backend API as paper_id
 */
const MOCK_NODE_UUID = '123e4567-e89b-12d3-a456-426614174000'

/**
 * TestNodePage Component
 *
 * Full-featured test page for the Node3D component featuring:
 * - Cosmic themed background with animated stars
 * - Interactive 3D node display
 * - Color picker with preset colors
 * - Navigation back to home page
 * - Instructions overlay
 */
function TestNodePage() {
  // Track selected color (default: Cosmic Blue)
  const [selectedColor, setSelectedColor] = useState<string>('#4a9eff')

  // Track selected paper title (default: Medium length title)
  const [selectedTitleIndex, setSelectedTitleIndex] = useState<number>(2)

  return (
    <div className="cosmic-background min-h-screen relative overflow-hidden">
      {/* Animated stars layer */}
      <div className="stars-layer absolute inset-0 pointer-events-none" />

      {/* Cosmic gradient orbs */}
      <div className="cosmic-orb-1 absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="cosmic-orb-2 absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-25 blur-3xl pointer-events-none" />
      <div className="cosmic-orb-3 absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl pointer-events-none" />

      {/* Vignette effect */}
      <div className="vignette absolute inset-0 pointer-events-none" />

      {/* Back to Home Button - Top Left */}
      <Link
        to="/"
        className="absolute top-24 left-8 z-40 px-6 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-105"
      >
        ← Back to Home
      </Link>

      {/* Title overlay */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center space-y-2">
        <h1 className="text-4xl font-bold text-white title-glow">
          Node3D Interactive Demo
        </h1>
        <p className="text-sm text-white/60">
          Test the 3D visualization component
        </p>
      </div>

      {/* Instructions Overlay - Top Right */}
      <div className="absolute top-8 right-8 z-30 px-6 py-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
        <h3 className="text-white font-semibold mb-2">Controls:</h3>
        <div className="space-y-1 text-sm text-white/80">
          <p>🖱️ Drag to rotate</p>
          <p>🔍 Scroll to zoom</p>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20 space-y-1">
          <p className="text-xs text-white/60">
            Current Title: <span className="text-white font-medium">{PAPER_TITLES[selectedTitleIndex].name}</span>
          </p>
          <p className="text-xs text-white/60">
            Node UUID: <span className="text-white font-mono text-[10px]">{MOCK_NODE_UUID}</span>
          </p>
        </div>
      </div>

      {/* Paper Title Picker - Bottom Left */}
      <div className="absolute bottom-8 left-8 z-30 px-6 py-5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 max-w-xs">
        <h3 className="text-white font-semibold mb-3 text-center">Paper Title:</h3>
        <div className="flex flex-col gap-2">
          {PAPER_TITLES.map((paperTitle, index) => (
            <button
              key={index}
              onClick={() => setSelectedTitleIndex(index)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-left
                ${selectedTitleIndex === index
                  ? 'bg-white text-black scale-105 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30 hover:scale-102'
                }
              `}
            >
              {paperTitle.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-8 py-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
        <h3 className="text-white font-semibold mb-4 text-center">Select Color:</h3>
        <div className="flex gap-3">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.hex}
              onClick={() => setSelectedColor(preset.hex)}
              className={`
                group relative px-5 py-3 rounded-lg font-medium transition-all duration-300
                ${selectedColor === preset.hex
                  ? 'bg-white text-black scale-110 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                }
              `}
              style={{
                boxShadow: selectedColor === preset.hex
                  ? `0 0 20px ${preset.hex}80`
                  : 'none'
              }}
            >
              {/* Color indicator dot */}
              <div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: preset.hex }}
              />
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Node Component - fills entire screen */}
      <div className="absolute inset-0 z-10">
        <Node3D
          color={selectedColor}
          paper_title={PAPER_TITLES[selectedTitleIndex].title}
          uuid={MOCK_NODE_UUID}
        />
      </div>
    </div>
  )
}

export default TestNodePage
