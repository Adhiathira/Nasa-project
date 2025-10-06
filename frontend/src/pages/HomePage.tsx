import { useMemo, useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Graph3D from '../components/Graph3D';
import InfoPanel from '../components/InfoPanel';
import useAppStore from '../store/useAppStore';
import { transformPapersToGraph } from '../utils/graphTransform';
import { sendChatMessage, searchRelatedPapers } from '../services/api';
import type { GraphNode } from '../components/Graph3D';
import type { Paper, ChatMessage } from '../types/api';

function HomePage() {
  // Get state from Zustand store
  const {
    isSearchActive,
    papers,
    reset,
    setSelectedNode,
    selectedNode,
    isPanelOpen,
    setPanelOpen,
    searchQuery,
    isChatMode,
    setChatMode,
    getChatHistory,
    addChatMessage,
    graphNodes,
    graphLinks,
    setGraphData,
    addExpandedNodes
  } = useAppStore();

  // Local state for chat loading
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Get graph data from store
  const graphData = useMemo(() => {
    console.debug('[HomePage] Graph data from store:', graphNodes.length, 'nodes,', graphLinks.length, 'links');
    return { nodes: graphNodes, links: graphLinks };
  }, [graphNodes, graphLinks]);

  // Initialize graph data when search results arrive
  useEffect(() => {
    if (papers.length > 0 && graphNodes.length === 0) {
      console.log('[HomePage] Initializing graph from search results');
      const transformed = transformPapersToGraph(papers);
      setGraphData(transformed.nodes, transformed.links);
    }
  }, [papers, graphNodes.length, setGraphData]);

  // Derive selected paper from store
  const selectedPaper: Paper | null = useMemo(() => {
    if (!selectedNode) return null;
    return papers.find(paper => paper.paper_id === selectedNode) || null;
  }, [selectedNode, papers]);

  // Handle node click events
  const handleNodeClick = (node: GraphNode) => {
    console.log('[HomePage] Node clicked:', node.id, node.name);
    setSelectedNode(node.id);
    setPanelOpen(true);
    // Keep chat mode active when switching nodes - just show different paper's chat
    console.log('[HomePage] Node switched, chat mode remains:', isChatMode);
  };

  // Handle expand button click
  const handleExpand = async (paperId: string) => {
    console.log('[HomePage] Expand clicked for paper:', paperId);

    try {
      // Get conversation context if in chat mode
      let conversationContext: string | undefined;
      if (isChatMode && selectedNode) {
        const chatHistory = getChatHistory(selectedNode);
        if (chatHistory.length > 0) {
          // Convert chat history to string format
          conversationContext = chatHistory
            .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n');
          console.log('[HomePage] Using conversation context with', chatHistory.length, 'messages');
        }
      }

      // Call API to get related papers
      console.log('[HomePage] Calling searchRelatedPapers API for paper:', paperId);
      const relatedPapers = await searchRelatedPapers(paperId, conversationContext);
      console.log('[HomePage] Received', relatedPapers.length, 'related papers');

      // Add expanded nodes to graph with deduplication
      addExpandedNodes(paperId, relatedPapers, conversationContext);
      console.log('[HomePage] Expand complete - graph updated');

    } catch (error) {
      console.error('[HomePage] Error in handleExpand:', error);
      // TODO: Show error message to user (optional for MVP)
    }
  };

  // Handle chat button click
  const handleChat = (paperId: string) => {
    console.log('[HomePage] Chat clicked for paper:', paperId);
    setChatMode(true);  // Switch to chat mode
    setPanelOpen(true); // Ensure panel is open
  };

  // Handle sending chat messages
  const handleSendMessage = async (message: string) => {
    console.log('[HomePage] handleSendMessage called with message:', message);

    // Validate we have a selected node
    if (!selectedNode) {
      console.error('[HomePage] No selected node - cannot send chat message');
      return;
    }

    try {
      // Create user message with timestamp
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: Date.now(),
      };

      console.log('[HomePage] Adding user message to chat history');
      addChatMessage(selectedNode, userMessage);

      // Set loading state
      setIsChatLoading(true);

      // Get conversation history for context
      const conversationHistory = getChatHistory(selectedNode);
      console.log('[HomePage] Conversation history length:', conversationHistory.length);

      // Call chat API
      console.log('[HomePage] Calling sendChatMessage API for paper:', selectedNode);
      const response = await sendChatMessage(selectedNode, message, conversationHistory);

      console.log('[HomePage] Chat API response received:', response.response);

      // Create assistant message from response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: Date.now(),
      };

      console.log('[HomePage] Adding assistant message to chat history');
      addChatMessage(selectedNode, assistantMessage);

      setIsChatLoading(false);
    } catch (error) {
      console.error('[HomePage] Error in handleSendMessage:', error);

      // Optionally add error message to chat
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: Date.now(),
      };

      if (selectedNode) {
        addChatMessage(selectedNode, errorMessage);
      }

      setIsChatLoading(false);
    }
  };

  // Handle reset button click
  const handleReset = () => {
    console.log('[HomePage] Reset button clicked, returning to search view');
    setPanelOpen(false);  // Close panel before reset
    reset();
  };

  // Log view transitions
  if (isSearchActive && papers.length > 0) {
    console.log('[HomePage] Switching to graph view with', papers.length, 'papers');
  }

  return (
    <div className="min-h-screen w-screen overflow-hidden">
      {!isSearchActive ? (
        // Search View - Initial landing page with cosmic background
        <div className="cosmic-background min-h-screen relative overflow-hidden flex items-center justify-center transition-opacity duration-500 ease-in-out">
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
      ) : (
        // Graph View - 3D visualization of search results
        <div className="relative w-full h-screen bg-black transition-opacity duration-500 ease-in-out">
          {/* 3D Force Graph Visualization */}
          <Graph3D
            nodes={graphData.nodes}
            links={graphData.links}
            onNodeClick={handleNodeClick}
            backgroundColor="#000000"
            className="w-full h-full"
          />

          {/* Info Panel - Right Side */}
          <InfoPanel
            isOpen={isPanelOpen}
            searchQuery={searchQuery}
            paperCount={papers.length}
            onClose={() => {
              setPanelOpen(false);
              // Exit chat mode when closing panel
              if (isChatMode) {
                console.log('[HomePage] Closing panel - exiting chat mode');
                setChatMode(false);
              }
            }}
            selectedPaper={selectedPaper}
            onExpand={handleExpand}
            onChat={handleChat}
            isChatMode={isChatMode}
            chatMessages={selectedNode ? getChatHistory(selectedNode) : []}
            onSendMessage={handleSendMessage}
            isChatLoading={isChatLoading}
          />

          {/* Floating Reset Button - Bottom Left */}
          <button
            onClick={handleReset}
            className="absolute bottom-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white border border-white/20 transition-all active:scale-95"
            aria-label="Return to search and reset graph"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Search</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
