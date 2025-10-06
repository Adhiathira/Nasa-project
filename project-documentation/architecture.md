# System Architecture

## Overall Architecture Pattern
The system follows a **Client-Server architecture** with a frontend-focused MVP approach and mock backend services.

The architecture emphasizes:
- Single-page application (SPA) with rich 3D visualization capabilities
- RESTful API integration for data retrieval
- Component-based frontend with modern React patterns
- Lightweight state management for UI interactions
- Mock backend services for demonstration purposes

## Core Architecture Principles
- **Frontend-First Development** - Primary focus on user interface and 3D visualization with minimal backend complexity
- **Component-Based Architecture** - Modular React components for reusable UI elements and clear separation of concerns
- **API-Driven Design** - All data interactions occur through well-defined REST API endpoints
- **Stateless Backend** - Backend services are stateless with no persistence layer for the MVP
- **Progressive Enhancement** - Core search and visualization features with progressive addition of interactive capabilities
- **Desktop-Optimized Experience** - Architecture optimized for desktop browsers without mobile considerations

## System Components

### Presentation Layer
- **React SPA** - Main web application providing the entire user interface
  - Search interface component for research paper queries
  - 3D visualization component using Three.js for graph rendering
  - Detail panel component for paper information display
  - Chat interface component for per-node conversations
- **3D Rendering Engine** - Three.js-based 3d-force-graph library for molecular-style visualizations
- **State Management** - Zustand store for managing application state and graph data
- **Deployment Method** - Static web hosting serving compiled JavaScript bundles

### Application Layer
- **Python Mock API Service** - Lightweight REST API server providing test data
  - `/api/search` endpoint for initial paper searches
  - `/api/search_paper` endpoint for finding related papers
  - Chat API endpoint for conversation functionality
- **Data Transformation** - JSON response formatting and similarity score calculations
- **Deployment Method** - Python process running locally or in a simple container

### Data Layer
- **No Persistent Storage** - MVP operates without a database
- **In-Memory Data** - Mock service returns predefined or generated test data
- **External Data Sources** - Future integration points for real research paper APIs

### Development Infrastructure
- **Build System** - Vite for fast frontend development and optimized production builds
- **Package Management** - npm for JavaScript dependencies
- **Type System** - TypeScript for type safety and better developer experience
- **Styling Framework** - TailwindCSS for utility-first CSS styling

## Service Communication
- **REST APIs** - HTTP-based communication between frontend and backend using JSON payloads
- **Asynchronous Data Fetching** - TanStack Query for efficient API calls with caching and retry logic
- **Environment-Based Configuration** - Backend endpoint URLs configured via environment variables
- **CORS Support** - Cross-origin resource sharing enabled for local development

## Data Flow & Storage
- **Query Flow**: User search → Frontend → REST API → Mock data generation → JSON response → Frontend state update → 3D graph rendering
- **Expansion Flow**: Node selection → API call with paper_id → Related papers retrieval → Graph update with new nodes and edges
- **Chat Flow**: Chat initiation → Message sent to API → Response generation → UI update with conversation history
- **No Persistence Strategy** - All data is transient and exists only during the user session
- **Client-Side Caching** - TanStack Query provides temporary caching of API responses for performance

## Deployment Strategy
- **Local Development** - Vite dev server for frontend, Python process for backend API
- **Environment Configuration** - `.env` files for API endpoint configuration
- **Static Hosting** - Frontend can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages)
- **API Deployment** - Mock backend can run as a simple Python application or containerized service
- **Scaling Approach** - Not applicable for MVP; static frontend scales automatically with CDN

## Security Considerations
- **Input Validation** - Frontend validation of search queries before API calls
- **API Rate Limiting** - Basic rate limiting in mock backend to prevent abuse (planned)
- **CORS Configuration** - Properly configured CORS headers for API access control
- **No Authentication** - MVP operates without user authentication as per requirements
- **Environment Variables** - Sensitive configuration stored in `.env` files, never committed to version control
- **HTTPS** - Production deployment should use HTTPS for all communications

## Architectural Decisions & Rationale

### Technology Choices
- **React over Angular/Vue** - Chosen for its component model and extensive 3D visualization library ecosystem
- **3d-force-graph over D3.js** - Provides out-of-the-box 3D molecular visualizations with Three.js integration
- **Zustand over Redux** - Lightweight state management sufficient for MVP scope without Redux complexity
- **TanStack Query over Axios alone** - Provides caching, retry logic, and loading states out of the box
- **Vite over Create React App** - Faster development experience and better build performance

### Design Patterns
- **Container/Presentational Components** - Separation of data logic from UI rendering
- **Custom Hooks** - Encapsulation of reusable logic for API calls and state management
- **Facade Pattern** - API service layer abstracts backend communication details
- **Observer Pattern** - React's built-in reactivity for UI updates based on state changes

### Future Architecture Considerations
While out of scope for the MVP, the architecture is designed to accommodate future enhancements:
- Database integration for persistent storage of papers and user interactions
- User authentication and personalized experiences
- Real research paper API integration (arXiv, PubMed, etc.)
- WebSocket support for real-time collaborative features
- Mobile responsive design with touch gesture support
- Microservices architecture for scaling specific functionalities