# Infrastructure Setup

## MVP Deployment Philosophy

**IMPORTANT: This is an MVP. Docker is the primary deployment method for consistency and simplicity.**

### Deployment Priorities
1. **Docker First**: Always use Docker for deployment (`docker-compose up`)
2. **No Complex Infrastructure**: Keep it simple - single container for frontend, optional mock backend
3. **Manual Testing**: No CI/CD pipelines, automated tests, or deployment automation required for MVP
4. **Desktop Only**: No mobile optimization, cloud deployment, or production infrastructure needed

## Current Implementation Status ✅

### Active Services
The following services are currently running:

#### Frontend Application ✅ IMPLEMENTED
- **`frontend`** - React + TypeScript SPA with interactive 3D visualization
  - **Deployment**: Docker via `frontend/docker-compose.yml` (PREFERRED)
  - **Port**: 5173 (configurable in docker-compose.yml)
  - Framework: Vite + React 19 + TypeScript + Three.js
  - Features:
    - ✅ Interactive 3D Node component with orbital controls
    - ✅ Futuristic search bar with cosmic design
    - ✅ Animated cosmic background effects (stars, gradient orbs, vignette)
    - ✅ React Router for SPA navigation (/, /test_node)
    - ✅ TailwindCSS styling with dark theme
  - **Docker Access**: http://localhost:5173
  - **Dev Server Alternative**: `npm run dev` (development only)

#### Backend Services ✅ IMPLEMENTED
- **`mock-api`** - Python REST API providing mock research paper data
  - Port: 8000
  - Access: http://localhost:8000
  - Status: Running in background
  - Endpoints:
    - POST `/api/search` - Search for research papers
    - POST `/api/search_paper` - Get related papers
    - POST `/api/chat` - Chat functionality per paper node

## Local Development Configuration

### Recommended Startup (Docker)

**Frontend with Docker (PREFERRED METHOD):**
```bash
cd frontend
docker-compose up
# Frontend available at http://localhost:5173
```

This starts the frontend in a containerized environment with:
- Hot reload enabled via volume mounts
- Consistent Node.js 22 Alpine environment
- No local npm install required

### Alternative Development Methods

**Frontend Development Server (Alternative):**
```bash
cd frontend
npm install
npm run dev
# Vite dev server starts on http://localhost:5173
```

**Backend Mock Service:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
# Mock API server runs on http://localhost:8000
```

### Quick Start (MVP)
For rapid development, the fastest way to get started:
1. Start Docker Desktop
2. `cd frontend && docker-compose up`
3. Open http://localhost:5173/test_node to see the 3D node demo
4. Make changes - hot reload will update automatically

### Current Implementation Details

#### Frontend Components Implemented
- **SearchBar Component** (`/frontend/src/components/SearchBar.tsx`)
  - Pill-shaped design with 35px height
  - Gray search button background covering full height
  - Search icon (lucide-react) on the right
  - Console.log functionality on Enter/click
  - Minimum width: 600px
  - Text size: 2xl (24px)

- **App Component** (`/frontend/src/App.tsx`)
  - Cosmic background with animated stars layer
  - Three pulsing gradient orbs (blue-purple, purple-cyan, cyan-blue)
  - Vignette effect for edge darkening
  - Glowing animated title "3D Research Graph"
  - Centered layout with search bar

- **Styling** (`/frontend/src/index.css`)
  - Custom cosmic animations (twinkle, orb-pulse, title-glow)
  - Dark theme (#000000) with cosmic blue/purple accents
  - GPU-accelerated animations for 60fps performance

#### Service Architecture
The following architecture is currently deployed:

**Frontend Stack:**
- React 19.1.1
- TypeScript 5.9.3
- Vite 7.1.9
- TailwindCSS 4.1.14
- 3d-force-graph 1.79.0 (installed, not yet used)
- Zustand 5.0.8 (installed, not yet used)
- TanStack Query 5.90.2 (installed, not yet used)
- Lucide React 0.544.0 (for icons)

**Backend Stack:**
- Python
- REST API endpoints (mock implementation)

**Development Tools:**
- Vite Build Server - Fast frontend development with HMR
- Python Development Server - Mock REST endpoints
- Vitest - Unit testing framework (configured)
- Playwright - E2E testing (available)

## Multi-Environment Support

### Environment Configuration
This repository is designed to support multiple development environments through configuration files:
- Local development with configurable API endpoints
- Support for different backend URLs (local, staging, production)
- Environment-specific build configurations

### Environment Files
- **`.env`** - Shared configuration and default values
  ```
  # API endpoint configuration
  VITE_API_BASE_URL=http://localhost:8000
  ```

- **`.env.local`** - Developer-specific settings and local overrides
  ```
  # Local development settings
  VITE_API_BASE_URL=http://localhost:8000
  LOG_LEVEL=DEBUG
  NEXT_PUBLIC_LOG_LEVEL=DEBUG
  ```

- **`.env.production`** - Production configuration (when deployed)
  ```
  # Production API endpoint
  VITE_API_BASE_URL=https://api.research-graph.com
  LOG_LEVEL=INFO
  ```

## Environment Variable Management

### File Structure
- **Primary storage**: `.env` files for configuration management
- **Local overrides**: `.env.local` for developer-specific settings
- **Vite inheritance**: Vite automatically loads `.env` files in order of precedence

### Security Requirements
- ALL keys, secrets, and configuration MUST be stored in `.env` or `.env.local` files
- NEVER store keys directly in code or configuration files
- Add `.env.local` to `.gitignore` to prevent accidental commits
- No hardcoded secrets anywhere in the codebase
- API keys and sensitive data must remain in environment variables only

## Development vs Production

### Development Setup
- **Local Services**: All services run locally without containerization for simplicity
- **Debug Logging**: `LOG_LEVEL=DEBUG` and `NEXT_PUBLIC_LOG_LEVEL=DEBUG` always enabled during development
- **Hot Reload**: Vite provides instant hot module replacement for React components
- **Mock Data**: Python backend serves predefined test data for consistent development
- **CORS Enabled**: Backend configured to accept requests from localhost:5173
- **Source Maps**: Full source maps for debugging in browser DevTools

### Production Deployment
- **Static Hosting**: Frontend deployed as static assets to CDN or static hosting service
  - Build command: `npm run build`
  - Output directory: `dist/`
  - Platforms: Vercel, Netlify, GitHub Pages, AWS S3 + CloudFront

- **API Deployment Options**:
  - **Serverless**: Deploy Python API as AWS Lambda or Vercel Functions
  - **Container**: Dockerize Python API for cloud container services
  - **PaaS**: Deploy to Heroku, Railway, or Render for simplicity

- **Optimizations**:
  - Minified and bundled JavaScript/CSS
  - Tree-shaking for smaller bundle sizes
  - Production log levels (INFO/ERROR only)
  - CDN distribution for static assets
  - API rate limiting and caching headers

## Future Infrastructure Considerations

### Containerization (Planned)
When the project matures, Docker support will be added:
```yaml
# docker-compose.yml (future)
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://backend:8000

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - LOG_LEVEL=INFO
```

### CI/CD Pipeline (Planned)
Future automation for testing and deployment:

**Build Process:**
- Install dependencies and run tests
- TypeScript type checking
- ESLint and Prettier validation
- Build production bundles
- Generate build artifacts

**Deployment Process:**
- Deploy frontend to static hosting
- Deploy backend API to cloud service
- Run smoke tests on deployed environment
- Monitor for errors post-deployment

## Monitoring & Observability

### Logging
- **Development**: Console logging with DEBUG level for tracing
- **Production**: Structured JSON logs for analysis
- **Frontend Logging**: Browser console for debugging, error boundary for crash reporting
- **Backend Logging**: Python logging module with configurable levels

### Browser Requirements
- **Supported Browsers**:
  - Chrome (latest)
  - Edge (latest)
  - Safari (latest)
- **Not Supported**:
  - Mobile browsers (no responsive design in MVP)
  - Internet Explorer
  - Older browser versions

### Performance Monitoring (Future)
- Frontend performance metrics via Web Vitals
- 3D rendering frame rate monitoring
- API response time tracking
- Bundle size analysis and optimization

## Quick Start Commands

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd nasa-hack

# Setup frontend (once implemented)
cd frontend
npm install
cp .env.example .env.local

# Setup backend (once implemented)
cd ../backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env.local
```

### Development
```bash
# Terminal 1: Start frontend
cd frontend
npm run dev

# Terminal 2: Start backend
cd backend
source venv/bin/activate
python app.py
```

### Production Build
```bash
# Build frontend for production
cd frontend
npm run build
# Output in dist/ directory ready for deployment

# Backend can be deployed as-is or containerized
```