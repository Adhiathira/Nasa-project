/**
 * API type definitions for the 3D Research Graph MVP
 *
 * These types correspond to the FastAPI backend response formats.
 */

/**
 * Paper metadata containing title and summary information
 */
export interface PaperMetadata {
  /** Paper title (max 500 chars) */
  title: string;
  /** Paper summary/abstract (max 2000 chars) */
  summary: string;
}

/**
 * Paper object returned from the search API
 */
export interface Paper {
  /** Unique identifier for the paper (UUID format) */
  paper_id: string;
  /** Paper metadata including title and summary */
  metadata: PaperMetadata;
  /** Similarity score to the search query (0-1 range) */
  similarity: number;
}

/**
 * Request payload for the search API
 */
export interface SearchRequest {
  /** Search query string */
  query: string;
}

/**
 * Response type for the search API (array of papers)
 */
export type SearchResponse = Paper[];

/**
 * Request payload for the search_paper API (expand related papers)
 */
export interface SearchPaperRequest {
  /** UUID of the paper to find related papers for */
  paper_id: string;
  /** Optional: Context from chat conversation to influence related paper selection */
  conversation?: string;
}

/**
 * Chat message object representing user or assistant messages
 */
export interface ChatMessage {
  /** Role of the message sender */
  role: 'user' | 'assistant';
  /** Content of the message */
  content: string;
  /** Optional timestamp in milliseconds since epoch */
  timestamp?: number;
}

/**
 * Request payload for the chat API
 */
export interface ChatRequest {
  /** UUID of the paper being discussed */
  paper_id: string;
  /** User's message or question */
  message: string;
  /** Optional: Previous messages for context */
  conversation_history?: ChatMessage[];
}

/**
 * Response type for the chat API
 */
export interface ChatResponse {
  /** Assistant's response to the user's message */
  response: string;
  /** Optional: Additional paper context */
  paper_context?: {
    title: string;
    relevant_sections?: string[];
  };
}
