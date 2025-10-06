import React from 'react';
import { X } from 'lucide-react';
import ChatInterface from './ChatInterface';
import type { Paper, ChatMessage } from '../types/api';

/**
 * Props interface for InfoPanel component
 */
interface InfoPanelProps {
  /** Controls visibility and slide animation */
  isOpen: boolean;
  /** The search query text to display */
  searchQuery: string;
  /** Number of papers found in search results */
  paperCount: number;
  /** Close button click handler */
  onClose: () => void;
  /** Selected paper to display details for (null/undefined = show search results) */
  selectedPaper?: Paper | null;
  /** Handler for expand button click */
  onExpand?: (paperId: string) => void;
  /** Handler for chat button click */
  onChat?: (paperId: string) => void;
  /** Indicates whether chat mode is active */
  isChatMode?: boolean;
  /** Chat messages for the selected paper */
  chatMessages?: ChatMessage[];
  /** Handler for sending chat messages */
  onSendMessage?: (message: string) => void;
  /** Loading state for chat */
  isChatLoading?: boolean;
}

/**
 * InfoPanel Component
 *
 * A right-side frosted glass panel that slides in when transitioning from search to graph view.
 * Supports three modes:
 * 1. Search Results View - Displays search query information and paper count
 * 2. Paper Details View - Displays selected paper details with expand/chat actions
 * 3. Chat View - Interactive chat interface for discussing the selected paper
 *
 * Features:
 * - Slide-in/out animation from the right
 * - Frosted glass effect with cosmic theme styling
 * - Close button with hover effects
 * - Conditional rendering based on selectedPaper and isChatMode props
 * - Scrollable summary section for long content
 * - Interactive chat with message history
 * - Accessible with aria-labels
 *
 * Design Specifications:
 * - Width: 400px
 * - Position: Fixed on right side, full viewport height
 * - Z-index: 10 (above graph, below reset button which is z-20)
 * - Animation: 300ms ease-out slide transition
 */
const InfoPanel: React.FC<InfoPanelProps> = ({
  isOpen,
  searchQuery,
  paperCount,
  onClose,
  selectedPaper,
  onExpand,
  onChat,
  isChatMode = false,
  chatMessages = [],
  onSendMessage,
  isChatLoading = false,
}) => {
  return (
    <div
      className="w-[400px] h-full bg-black/40 backdrop-blur-xl border-l border-white/20 z-10 transition-transform duration-300 ease-out"
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
      }}
      role="complementary"
      aria-label="Search results information panel"
    >
      {/* Header with close button */}
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          aria-label="Close information panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content section - conditionally render based on mode */}
      <div className="px-6 space-y-6 flex flex-col h-[calc(100%-60px)]">
        {selectedPaper ? (
          /* ============ PAPER DETAILS VIEW (MODE 2) ============ */
          <>
            {/* Title */}
            <h2 className="text-2xl font-bold text-white">
              Paper Details
            </h2>

            {/* Paper title display */}
            <div className="space-y-2">
              <p className="text-sm text-white/50 uppercase tracking-wider">
                Title
              </p>
              <p className="text-lg text-white/90 break-words">
                {selectedPaper.metadata.title}
              </p>
            </div>

            {/* Paper summary display with scrollable container */}
            <div className="space-y-2">
              <p className="text-sm text-white/50 uppercase tracking-wider">
                Summary
              </p>
              <div
                className="text-lg text-white/90 max-h-[200px] overflow-y-auto pr-2"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
                }}
              >
                {selectedPaper.metadata.summary}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Action buttons - only show if handlers are provided */}
            {onExpand && onChat && (
              <div className="flex gap-3">
                <button
                  onClick={() => onExpand(selectedPaper.paper_id)}
                  className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all active:scale-95"
                  aria-label="Expand to show related papers"
                >
                  Expand
                </button>
                <button
                  onClick={() => onChat(selectedPaper.paper_id)}
                  className="px-4 py-2 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all active:scale-95"
                  aria-label="Start chat about this paper"
                >
                  Chat
                </button>
              </div>
            )}

            {/* Chat interface - shows when chat mode is active */}
            {isChatMode && onSendMessage && (
              <>
                <div className="border-t border-white/10" />
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ChatInterface
                    paperId={selectedPaper.paper_id}
                    messages={chatMessages}
                    onSendMessage={onSendMessage}
                    isLoading={isChatLoading}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          /* ============ SEARCH RESULTS VIEW (MODE 1) ============ */
          <>
            {/* Title */}
            <h2 className="text-2xl font-bold text-white">
              Search Results
            </h2>

            {/* Search query display */}
            <div className="space-y-2">
              <p className="text-sm text-white/50 uppercase tracking-wider">
                Query
              </p>
              <p className="text-lg text-white/90 break-words">
                "{searchQuery}"
              </p>
            </div>

            {/* Paper count display */}
            <div className="space-y-2">
              <p className="text-sm text-white/50 uppercase tracking-wider">
                Results
              </p>
              <p className="text-lg text-white/90">
                Found{' '}
                <span className="text-[#4a9eff] font-semibold">
                  {paperCount}
                </span>{' '}
                research paper{paperCount !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Additional info/actions placeholder */}
            <div className="text-sm text-white/40 italic">
              Click on nodes to explore connections
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
