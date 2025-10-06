/**
 * Zustand store for managing 3D Research Graph application state
 *
 * This store manages:
 * - Search query and results
 * - UI state transitions (search bar → graph)
 * - Node selection state
 */

import { create } from 'zustand';
import type { Paper, ChatMessage } from '../types/api';
import type { GraphNode, GraphLink } from '../components/Graph3D';

/**
 * Application state interface
 */
interface AppState {
  // Search state
  /** Current search query string */
  searchQuery: string;
  /** Array of papers from search results */
  papers: Paper[];
  /** Controls search bar → graph transition */
  isSearchActive: boolean;

  // UI state
  /** paper_id of currently selected node (for future use) */
  selectedNode: string | null;
  /** Controls InfoPanel visibility */
  isPanelOpen: boolean;

  // Chat state
  /** Chat message history keyed by paper_id */
  chatSessions: Map<string, ChatMessage[]>;
  /** Controls whether chat interface is active */
  isChatMode: boolean;

  // Graph data management
  /** All nodes in the 3D graph */
  graphNodes: GraphNode[];
  /** All edges/links in the 3D graph */
  graphLinks: GraphLink[];
  /** Color mapping for each expansion session (keyed by session ID) */
  expandSessionColors: Map<string, string>;

  // Actions
  /** Update the search query string */
  setSearchQuery: (query: string) => void;
  /** Store search results papers */
  setPapers: (papers: Paper[]) => void;
  /** Control search bar visibility (false = show search, true = show graph) */
  setSearchActive: (active: boolean) => void;
  /** Set the currently selected node */
  setSelectedNode: (nodeId: string | null) => void;
  /** Set InfoPanel open/closed state */
  setPanelOpen: (open: boolean) => void;
  /** Reset all state to initial values */
  reset: () => void;

  // Chat actions
  /** Toggle chat mode on/off */
  setChatMode: (active: boolean) => void;
  /** Add a message to a paper's chat history */
  addChatMessage: (paperId: string, message: ChatMessage) => void;
  /** Get chat history for a specific paper */
  getChatHistory: (paperId: string) => ChatMessage[];
  /** Clear chat history for a specific paper */
  clearChatHistory: (paperId: string) => void;

  // Graph actions
  /** Initialize graph with search results */
  setGraphData: (nodes: GraphNode[], links: GraphLink[]) => void;
  /** Add expanded nodes and edges with deduplication */
  addExpandedNodes: (sourceNodeId: string, newPapers: Paper[], conversationContext?: string) => void;
  /** Generate a unique color for an expansion session */
  generateExpandColor: () => string;
}

/**
 * Initial state values
 */
const initialState = {
  searchQuery: '',
  papers: [],
  isSearchActive: false,
  selectedNode: null,
  isPanelOpen: false,
  chatSessions: new Map<string, ChatMessage[]>(),
  isChatMode: false,
  graphNodes: [],
  graphLinks: [],
  expandSessionColors: new Map<string, string>(),
};

/**
 * Zustand store for application state management
 */
const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  setSearchQuery: (query: string) => {
    console.log('[useAppStore] setSearchQuery:', query);
    set({ searchQuery: query });
  },

  setPapers: (papers: Paper[]) => {
    console.log('[useAppStore] setPapers: Storing', papers.length, 'papers');
    set({ papers });
  },

  setSearchActive: (active: boolean) => {
    console.log('[useAppStore] setSearchActive:', active ? 'Showing graph' : 'Showing search');
    set({ isSearchActive: active });
  },

  setSelectedNode: (nodeId: string | null) => {
    console.log('[useAppStore] setSelectedNode:', nodeId || 'none');
    set({ selectedNode: nodeId });
  },

  setPanelOpen: (open: boolean) => {
    console.log('[useAppStore] setPanelOpen:', open ? 'Opening panel' : 'Closing panel');
    set({ isPanelOpen: open });
  },

  reset: () => {
    console.log('[useAppStore] reset: Resetting all state to initial values');
    set(initialState);
  },

  setChatMode: (active: boolean) => {
    console.log('[useAppStore] setChatMode:', active ? 'Entering chat mode' : 'Exiting chat mode');
    set({ isChatMode: active });
  },

  addChatMessage: (paperId: string, message: ChatMessage) => {
    console.log('[useAppStore] addChatMessage for paper:', paperId, 'Role:', message.role);
    set((state) => {
      const newSessions = new Map(state.chatSessions);
      const currentHistory = newSessions.get(paperId) || [];
      newSessions.set(paperId, [...currentHistory, message]);
      console.log('[useAppStore] Chat history length for', paperId, ':', newSessions.get(paperId)?.length);
      return { chatSessions: newSessions };
    });
  },

  getChatHistory: (paperId: string): ChatMessage[] => {
    const state = get();
    const history = state.chatSessions.get(paperId) || [];
    console.log('[useAppStore] getChatHistory for paper:', paperId, 'Found', history.length, 'messages');
    return history;
  },

  clearChatHistory: (paperId: string) => {
    console.log('[useAppStore] clearChatHistory for paper:', paperId);
    set((state) => {
      const newSessions = new Map(state.chatSessions);
      newSessions.delete(paperId);
      return { chatSessions: newSessions };
    });
  },

  setGraphData: (nodes: GraphNode[], links: GraphLink[]) => {
    console.log('[useAppStore] setGraphData:', nodes.length, 'nodes,', links.length, 'links');
    set({ graphNodes: nodes, graphLinks: links });
  },

  generateExpandColor: (): string => {
    // Generate random hex color
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    console.log('[useAppStore] generateExpandColor: Generated color', randomColor);
    return randomColor;
  },

  addExpandedNodes: (sourceNodeId: string, newPapers: Paper[], _conversationContext?: string) => {
    const state = get();
    const expandColor = get().generateExpandColor();
    const sessionId = `expand-${Date.now()}-${sourceNodeId}`;

    console.log('[useAppStore] addExpandedNodes: Starting expansion from node', sourceNodeId, 'with', newPapers.length, 'papers');
    console.log('[useAppStore] Expansion session ID:', sessionId, 'Color:', expandColor);

    // Helper function for edge existence check (bidirectional)
    const edgeExists = (links: GraphLink[], sourceId: string, targetId: string): boolean => {
      return links.some(link => {
        const linkSource = typeof link.source === 'string' ? link.source : link.source.id;
        const linkTarget = typeof link.target === 'string' ? link.target : link.target.id;
        return (linkSource === sourceId && linkTarget === targetId) ||
               (linkSource === targetId && linkTarget === sourceId);
      });
    };

    const newNodes: GraphNode[] = [];
    const newLinks: GraphLink[] = [];
    const newPapersToAdd: Paper[] = [];  // Track new papers to add to papers array
    let duplicateNodesSkipped = 0;
    let duplicateEdgesSkipped = 0;

    // Process each new paper
    for (const paper of newPapers) {
      const nodeId = paper.paper_id;

      // Check for node deduplication
      const nodeExists = state.graphNodes.some(node => node.id === nodeId);

      if (!nodeExists) {
        // Create new node
        const newNode: GraphNode = {
          id: nodeId,
          name: paper.metadata.title,
          summary: paper.metadata.summary,
          color: expandColor,
          val: paper.similarity * 10  // Scale similarity (0-1) to node size
        };
        newNodes.push(newNode);

        // Also add paper to papers array for selectedPaper lookup in HomePage
        newPapersToAdd.push(paper);

        console.log('[useAppStore] Adding new node:', nodeId, 'with val:', newNode.val);
      } else {
        duplicateNodesSkipped++;
        console.log('[useAppStore] Skipping duplicate node:', nodeId);
      }

      // Check for edge deduplication (bidirectional)
      const linkExists = edgeExists([...state.graphLinks, ...newLinks], sourceNodeId, nodeId);

      if (!linkExists) {
        // Create new edge
        const newLink: GraphLink = {
          source: sourceNodeId,
          target: nodeId,
          color: expandColor,
          value: paper.similarity  // Use similarity for edge width
        };
        newLinks.push(newLink);
        console.log('[useAppStore] Adding new edge:', sourceNodeId, '->', nodeId, 'with value:', paper.similarity);
      } else {
        duplicateEdgesSkipped++;
        console.log('[useAppStore] Skipping duplicate edge between:', sourceNodeId, 'and', nodeId);
      }
    }

    // Update state with new nodes and links
    set((state) => ({
      graphNodes: [...state.graphNodes, ...newNodes],
      graphLinks: [...state.graphLinks, ...newLinks],
      papers: [...state.papers, ...newPapersToAdd],  // Add new papers to papers array
      expandSessionColors: new Map(state.expandSessionColors).set(sessionId, expandColor)
    }));

    console.log('[useAppStore] Expansion complete. Session:', sessionId);
    console.log('[useAppStore] Added', newNodes.length, 'new nodes,', newLinks.length, 'new edges');
    console.log('[useAppStore] Skipped', duplicateNodesSkipped, 'duplicate nodes,', duplicateEdgesSkipped, 'duplicate edges');
    console.log('[useAppStore] Added', newPapersToAdd.length, 'new papers to papers array');
    console.log('[useAppStore] Total papers in array:', state.papers.length + newPapersToAdd.length);
    console.log('[useAppStore] Total graph size:', state.graphNodes.length + newNodes.length, 'nodes,', state.graphLinks.length + newLinks.length, 'edges');
  },
}));

export default useAppStore;
