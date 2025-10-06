import SearchBar from '../components/SearchBar'

function HomePage() {
  return (
    <div className="cosmic-background min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated stars layer */}
      <div className="stars-layer absolute inset-0 pointer-events-none" />

      {/* Cosmic gradient orbs */}
      <div className="cosmic-orb-1 absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="cosmic-orb-2 absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-25 blur-3xl pointer-events-none" />
      <div className="cosmic-orb-3 absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl pointer-events-none" />

      {/* Vignette effect */}
      <div className="vignette absolute inset-0 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white mb-4 title-glow">
            3D Research Graph
          </h1>
          <p className="text-xl text-white/70">
            Explore research papers in a cosmic visualization
          </p>
        </div>

        <SearchBar />
      </div>
    </div>
  )
}

export default HomePage
