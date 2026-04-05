'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

function getTime() {
  return new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

function renderContent(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

function TypingDots() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">SJ</div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-[#E9E9EB] dark:bg-[#3A3A3C]">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#8E8E93]"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hey! Stel me gerust een vraag over mijn werk, ervaring, of projecten.', time: getTime() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || rateLimited) return;
    const userMessage = input.trim().slice(0, 500);
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, time: getTime() }]);
    setIsLoading(true);

    try {
      const apiMessages = messages.slice(1).map(m => ({ role: m.role, content: m.content }));
      apiMessages.push({ role: 'user', content: userMessage });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (data.rateLimited) {
        setRateLimited(true);
      }
      if (data.remaining !== undefined) {
        setRemaining(data.remaining);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.error || 'Er ging iets mis.', time: getTime() }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Er ging iets mis. Stuur me gerust een mail op samba@sambajarju.nl!',
        time: getTime(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/25 flex items-center justify-center transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-[370px] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-border"
            style={{ maxHeight: 'min(520px, calc(100vh - 140px))' }}
          >
            {/* Header */}
            <div className="bg-surface/95 backdrop-blur-xl px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">SJ</div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-surface" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm leading-tight">Samba Jarju</p>
                  <p className="text-[11px] text-foreground-subtle">Online</p>
                </div>
              </div>
              {remaining !== null && remaining <= 5 && (
                <span className="text-[10px] text-foreground-subtle">{remaining} berichten over</span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 min-h-[220px] bg-background">
              <div className="text-center mb-3">
                <span className="text-[10px] text-foreground-subtle bg-surface px-2.5 py-0.5 rounded-full">Vandaag</span>
              </div>

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mb-4">SJ</div>
                  )}
                  <div className="flex flex-col gap-0.5" style={{ maxWidth: '78%' }}>
                    <div
                      className={`px-3.5 py-2 text-[14px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-accent text-white rounded-2xl rounded-br-md'
                          : 'bg-[#E9E9EB] dark:bg-[#3A3A3C] text-[#1C1C1E] dark:text-[#F2F2F7] rounded-2xl rounded-bl-md'
                      }`}
                      dangerouslySetInnerHTML={msg.role === 'assistant' ? { __html: renderContent(msg.content) } : undefined}
                    >
                      {msg.role === 'user' ? msg.content : undefined}
                    </div>
                    <span className={`text-[10px] text-foreground-subtle px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </span>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 mb-4">
                      <User className="w-3 h-3 text-foreground-muted" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <TypingDots />
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-surface/95 backdrop-blur-xl px-3 py-2 border-t border-border">
              {rateLimited ? (
                <p className="text-xs text-foreground-subtle text-center py-2">
                  Maximale berichten bereikt. Kom morgen terug of mail samba@sambajarju.nl
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value.slice(0, 500))}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Stel een vraag..."
                    className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground placeholder:text-foreground-subtle outline-none focus:border-accent transition-colors"
                    disabled={isLoading}
                    maxLength={500}
                  />
                  <motion.button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="w-8 h-8 rounded-full bg-accent text-white disabled:opacity-30 flex items-center justify-center flex-shrink-0"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
