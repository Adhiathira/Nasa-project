"""
FastAPI Mock Backend for 3D Research Graph Visualization

Provides REST API endpoints for searching papers, finding related papers,
and chatting about research papers. All data is mock/test data.
"""

import os
import logging
from typing import List, Optional, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from dotenv import load_dotenv

from mock_data import mock_data_generator

# Load environment variables
load_dotenv()

# Configure logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG").upper()
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Pydantic Models for Request/Response Validation

class PaperMetadata(BaseModel):
    """Paper metadata structure"""
    title: str = Field(..., max_length=500, description="Paper title")
    summary: str = Field(..., max_length=2000, description="Paper summary/abstract")


class Paper(BaseModel):
    """Paper response model"""
    paper_id: str = Field(..., description="UUID of the paper")
    metadata: PaperMetadata
    similarity: float = Field(..., ge=0.0, le=1.0, description="Similarity score (0-1)")


class SearchRequest(BaseModel):
    """Request model for paper search"""
    query: str = Field(..., min_length=1, max_length=500, description="Search query")

    @field_validator('query')
    @classmethod
    def validate_query(cls, v: str) -> str:
        """Validate and clean query string"""
        v = v.strip()
        if not v:
            raise ValueError("Query cannot be empty or whitespace only")
        return v


class SearchPaperRequest(BaseModel):
    """Request model for finding related papers"""
    paper_id: str = Field(..., description="UUID of the paper to find related papers for")
    conversation: Optional[str] = Field(None, max_length=5000, description="Optional conversation context")

    @field_validator('paper_id')
    @classmethod
    def validate_paper_id(cls, v: str) -> str:
        """Validate UUID format"""
        v = v.strip()
        # Basic UUID format validation (8-4-4-4-12 hex characters)
        parts = v.split('-')
        if len(parts) != 5 or len(parts[0]) != 8 or len(parts[1]) != 4 or len(parts[2]) != 4 or len(parts[3]) != 4 or len(parts[4]) != 12:
            raise ValueError("paper_id must be a valid UUID format")
        return v


class ChatMessage(BaseModel):
    """Chat message structure"""
    role: str = Field(..., pattern="^(user|assistant)$", description="Message role")
    content: str = Field(..., max_length=5000, description="Message content")


class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    paper_id: str = Field(..., description="UUID of the paper being discussed")
    message: str = Field(..., min_length=1, max_length=5000, description="User's message")
    conversation_history: Optional[List[ChatMessage]] = Field(default=None, description="Previous conversation messages")

    @field_validator('paper_id')
    @classmethod
    def validate_paper_id(cls, v: str) -> str:
        """Validate UUID format"""
        v = v.strip()
        parts = v.split('-')
        if len(parts) != 5 or len(parts[0]) != 8 or len(parts[1]) != 4 or len(parts[2]) != 4 or len(parts[3]) != 4 or len(parts[4]) != 12:
            raise ValueError("paper_id must be a valid UUID format")
        return v

    @field_validator('message')
    @classmethod
    def validate_message(cls, v: str) -> str:
        """Validate and clean message"""
        v = v.strip()
        if not v:
            raise ValueError("Message cannot be empty or whitespace only")
        return v


class PaperContext(BaseModel):
    """Paper context in chat response"""
    title: str
    relevant_sections: List[str]


class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    response: str = Field(..., description="Assistant's response")
    paper_context: Optional[PaperContext] = Field(None, description="Paper context used in response")


class ErrorResponse(BaseModel):
    """Standard error response model"""
    error: str = Field(..., description="Error category")
    message: str = Field(..., description="Human-readable error message")


# Application Lifespan Events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events"""
    # Startup
    host = os.getenv("HOST", "0.0.0.0")
    port = os.getenv("PORT", "8000")
    logger.info("=" * 60)
    logger.info("3D Research Graph Mock API Starting...")
    logger.info(f"API URL: http://{host}:{port}")
    logger.info(f"Log Level: {LOG_LEVEL}")
    logger.info("Available Endpoints:")
    logger.info("  POST /api/search - Search for research papers")
    logger.info("  POST /api/search_paper - Get related papers")
    logger.info("  POST /api/chat - Chat about a paper")
    logger.info("=" * 60)

    yield

    # Shutdown
    logger.info("Application shutting down...")


# Create FastAPI application
app = FastAPI(
    title="3D Research Graph Mock API",
    description="Mock backend service providing test data for research paper visualization",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
CORS_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative dev port
    "*"  # Allow all origins for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API Endpoints

@app.get("/")
async def root():
    """Root endpoint with API information"""
    logger.debug("Root endpoint accessed")
    return {
        "service": "3D Research Graph Mock API",
        "version": "1.0.0",
        "endpoints": {
            "search": "POST /api/search",
            "search_paper": "POST /api/search_paper",
            "chat": "POST /api/chat"
        }
    }


@app.post("/api/search", response_model=List[Paper], responses={
    400: {"model": ErrorResponse, "description": "Invalid request"},
    500: {"model": ErrorResponse, "description": "Internal server error"}
})
async def search_papers(request: SearchRequest):
    """
    Search for research papers based on a query string.

    Returns 5-10 mock papers relevant to the query with similarity scores.
    """
    logger.debug(f"Received search request - Query: '{request.query}'")

    try:
        # Validate request
        logger.debug("Validating search request...")

        # Generate mock papers
        logger.info(f"Searching for papers matching query: '{request.query}'")
        papers = mock_data_generator.search_papers(request.query, count=10)

        logger.debug(f"Generated {len(papers)} mock papers")
        logger.info(f"Search completed successfully - Returned {len(papers)} papers")

        # Log first paper for debugging
        if papers:
            logger.debug(f"First result: {papers[0]['metadata']['title']} (similarity: {papers[0]['similarity']})")

        return papers

    except ValueError as e:
        logger.error(f"Validation error in search request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "Invalid request",
                "message": f"Query parameter validation failed: {str(e)}"
            }
        )
    except Exception as e:
        logger.critical(f"Unexpected error in search endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Internal server error",
                "message": "Failed to process search request"
            }
        )


@app.post("/api/search_paper", response_model=List[Paper], responses={
    400: {"model": ErrorResponse, "description": "Invalid request"},
    404: {"model": ErrorResponse, "description": "Paper not found"},
    500: {"model": ErrorResponse, "description": "Internal server error"}
})
async def search_related_papers(request: SearchPaperRequest):
    """
    Get papers related to a specific paper for graph expansion.

    Returns 3-7 related papers with similarity scores.
    """
    logger.debug(f"Received related papers request - Paper ID: {request.paper_id}")

    try:
        # Validate request
        logger.debug("Validating search_paper request...")

        # Check if paper exists
        logger.debug(f"Checking if paper exists: {request.paper_id}")
        source_paper = mock_data_generator.get_paper_by_id(request.paper_id)

        if not source_paper:
            logger.warning(f"Paper not found: {request.paper_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "error": "Not found",
                    "message": "Paper with specified ID not found"
                }
            )

        logger.info(f"Finding related papers for: {source_paper['metadata']['title']}")

        # Get related papers
        related_papers = mock_data_generator.get_related_papers(
            request.paper_id,
            conversation=request.conversation,
            count=7
        )

        logger.debug(f"Generated {len(related_papers)} related papers")
        logger.info(f"Related papers search completed - Returned {len(related_papers)} papers")

        # Log first related paper for debugging
        if related_papers:
            logger.debug(f"First related: {related_papers[0]['metadata']['title']} (similarity: {related_papers[0]['similarity']})")

        return related_papers

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except ValueError as e:
        logger.error(f"Validation error in search_paper request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "Invalid request",
                "message": f"paper_id validation failed: {str(e)}"
            }
        )
    except Exception as e:
        logger.critical(f"Unexpected error in search_paper endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Internal server error",
                "message": "Failed to process related papers request"
            }
        )


@app.post("/api/chat", response_model=ChatResponse, responses={
    400: {"model": ErrorResponse, "description": "Invalid request"},
    404: {"model": ErrorResponse, "description": "Paper not found"},
    500: {"model": ErrorResponse, "description": "Internal server error"}
})
async def chat_about_paper(request: ChatRequest):
    """
    Handle chat messages about a specific research paper.

    Returns mock AI-generated responses with paper context.
    """
    logger.debug(f"Received chat request - Paper ID: {request.paper_id}, Message: '{request.message[:50]}...'")

    try:
        # Validate request
        logger.debug("Validating chat request...")

        # Check if paper exists
        logger.debug(f"Checking if paper exists: {request.paper_id}")
        paper = mock_data_generator.get_paper_by_id(request.paper_id)

        if not paper:
            logger.warning(f"Paper not found for chat: {request.paper_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "error": "Not found",
                    "message": "Paper with specified ID not found"
                }
            )

        logger.info(f"Generating chat response for paper: {paper['metadata']['title']}")

        # Log conversation history if provided
        if request.conversation_history:
            logger.debug(f"Conversation history: {len(request.conversation_history)} messages")

        # Generate chat response
        response_data = mock_data_generator.generate_chat_response(
            request.paper_id,
            request.message,
            conversation_history=[msg.model_dump() for msg in request.conversation_history] if request.conversation_history else None
        )

        logger.debug(f"Generated response length: {len(response_data['response'])} characters")
        logger.info("Chat response generated successfully")

        return response_data

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except ValueError as e:
        logger.error(f"Validation error in chat request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "Invalid request",
                "message": f"Request validation failed: {str(e)}"
            }
        )
    except Exception as e:
        logger.critical(f"Unexpected error in chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Internal server error",
                "message": "Failed to process chat request"
            }
        )


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    logger.debug("Health check endpoint accessed")
    return {"status": "healthy", "service": "3D Research Graph Mock API"}


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))

    uvicorn.run(app, host=host, port=port, log_level=LOG_LEVEL.lower())
