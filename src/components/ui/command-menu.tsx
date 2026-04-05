'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search, User, Briefcase, Code2, Wrench, MessageCircle, Mail, Phone,
  Moon, Sun, Monitor, Languages, ExternalLink, Command, FileText,
  Gamepad2, ArrowRight
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  keywords: string[];
  category: string;
}

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const scrollTo = (id: string) => {
    setIsOpen(false);
    // If on playground page, go back to home first
    if (pathname.includes('/playground')) {
      router.push(`/${locale}#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const switchLocale = () => {
    const newLocale = locale === 'nl' ? 'en' : 'nl';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setIsOpen(false);
  };

  const items: CommandItem[] = useMemo(() => [
    { id: 'about', label: 'About / Over mij', sublabel: 'Who is Samba?', icon: User, action: () => scrollTo('about'), keywords: ['about', 'over', 'wie', 'who', 'bio'], category: 'Navigate' },
    { id: 'projects', label: 'Projects / Projecten', sublabel: 'PayWatch, Workwings, etc.', icon: Code2, action: () => scrollTo('projects'), keywords: ['projects', 'projecten', 'paywatch', 'work'], category: 'Navigate' },
    { id: 'experience', label: 'Experience / Ervaring', sublabel: 'Vandebron, Silverflow, etc.', icon: Briefcase, action: () => scrollTo('experience'), keywords: ['experience', 'ervaring', 'vandebron', 'werk', 'work', 'cv'], category: 'Navigate' },
    { id: 'tools', label: 'Tools / Arsenaal', sublabel: 'Salesforce, HubSpot, Next.js', icon: Wrench, action: () => scrollTo('tools'), keywords: ['tools', 'stack', 'salesforce', 'hubspot', 'skills'], category: 'Navigate' },
    { id: 'contact', label: 'Contact', sublabel: 'Get in touch', icon: MessageCircle, action: () => scrollTo('contact'), keywords: ['contact', 'email', 'phone', 'bellen'], category: 'Navigate' },
    { id: 'playground', label: 'Playground / Speeltuin', sublabel: 'Interactive demos', icon: Gamepad2, action: () => { router.push(`/${locale}/playground`); setIsOpen(false); }, keywords: ['playground', 'speeltuin', 'demo', 'interactive', 'sql', 'roi'], category: 'Navigate' },
    { id: 'email-samba', label: 'Email Samba', sublabel: 'samba@sambajarju.nl', icon: Mail, action: () => { window.open('mailto:samba@sambajarju.nl'); setIsOpen(false); }, keywords: ['email', 'mail', 'samba'], category: 'Actions' },
    { id: 'call-samba', label: 'Call Samba', sublabel: '+31 6 87975656', icon: Phone, action: () => { window.open('tel:+31687975656'); setIsOpen(false); }, keywords: ['call', 'bel', 'phone', 'telefoon'], category: 'Actions' },
    { id: 'linkedin', label: 'LinkedIn', sublabel: 'linkedin.com/in/sambajarju', icon: ExternalLink, action: () => { window.open('https://www.linkedin.com/in/sambajarju/', '_blank'); setIsOpen(false); }, keywords: ['linkedin', 'social'], category: 'Actions' },
    { id: 'paywatch', label: 'PayWatch.app', sublabel: 'AI bill tracker project', icon: ExternalLink, action: () => { window.open('https://www.paywatch.app', '_blank'); setIsOpen(false); }, keywords: ['paywatch', 'app', 'project', 'ai'], category: 'Actions' },
    { id: 'cv', label: 'Download CV', sublabel: 'PDF resume', icon: FileText, action: () => { setIsOpen(false); }, keywords: ['cv', 'resume', 'download', 'pdf'], category: 'Actions' },
    { id: 'theme-light', label: 'Light mode', icon: Sun, action: () => { setTheme('light'); setIsOpen(false); }, keywords: ['light', 'licht', 'theme', 'mode'], category: 'Preferences' },
    { id: 'theme-dark', label: 'Dark mode', icon: Moon, action: () => { setTheme('dark'); setIsOpen(false); }, keywords: ['dark', 'donker', 'theme', 'mode'], category: 'Preferences' },
    { id: 'theme-system', label: 'System theme', icon: Monitor, action: () => { setTheme('system'); setIsOpen(false); }, keywords: ['system', 'systeem', 'auto', 'theme'], category: 'Preferences' },
    { id: 'language', label: locale === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands', icon: Languages, action: switchLocale, keywords: ['language', 'taal', 'english', 'nederlands', 'dutch', 'nl', 'en'], category: 'Preferences' },
  ], [locale, pathname, theme]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.sublabel?.toLowerCase().includes(q) ||
      item.keywords.some(k => k.includes(q))
    );
  }, [search, items]);

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filtered.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filtered]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setSearch('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Arrow key navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filtered[selectedIndex]?.action();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  return (
    <>
      {/* Trigger hint in header */}
      <button
        onClick={() => { setIsOpen(true); setSearch(''); }}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface/50 text-xs text-foreground-subtle hover:text-foreground hover:border-border-hover transition-all"
      >
        <Search className="w-3 h-3" />
        <span>Search...</span>
        <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background-alt border border-border text-[10px] font-mono">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed left-1/2 top-[20%] -translate-x-1/2 z-[101] w-[520px] max-w-[calc(100vw-32px)] rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-4 h-4 text-foreground-subtle flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground-subtle outline-none"
                />
                <kbd className="px-1.5 py-0.5 rounded bg-background-alt border border-border text-[10px] font-mono text-foreground-subtle">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[340px] overflow-y-auto p-2">
                {Object.entries(grouped).map(([category, categoryItems]) => (
                  <div key={category}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-subtle px-2 py-1.5 mt-1">
                      {category}
                    </p>
                    {categoryItems.map((item) => {
                      const globalIdx = filtered.indexOf(item);
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                            globalIdx === selectedIndex
                              ? 'bg-accent/10 text-foreground'
                              : 'text-foreground-muted hover:bg-surface-hover'
                          }`}
                        >
                          <Icon className={`w-4 h-4 flex-shrink-0 ${globalIdx === selectedIndex ? 'text-accent' : ''}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.label}</p>
                            {item.sublabel && <p className="text-[11px] text-foreground-subtle truncate">{item.sublabel}</p>}
                          </div>
                          {globalIdx === selectedIndex && <ArrowRight className="w-3 h-3 text-accent flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-foreground-subtle text-center py-6">No results found</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
