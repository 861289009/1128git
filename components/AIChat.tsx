/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { streamCozeResponse, callCozeCompletions } from '../services/cozeService';
import { ChatMessage } from '../types';

interface AIChatProps {
  embedded?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onStartThinking?: () => void;
  onFinishThinking?: () => void;
  onInputChange?: () => void;
  className?: string;
}

const AIChat: React.FC<AIChatProps> = ({
  embedded = false,
  isOpen: controlledIsOpen,
  onClose,
  onStartThinking,
  onFinishThinking,
  onInputChange,
  className
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  // If embedded, use controlledIsOpen (defaulting to true if undefined, or handle logic).
  // Actually, if embedded, parent controls visibility.
  const isOpen = embedded ? controlledIsOpen : internalIsOpen;

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '嗨！我是豆沙包，一个AI智能体，因为穷所以只能回答你3个问题。有什么能帮你的？？？' }
  ]);
  const MAX_QUESTIONS = 3;
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const STORAGE_KEY = 'sabao_questions_used';

  // Load persisted count on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const n = parseInt(saved, 10);
        if (!Number.isNaN(n)) {
          setQuestionsUsed(n);
        }
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  // Persist count whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(questionsUsed));
    } catch (e) {
      // ignore storage errors
    }
  }, [questionsUsed]);

  const renderMessageContent = (text: string) => {
    const tokens = text.split(/(豆沙包|AI智能体|3个问题|穷)/g);
    return (
      <>
        {tokens.map((t, i) => (
          t === '穷' ? (
            <span
              key={i}
              className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-red-600 drop-shadow-md animate-pulse"
            >
              {t}
            </span>
          ) : /(豆沙包|AI智能体|3个问题)/.test(t) ? (
            <span key={i} className="font-bold">{t}</span>
          ) : (
            <span key={i}>{t}</span>
          )
        ))}
      </>
    );
  };
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // Typewriter refs for streaming/aggregated answers
  const typingTimerRef = useRef<number | null>(null);
  const typingTargetRef = useRef<string>('');
  const typingCurrentRef = useRef<string>('');
  const typingDoneRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (questionsUsed >= MAX_QUESTIONS) {
      setMessages(prev => [...prev, { role: 'model', text: '额度已用完：我只能回答3个问题。' }]);
      return;
    }

    onStartThinking?.(); // Trigger thinking state

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setQuestionsUsed(q => q + 1);

    // Slight delay to allow state update to render before scrolling
    setTimeout(scrollToBottom, 100);

    // Add initial empty model message
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    // Reset typing state for new answer
    if (typingTimerRef.current !== null) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    typingTargetRef.current = '';
    typingCurrentRef.current = '';
    typingDoneRef.current = false;

    const startTyping = () => {
      if (typingTimerRef.current !== null) return;
      typingTimerRef.current = window.setInterval(() => {
        const target = typingTargetRef.current;
        const current = typingCurrentRef.current;
        if (current === target && typingDoneRef.current) {
          if (typingTimerRef.current !== null) {
            window.clearInterval(typingTimerRef.current);
            typingTimerRef.current = null;
          }
          return;
        }
        const remaining = target.length - current.length;
        if (remaining <= 0) return;
        const step = Math.min(remaining, Math.max(1, Math.floor(target.length / 120)));
        const next = target.slice(0, current.length + step);
        typingCurrentRef.current = next;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'model') {
            lastMsg.text = next;
          }
          return newMessages;
        });
        scrollToBottom();
      }, 20);
    };

    // Prefer v1 completions for final result; fall back to SSE stream
    try {
      const finalText = await callCozeCompletions(input);
      typingTargetRef.current = finalText || '';
      startTyping();
    } catch (e) {
      await streamCozeResponse(
        input,
        (chunk) => {
          typingTargetRef.current = chunk || '';
          startTyping();
        },
        () => {
          setIsLoading(false);
          typingDoneRef.current = true;
          onFinishThinking?.();
        },
        (error) => {
          console.error(error);
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg.role === 'model') {
              lastMsg.text += "\n[Connection Interrupted]";
            }
            return newMessages;
          });
          typingDoneRef.current = true;
          setIsLoading(false);
          onFinishThinking?.();
        }
      );
    } finally {
      // Ensure loading state is cleared if completions succeeded
      setIsLoading(false);
      typingDoneRef.current = true;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onInputChange?.();
  };

  if (embedded) {
    // Embedded mode: Render only the chat content, no toggle button, custom container
    if (!isOpen) return null;

    return (
      <div className={`flex flex-col h-full bg-gradient-to-br from-blue-50/95 to-white/95 backdrop-blur-xl border border-blue-200/50 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 ${className || ''}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex justify-between items-center border-b border-blue-400/30 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <h3 className="font-heading font-bold text-white tracking-wider">沙包智能</h3>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-white/50 hover:text-white" data-hover="true">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth min-h-0"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none shadow-md shadow-blue-500/20'
                  : 'bg-white text-gray-800 rounded-tl-none border border-blue-200/50 shadow-sm'
                  }`}
              >
                {renderMessageContent(msg.text)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-lg rounded-tl-none flex gap-1 border border-blue-200/50 shadow-sm">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-blue-200/30 bg-blue-50/50 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`剩余次数：${Math.max(0, MAX_QUESTIONS - questionsUsed)} / ${MAX_QUESTIONS}`}
              disabled={questionsUsed >= MAX_QUESTIONS}
              className="flex-1 bg-transparent text-gray-800 placeholder-blue-400/50 text-sm focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || questionsUsed >= MAX_QUESTIONS}
              className="bg-gradient-to-r from-blue-600 to-blue-500 p-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 shadow-md shadow-blue-500/30"
              data-hover="true"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default mode (Floating widget)
  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {internalIsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[90vw] md:w-96 bg-gradient-to-br from-blue-50/95 to-white/95 backdrop-blur-xl border border-blue-200/50 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex justify-between items-center border-b border-blue-400/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                <h3 className="font-heading font-bold text-white tracking-wider">沙包智能</h3>
              </div>
              <button onClick={() => setInternalIsOpen(false)} className="text-white/50 hover:text-white" data-hover="true">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="h-64 md:h-80 overflow-y-auto p-4 space-y-3 scroll-smooth"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none shadow-md shadow-blue-500/20'
                      : 'bg-white text-gray-800 rounded-tl-none border border-blue-200/50 shadow-sm'
                      }`}
                  >
                    {renderMessageContent(msg.text)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg rounded-tl-none flex gap-1 border border-blue-200/50 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-blue-200/30 bg-blue-50/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`剩余次数：${Math.max(0, MAX_QUESTIONS - questionsUsed)} / ${MAX_QUESTIONS}`}
                  disabled={questionsUsed >= MAX_QUESTIONS}
                  className="flex-1 bg-transparent text-gray-800 placeholder-blue-400/50 text-sm focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || questionsUsed >= MAX_QUESTIONS}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 p-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 shadow-md shadow-blue-500/30"
                  data-hover="true"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setInternalIsOpen(!internalIsOpen)}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black flex items-center justify-center shadow-lg shadow-black/20 border border-white/20 z-50 group"
        data-hover="true"
      >
        {internalIsOpen ? (
          <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
        ) : (
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:animate-bounce" />
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;
