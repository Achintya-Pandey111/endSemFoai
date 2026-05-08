import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Trash2, Bot, User, MinusSquare, Maximize2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { cn } from '../utils/cn';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, loading, sendMessage, clearChat } = useChat();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-background border border-foreground/20 overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 bg-foreground text-background flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-background/20">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-tighter">OrbitScope AI</h3>
                  <p className="text-[9px] uppercase tracking-widest opacity-60 font-bold">Sector Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={clearChat} className="p-2 hover:bg-background/10 transition-colors" title="Clear Chat">
                  <Trash2 size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-background/10 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-foreground/[0.02]"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <Bot size={32} className="text-foreground/10 mb-6" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed">
                    Awaiting intelligence queries. Ask about ISS telemetry or latest planetary news.
                  </p>
                </div>
              )}
              
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 text-[11px] leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-foreground text-background" 
                      : "bg-background border border-foreground/10 text-foreground"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              
              {loading && (
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="p-4 bg-background border border-foreground/10">
                    <div className="flex gap-1">
                      <span className="w-1 h-1 bg-foreground animate-pulse" />
                      <span className="w-1 h-1 bg-foreground animate-pulse [animation-delay:0.2s]" />
                      <span className="w-1 h-1 bg-foreground animate-pulse [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-6 border-t border-foreground/10 bg-background">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="QUERY DATABASE..."
                  className="w-full bg-foreground/[0.03] border border-foreground/10 py-4 px-4 pr-12 text-[10px] font-bold tracking-widest focus:outline-none focus:border-foreground transition-all uppercase"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-foreground hover:bg-foreground hover:text-background disabled:opacity-30 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-foreground text-background flex items-center justify-center relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute inset-0 bg-background/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <MessageCircle size={24} className="relative z-10" />
      </motion.button>
    </div>
  );
};

export default Chatbot;
