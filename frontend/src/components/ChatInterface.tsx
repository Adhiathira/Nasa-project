import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { ChatMessage } from '../types/api';

/**
 * Props interface for ChatInterface component
 */
interface ChatInterfaceProps {
  /** The paper ID being discussed */
  paperId: string;
  /** Array of chat messages to display */
  messages: ChatMessage[];
  /** Callback when user sends a message */
  onSendMessage: (message: string) => void;
  /** Loading state while waiting for API response */
  isLoading?: boolean;
}

/**
 * ChatInterface Component
 *
 * Interactive chat interface for discussing research papers with AI assistant.
 * Features auto-scrolling messages, user input with keyboard support, and
 * cosmic frosted-glass styling matching the InfoPanel design.
 *
 * Features:
 * - Auto-scroll to bottom when new messages arrive
 * - User messages (right-aligned, blue) and assistant messages (left-aligned, gray)
 * - Enter to send, Shift+Enter for new line
 * - Disabled input while loading
 * - Empty state message when no chat history
 * - Smooth transitions and hover effects
 *
 * Design Specifications:
 * - Matches InfoPanel frosted glass theme
 * - Message bubbles with rounded corners and padding
 * - Scrollable message container with custom scrollbar
 * - Sticky input area at bottom
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  paperId,
  messages,
  onSendMessage,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    console.log('[ChatInterface] Messages updated, scrolling to bottom');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSend = () => {
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isLoading) {
      console.log('[ChatInterface] Cannot send empty message or while loading');
      return;
    }

    console.log('[ChatInterface] Sending message for paper:', paperId);
    console.log('[ChatInterface] Message content:', trimmedMessage);

    onSendMessage(trimmedMessage);
    setInputValue('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Handle Enter key (send) vs Shift+Enter (new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message Display Area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
        }}
      >
        {messages.length === 0 ? (
          // Empty state
          <div className="flex items-center justify-center h-full">
            <p className="text-white/40 text-center italic">
              Start a conversation about this paper...
            </p>
          </div>
        ) : (
          // Message bubbles
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600/80 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <p className="text-white/60 text-sm">
                Thinking...
              </p>
            </div>
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? "Waiting for response..." : "Type your message..."}
            className="flex-1 bg-white/10 text-white placeholder-white/40 px-3 py-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              minHeight: '40px',
              maxHeight: '120px',
            }}
            rows={1}
            aria-label="Chat message input"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="flex items-center justify-center w-10 h-10 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600/80"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-white/30 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
