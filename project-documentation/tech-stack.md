# Technology Stack

## Project Status
**Note**: This project is currently in the planning phase with documented requirements but no implementation yet. The technologies listed below are based on the Product Requirements Document (PRD) for the 3D Research Graph MVP.

## Frontend Technologies
<!-- Frontend-only MVP for 3D research visualization -->
- **React** - Component-based JavaScript library for building the interactive user interface
- **TypeScript** - Typed superset of JavaScript for type safety and better developer experience
- **3d-force-graph** - Three.js-based library for rendering interactive 3D molecular-style graph visualizations
- **Three.js** (via 3d-force-graph) - 3D graphics library for WebGL rendering of nodes and edges
- **Zustand** - Lightweight state management solution for managing application state
- **TanStack Query (React Query)** - Data fetching and caching library for API integration
- **TailwindCSS** - Utility-first CSS framework for styling the application interface
- **Vite** - Next-generation frontend build tool for fast development and optimized production builds

### UI/UX Components
- **Inter or Alerta Font** - Typography choices for the interface
- **Frosted Glass Effects** - Modern glassmorphism design for panels
- **Dark Theme** - Black background (#000000) with cosmic blue glow effects

## Backend Technologies
<!-- Mock backend service planned -->
- **Python** - Programming language for the mock backend service (planned implementation)
- **REST API** - RESTful endpoints for search and paper-related operations
- **Mock Service** - Backend will initially be a mock service providing test data through REST endpoints

### API Endpoints (Planned)
- `/api/search` - Search for research papers based on query
- `/api/search_paper` - Retrieve related papers for expansion
- Chat API endpoint (specification pending)

## Database Technologies
<!-- No database in scope for MVP -->
- **None** - This is a frontend MVP demo; no database implementation is in scope
- Data will be provided through mock REST API endpoints

## DevOps & Infrastructure
<!-- Minimal infrastructure for MVP -->
- **Environment Variables** - Configuration via `.env` file for backend endpoint URLs
- **Desktop Browsers** - Chrome, Edge, Safari (latest versions) - desktop-only support

## External Services & APIs
<!-- Backend REST APIs (existing or mocked) -->
- **Research Paper API** - Mock REST API for paper search and retrieval (Free - internal mock)
- **Chat API** - REST endpoint for per-node chat functionality (Free - internal mock)

## Development Tools
<!-- Modern JavaScript development toolchain -->
- **npm** - Package manager for JavaScript dependencies
- **ESLint** (recommended) - JavaScript/TypeScript linting for code quality
- **Prettier** (recommended) - Code formatting for consistent style
- **TypeScript Compiler** - Type checking and compilation for TypeScript code

## Browser Requirements
- **Modern Desktop Browsers Only**:
  - Chrome (latest)
  - Edge (latest)
  - Safari (latest)
- **Not Supported**: Mobile browsers, Internet Explorer

## Key Technical Decisions
Based on the PRD specifications:

1. **Frontend-Only Architecture**: This is a demonstration MVP with no backend development in scope
2. **3D Visualization Focus**: Core technology choice is 3d-force-graph for molecular-style visualization
3. **Modern React Stack**: Using latest React patterns with TypeScript for maintainability
4. **Lightweight State Management**: Zustand chosen for simplicity over Redux
5. **Fast Development**: Vite selected for rapid development iteration
6. **Desktop-First**: No mobile responsiveness required for MVP

## Implementation Status
- Requirements documented (PRD complete)
-  Frontend implementation not started
-  Mock backend service not implemented
-  No package.json or dependencies installed yet

## Next Steps for Implementation
1. Initialize React + TypeScript project with Vite
2. Install core dependencies (3d-force-graph, Zustand, TanStack Query, TailwindCSS)
3. Set up Python mock backend service with REST endpoints
4. Configure environment variables for API endpoints
5. Implement search interface and 3D visualization

## Language-Specific Setup
For detailed environment setup instructions when implementation begins:
- **Frontend (JavaScript/TypeScript)**: `node-setup.md` - Will contain Node.js, npm, and React development environment configuration
- **Backend (Python)**: `python-setup.md` - Will contain Python environment setup for mock API service
