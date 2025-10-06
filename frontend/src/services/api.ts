/**
 * API service layer for the 3D Research Graph MVP
 *
 * This module handles all HTTP requests to the FastAPI backend.
 * Uses fetch API with proper error handling and logging.
 */

import type { Paper, SearchRequest, SearchPaperRequest, ChatMessage, ChatRequest, ChatResponse } from '../types/api';

/**
 * Base URL for the API, configured via environment variable
 * Defaults to localhost:8000 if not set
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

console.log('[API Service] Initialized with base URL:', API_BASE_URL);

/**
 * Search for research papers based on a query string
 *
 * @param query - The search query string
 * @returns Promise resolving to an array of Paper objects
 * @throws Error if the API request fails or returns invalid data
 */
export async function searchPapers(query: string): Promise<Paper[]> {
  const url = `${API_BASE_URL}/api/search`;

  console.log('[API Service] Searching papers with query:', query);
  console.log('[API Service] Request URL:', url);

  try {
    const requestBody: SearchRequest = { query };

    console.log('[API Service] Request body:', JSON.stringify(requestBody));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[API Service] Response status:', response.status);
    console.log('[API Service] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API Service] Error response body:', errorText);
      throw new Error(
        `API request failed with status ${response.status}: ${errorText || response.statusText}`
      );
    }

    const data: Paper[] = await response.json();

    console.log('[API Service] Successfully received papers:', data.length);
    console.log('[API Service] Response data:', JSON.stringify(data, null, 2));

    // Validate response data structure
    if (!Array.isArray(data)) {
      console.error('[API Service] Invalid response format - expected array, got:', typeof data);
      throw new Error('Invalid API response format: expected array of papers');
    }

    // Validate each paper object
    data.forEach((paper, index) => {
      if (!paper.paper_id || !paper.metadata || typeof paper.similarity !== 'number') {
        console.error(`[API Service] Invalid paper object at index ${index}:`, paper);
        throw new Error(`Invalid paper object at index ${index}: missing required fields`);
      }
    });

    return data;
  } catch (error) {
    console.error('[API Service] Error in searchPapers:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to search papers: ${error.message}`);
    }

    throw new Error('Failed to search papers: Unknown error occurred');
  }
}

/**
 * Search for related papers based on a paper ID (expand functionality)
 *
 * @param paperId - The UUID of the paper to find related papers for
 * @param conversation - Optional conversation context to influence related paper selection
 * @returns Promise resolving to an array of Paper objects
 * @throws Error if the API request fails or returns invalid data
 */
export async function searchRelatedPapers(paperId: string, conversation?: string): Promise<Paper[]> {
  const url = `${API_BASE_URL}/api/search_paper`;

  console.log('[API Service] Searching related papers for paper_id:', paperId);
  console.log('[API Service] Request URL:', url);

  try {
    const requestBody: SearchPaperRequest = {
      paper_id: paperId,
      conversation,
    };

    console.log('[API Service] Request body:', JSON.stringify(requestBody));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[API Service] Response status:', response.status);
    console.log('[API Service] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API Service] Error response body:', errorText);
      throw new Error(
        `API request failed with status ${response.status}: ${errorText || response.statusText}`
      );
    }

    const data: Paper[] = await response.json();

    console.log('[API Service] Successfully received related papers:', data.length);
    console.log('[API Service] Response data:', JSON.stringify(data, null, 2));

    // Validate response data structure
    if (!Array.isArray(data)) {
      console.error('[API Service] Invalid response format - expected array, got:', typeof data);
      throw new Error('Invalid API response format: expected array of papers');
    }

    // Validate each paper object
    data.forEach((paper, index) => {
      if (!paper.paper_id || !paper.metadata || typeof paper.similarity !== 'number') {
        console.error(`[API Service] Invalid paper object at index ${index}:`, paper);
        throw new Error(`Invalid paper object at index ${index}: missing required fields`);
      }
    });

    return data;
  } catch (error) {
    console.error('[API Service] Error in searchRelatedPapers:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to search related papers: ${error.message}`);
    }

    throw new Error('Failed to search related papers: Unknown error occurred');
  }
}

/**
 * Send a chat message about a specific paper
 *
 * @param paperId - The UUID of the paper being discussed
 * @param message - The user's message or question
 * @param conversationHistory - Optional array of previous messages for context
 * @returns Promise resolving to a ChatResponse object
 * @throws Error if the API request fails or returns invalid data
 */
export async function sendChatMessage(
  paperId: string,
  message: string,
  conversationHistory?: ChatMessage[]
): Promise<ChatResponse> {
  const url = `${API_BASE_URL}/api/chat`;

  console.log('[API Service] Sending chat message for paper:', paperId);
  console.log('[API Service] Chat request URL:', url);
  console.log('[API Service] User message:', message);

  try {
    const requestBody: ChatRequest = {
      paper_id: paperId,
      message,
      conversation_history: conversationHistory,
    };

    console.log('[API Service] Chat request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[API Service] Chat response status:', response.status);
    console.log('[API Service] Chat response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API Service] Chat error response body:', errorText);
      throw new Error(
        `Chat API request failed with status ${response.status}: ${errorText || response.statusText}`
      );
    }

    const data: ChatResponse = await response.json();

    console.log('[API Service] Successfully received chat response');
    console.log('[API Service] Chat response data:', JSON.stringify(data, null, 2));

    // Validate response data structure
    if (!data.response || typeof data.response !== 'string') {
      console.error('[API Service] Invalid chat response format:', data);
      throw new Error('Invalid chat API response format: missing or invalid response field');
    }

    return data;
  } catch (error) {
    console.error('[API Service] Error in sendChatMessage:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to send chat message: ${error.message}`);
    }

    throw new Error('Failed to send chat message: Unknown error occurred');
  }
}
