# Services Overview

## Service Architecture
This document provides a comprehensive overview of all services, containers, and running components for the 3D Research Graph MVP project. The system follows a simple client-server architecture with frontend and mock backend services.

## Running Services

### Frontend Service
**Service Name**: `frontend`
**Type**: React SPA (Single Page Application)
**Runtime**: Node.js with Vite development server
**Container Name**: N/A (runs directly on host during development)
**Port**: `5173`
**Access URL**: `http://localhost:5173`
**Protocol**: HTTP
**Status**: Planned (not yet implemented)

**Description**:
Main web application providing the 3D research graph visualization interface. Runs as a Vite development server during development with hot module replacement (HMR) enabled for rapid iteration.

**Key Features**:
- Search interface for research papers
- 3D molecular-style graph visualization using Three.js
- Interactive node expansion and chat functionality
- Real-time graph manipulation and camera controls

**Environment Variables**:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

**Startup Command**:
```bash
cd frontend
npm install
npm run dev
```

### Mock API Service
**Service Name**: `mock-api`
**Type**: Python REST API
**Runtime**: Python 3.x with web framework (Flask/FastAPI)
**Container Name**: N/A (runs directly on host during development)
**Port**: `8000`
**Access URL**: `http://localhost:8000`
**Protocol**: HTTP/REST
**Status**: Planned (not yet implemented)

**Description**:
Lightweight Python backend service providing mock research paper data through REST endpoints. Generates test data on-the-fly for frontend development and demonstration purposes.

**API Endpoints**:
- `POST /api/search` - Search for research papers by query
- `POST /api/search_paper` - Get papers related to a specific paper
- `POST /api/chat` - Chat functionality for individual paper nodes

**Environment Variables**:
```bash
LOG_LEVEL=DEBUG
CORS_ORIGINS=http://localhost:5173
```

**Startup Command**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Development Infrastructure

### Build Tools
**Service**: Vite Dev Server
**Purpose**: Frontend build and development
**Port**: `5173` (default)
**Features**:
- Fast hot module replacement (HMR)
- TypeScript compilation
- CSS processing with TailwindCSS
- Production build optimization

### Package Management
**Service**: npm
**Purpose**: JavaScript dependency management
**Location**: `frontend/node_modules`
**Configuration**: `frontend/package.json`

## Service Communication

### API Communication Flow
```
Frontend (5173) → HTTP/REST → Mock API (8000)
                ← JSON Response ←
```

### CORS Configuration
The mock API service is configured to accept cross-origin requests from the frontend development server:
- Allowed origins: `http://localhost:5173`, `http://localhost:3000`
- Methods: `GET`, `POST`, `OPTIONS`
- Headers: `Content-Type`, `Accept`

## Service Dependencies

### Frontend Dependencies
- **Runtime**: Node.js 18+ (recommended)
- **Package Manager**: npm 9+
- **Browser Requirements**: Chrome/Edge/Safari (latest versions)
- **WebGL Support**: Required for 3D visualization

### Backend Dependencies
- **Runtime**: Python 3.8+
- **Virtual Environment**: venv or virtualenv
- **Framework**: FastAPI or Flask (to be determined)
- **CORS Support**: Enabled for frontend communication

## Port Allocation Summary

| Port | Service | Protocol | Purpose |
|------|---------|----------|---------|
| 5173 | Frontend (Vite) | HTTP | Development server with HMR |
| 8000 | Mock API | HTTP/REST | Mock backend REST endpoints |
| 3000 | Frontend (Alt) | HTTP | Alternative frontend port (if 5173 in use) |

## Health Checks & Monitoring

### Frontend Health Check
- **Endpoint**: `http://localhost:5173/`
- **Expected Response**: React application loads with search interface
- **Health Indicators**:
  - Vite development server running
  - No console errors on page load
  - Search bar visible and functional

### Backend Health Check
- **Endpoint**: `http://localhost:8000/health` (if implemented)
- **Alternative**: Try a test search request
- **Expected Response**: HTTP 200 with JSON response
- **Health Indicators**:
  - API endpoints respond to requests
  - CORS headers properly configured
  - Mock data generation working

## Service Startup Order

1. **Backend First**: Start the mock API service
   - Ensures API is available when frontend starts
   - Verify endpoints are responding

2. **Frontend Second**: Start the frontend development server
   - Will immediately attempt to connect to backend
   - Shows connection errors if backend unavailable

## Environment Configuration

### Development Environment
All services configured via environment files:
- `.env` - Shared default configuration
- `.env.local` - Local developer overrides (not committed to git)

### Key Environment Variables
```bash
# Frontend (.env.local)
VITE_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_LOG_LEVEL=DEBUG

# Backend (.env.local)
LOG_LEVEL=DEBUG
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
PORT=8000
```

## Troubleshooting Common Issues

### Port Already in Use
If default ports are occupied:
- Frontend: Vite automatically selects next available port
- Backend: Configure PORT environment variable

### CORS Errors
If frontend cannot reach backend:
1. Verify backend CORS configuration includes frontend URL
2. Check that backend is running and accessible
3. Ensure environment variables are properly set

### Connection Refused
If services cannot communicate:
1. Verify both services are running
2. Check firewall settings
3. Confirm correct URLs in environment variables

## Production Deployment (Future)

### Frontend Production
- **Build Command**: `npm run build`
- **Output**: `dist/` directory with static files
- **Deployment Options**:
  - Vercel
  - Netlify
  - GitHub Pages
  - AWS S3 + CloudFront
  - Any static hosting service

### Backend Production Options
- **Serverless**: AWS Lambda, Vercel Functions
- **Container**: Docker deployment to cloud services
- **PaaS**: Heroku, Railway, Render
- **Traditional**: VPS with Python runtime

## Service Scaling Considerations

### Current MVP Limitations
- Single instance of each service
- No load balancing
- No redundancy or failover
- In-memory data only (no persistence)

### Future Scaling Path
- Containerization with Docker
- Orchestration with docker-compose or Kubernetes
- Load balancing for API endpoints
- CDN for frontend assets
- Database for data persistence
- Caching layer with Redis
- WebSocket support for real-time features

## Security Considerations

### Current Security Measures
- Input validation on API endpoints
- CORS properly configured
- Environment variables for sensitive configuration
- No authentication (by design for MVP)

### Future Security Enhancements
- HTTPS/TLS for all communications
- API rate limiting
- JWT authentication (if users added)
- API key management
- Request signing for sensitive operations

## Logging & Monitoring

### Frontend Logging
- **Development**: Browser console output
- **Log Level**: DEBUG (configurable via environment)
- **Key Events**: API calls, state changes, errors

### Backend Logging
- **Development**: Console/terminal output
- **Log Level**: DEBUG (configurable via environment)
- **Format**: Timestamp - Level - Message
- **Key Events**: Request handling, data generation, errors

## Quick Reference Commands

### Start All Services (Development)
```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Stop Services
- Frontend: `Ctrl+C` in terminal
- Backend: `Ctrl+C` in terminal

### Reset Services
```bash
# Frontend
rm -rf node_modules
npm install

# Backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Service Status Summary

| Service | Implementation Status | Port | Priority |
|---------|---------------------|------|----------|
| Frontend React App | ⏳ Not Started | 5173 | High |
| Mock Python API | ⏳ Not Started | 8000 | High |
| Database | ❌ Not Planned for MVP | N/A | N/A |
| Docker Containers | 📅 Future Enhancement | N/A | Low |
| CI/CD Pipeline | 📅 Future Enhancement | N/A | Low |

---

*Last Updated: 2025-10-05*
*Document Status: Planning phase - services not yet implemented*
*Note: This document reflects the planned service architecture based on project requirements. Actual implementation may vary as development progresses.*