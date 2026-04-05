'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

const loadingMessages = [
  'Even mijn motor starten...',
  'Even wachten gabber van me...',
  'Doe de groetjes aan tante Greet...',
  'Koffie aan het zetten...',
  'Even m\'n hersenen opwarmen...',
  'Bezig bezig bezig...',
  'Eén momentje, ik check m\'n notities...',
  'Siri zou hier langer over doen...',
  'Even snel door m\'n LinkedIn scrollen...',
  'Marketing magie aan het brouwen...',
  'Laden... net als mijn geduld op maandagochtend...',
  'SQL query aan het draaien in m\'n hoofd...',
  'Bijna klaar, beloofd!',
];

function getRandomLoading() {
  return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
}

function renderMarkdown(text: string) {
  // Convert **bold** to <strong>, *italic* to <em>, and newlines to <br>
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px;font-size:12px">$1</code>')
    .replace(/\n/g, '<br/>');
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Yo! Ik ben Samba — of ja, een digitale versie van mezelf. Vraag me alles over m\'n werk, skills, projecten, of gewoon wat ik luister op Spotify. Let\'s go!' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingText]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Rotate loading messages
  useEffect(() => {
    if (isLoading) {
      setLoadingText(getRandomLoading());
      loadingInterval.current = setInterval(() => {
        setLoadingText(getRandomLoading());
      }, 2500);
    } else {
      if (loadingInterval.current) clearInterval(loadingInterval.current);
    }
    return () => { if (loadingInterval.current) clearInterval(loadingInterval.current); };
  }, [isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const apiMessages = [...messages.slice(1), { role: 'user' as const, content: userMessage }];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Oeps, er ging iets mis aan mijn kant. Stuur me anders een mailtje op samba@sambajarju.nl — dan antwoord de echte Samba!',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'Wat luister je nu?',
    'Waarom zou ik je aannemen?',
    'Vertel over PayWatch',
  ];

  const handleQuickQuestion = (q: string) => {
    setInput(q);
    // Need to trigger send after state update
    setTimeout(() => {
      const fakeEvent = { trim: () => q } as unknown;
      setMessages(prev => [...prev, { role: 'user', content: q }]);
      setIsLoading(true);
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages.slice(1), { role: 'user', content: q }] }),
      })
        .then(r => r.json())
        .then(data => setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]))
        .catch(() => setMessages(prev => [...prev, { role: 'assistant', content: 'Oeps, probeer het later nog eens!' }]))
        .finally(() => setIsLoading(false));
      setInput('');
    }, 50);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/25 flex items-center justify-center transition-colors"
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

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: 'min(540px, calc(100vh - 140px))' }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border bg-background-alt flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">SJ</div>
              <div>
                <p className="font-bold text-foreground text-sm">Samba (AI clone)</p>
                <p className="text-[11px] text-foreground-subtle flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Powered by Claude
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-[9px] font-bold">SJ</div>
                  )}
                  <div
                    className={`px-3 py-2 rounded-xl text-sm leading-relaxed max-w-[80%] ${
                      msg.role === 'user'
                        ? 'bg-accent text-white rounded-br-md'
                        : 'bg-background-alt text-foreground rounded-bl-md'
                    }`}
                    dangerouslySetInnerHTML={msg.role === 'assistant' ? { __html: renderMarkdown(msg.content) } : undefined}
                  >
                    {msg.role === 'user' ? msg.content : undefined}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3 h-3 text-foreground-muted" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-white text-[9px] font-bold">SJ</div>
                  <div className="px-3 py-2 rounded-xl bg-background-alt rounded-bl-md">
                    <motion.p
                      key={loadingText}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-foreground-subtle italic flex items-center gap-1.5"
                    >
                      <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
                      {loadingText}
                    </motion.p>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-background-alt text-foreground-muted hover:text-foreground hover:border-border-hover transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Vraag me wat..."
                  className="flex-1 bg-background-alt border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle outline-none focus:border-accent transition-colors"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-lg bg-accent text-white disabled:opacity-40 hover:bg-accent-hover transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
