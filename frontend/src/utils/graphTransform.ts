/**
 * Graph Transformation Utilities
 *
 * Utility functions to transform API Paper data into the GraphNode and GraphLink
 * format required by the Graph3D component.
 */

import type { Paper } from '../types/api';
import type { GraphNode, GraphLink } from '../components/Graph3D';

/**
 * Validates that a paper has all required fields
 *
 * @param paper - Paper object to validate
 * @throws Error if paper is missing required fields
 */
function validatePaper(paper: Paper, index: number): void {
  if (!paper.paper_id) {
    throw new Error(`Paper at index ${index} is missing required field: paper_id`);
  }
  if (!paper.metadata) {
    throw new Error(`Paper at index ${index} is missing required field: metadata`);
  }
  if (!paper.metadata.title) {
    throw new Error(`Paper at index ${index} is missing required field: metadata.title`);
  }
  if (!paper.metadata.summary) {
    throw new Error(`Paper at index ${index} is missing required field: metadata.summary`);
  }
  if (typeof paper.similarity !== 'number') {
    throw new Error(`Paper at index ${index} is missing required field: similarity (must be a number)`);
  }
}

/**
 * Transforms an array of Paper objects from the API into GraphNode and GraphLink
 * arrays for the Graph3D component.
 *
 * **Current use case**: Initial search results
 * - Creates standalone nodes for each paper
 * - Returns empty links array (links are created later during "Expand" operations)
 *
 * **Node sizing**: Similarity scores (0-1) are scaled to node size values (0-10)
 * **Node coloring**: All initial search nodes use cosmic blue (#4a9eff)
 *
 * @param papers - Array of Paper objects from the search API
 * @returns Object containing nodes and links arrays
 * @throws Error if papers is not an array or if any paper has missing required fields
 *
 * @example
 * ```typescript
 * const searchResults = await searchPapers(query);
 * const { nodes, links } = transformPapersToGraph(searchResults);
 * // Pass nodes and links to Graph3D component
 * ```
 */
export function transformPapersToGraph(papers: Paper[]): {
  nodes: GraphNode[];
  links: GraphLink[];
} {
  // Validate input before accessing properties
  if (!Array.isArray(papers)) {
    throw new Error('transformPapersToGraph: papers parameter must be an array');
  }

  console.debug(`[transformPapersToGraph] Transforming ${papers.length} papers to graph format`);

  // Handle empty array - return empty nodes/links (don't throw)
  if (papers.length === 0) {
    console.debug('[transformPapersToGraph] Empty papers array provided, returning empty graph data');
    return {
      nodes: [],
      links: []
    };
  }

  // Transform papers to nodes
  const nodes: GraphNode[] = papers.map((paper, index) => {
    // Validate each paper has required fields
    validatePaper(paper, index);

    // Create GraphNode from Paper
    const node: GraphNode = {
      id: paper.paper_id,
      name: paper.metadata.title,
      summary: paper.metadata.summary,
      val: paper.similarity * 10, // Scale similarity (0-1) to node size (0-10)
      color: '#4a9eff' // Cosmic blue for all initial search nodes
    };

    return node;
  });

  console.debug(`[transformPapersToGraph] Created ${nodes.length} nodes`);

  // For initial search results, we don't create links
  // Links will be generated later during "Expand" operations when users explore
  // related papers. This keeps the initial visualization clean with standalone nodes.
  const links: GraphLink[] = [];

  console.debug(`[transformPapersToGraph] Created ${links.length} links`);

  // Log sample data for debugging (if nodes exist)
  if (nodes.length > 0) {
    console.debug('[transformPapersToGraph] Sample node:', {
      id: nodes[0].id,
      name: nodes[0].name,
      summary: nodes[0].summary?.substring(0, 100) + '...', // Truncate for readability
      val: nodes[0].val,
      color: nodes[0].color
    });
  }

  return {
    nodes,
    links
  };
}

/**
 * Note: Graph expansion and node/edge deduplication logic
 * is handled by the Zustand store's addExpandedNodes() action.
 * See frontend/src/store/useAppStore.ts for the expansion implementation.
 *
 * The store handles:
 * - Node deduplication by paper_id
 * - Bidirectional edge deduplication
 * - Unique color generation per expansion session
 * - Edge width mapping from similarity scores
 */
