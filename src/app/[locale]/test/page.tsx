'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Zap, Clock, Palette, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface BrandResult {
  method: string;
  logo: string | null;
  colors: string[];
  companyName: string;
  timeMs: number;
  source: { logo: string; colors: string };
}

function TestContent() {
  const searchParams = useSearchParams();
  const company = searchParams.get('company');
  const locale = useLocale();
  const [inputValue, setInputValue] = useState(company || '');
  const [results, setResults] = useState<BrandResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [logoErrors, setLogoErrors] = useState<Set<number>>(new Set());

  const run = async (domain: string) => {
    setLoading(true);
    setResults(null);
    setLogoErrors(new Set());
    try {
      const res = await fetch(`/api/brand-test?domain=${encodeURIComponent(domain)}`);
      const data = await res.json();
      setResults(data.results || []);
      window.history.replaceState({}, '', `/test?company=${domain}`);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (company && !results && !loading) {
    run(company);
  }

  const fastest = results ? Math.min(...results.map(r => r.timeMs)) : 0;

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
          Brand API Comparison
        </h1>
        <p className="text-sm text-foreground-muted mb-6">
          Three methods to get company logos + brand colors. All run in parallel so you can compare speed, quality, and cost.
        </p>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && inputValue.trim() && run(inputValue.trim())}
            placeholder="nike.com, spotify.com..."
            className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle outline-none focus:border-accent transition-colors"
          />
          <button
            onClick={() => inputValue.trim() && run(inputValue.trim())}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-40 transition-colors flex-shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {['nike.com', 'spotify.com', 'vandebron.nl', 'shell.com', 'klm.com', 'ing.nl', 'adidas.com', 'bol.com'].map(ex => (
            <button key={ex} onClick={() => { setInputValue(ex); run(ex); }}
              className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-surface text-foreground-muted hover:text-foreground hover:border-border-hover transition-all">
              {ex}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-2" />
            <p className="text-sm text-foreground-subtle">Running all 3 methods in parallel...</p>
          </div>
        )}

        {/* Results grid */}
        {results && (
          <div className="grid sm:grid-cols-3 gap-4">
            {results.map((r, i) => (
              <motion.div
                key={r.method}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                className={`rounded-2xl border bg-surface overflow-hidden ${r.timeMs === fastest ? 'border-green-400 dark:border-green-600 ring-1 ring-green-400/20' : 'border-border'}`}
              >
                {/* Header with timing */}
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground text-sm">{r.method}</p>
                    <p className="text-[10px] text-foreground-subtle">Method {i + 1}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono">
                    <Clock className="w-3 h-3" />
                    <span className={r.timeMs === fastest ? 'text-green-500 font-bold' : 'text-foreground-subtle'}>
                      {r.timeMs}ms
                    </span>
                    {r.timeMs === fastest && <span className="text-[9px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full font-bold ml-1">FASTEST</span>}
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Logo */}
                  <div>
                    <p className="text-[10px] text-foreground-subtle uppercase tracking-wider mb-2 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Logo
                    </p>
                    <div className="w-16 h-16 rounded-xl bg-white border border-border flex items-center justify-center p-1 overflow-hidden">
                      {r.logo && !logoErrors.has(i) ? (
                        <img
                          src={r.logo}
                          alt={r.companyName}
                          className="w-14 h-14 object-contain"
                          onError={() => setLogoErrors(prev => new Set(prev).add(i))}
                        />
                      ) : (
                        <span className="text-xl font-bold text-gray-400">{r.companyName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-foreground-subtle mt-1">{r.source.logo}</p>
                  </div>

                  {/* Colors */}
                  <div>
                    <p className="text-[10px] text-foreground-subtle uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Palette className="w-3 h-3" /> Colors ({r.colors.length})
                    </p>
                    {r.colors.length > 0 ? (
                      <div className="space-y-1.5">
                        <div className="flex gap-1">
                          {r.colors.map((c, ci) => (
                            <div key={ci} className="w-8 h-8 rounded-lg border border-border" style={{ backgroundColor: c }} title={c} />
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {r.colors.map((c, ci) => (
                            <span key={ci} className="text-[9px] font-mono text-foreground-subtle">{c}</span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-foreground-subtle italic">No colors found</p>
                    )}
                    <p className="text-[10px] font-mono text-foreground-subtle mt-1">{r.source.colors}</p>
                  </div>

                  {/* Company name */}
                  <div>
                    <p className="text-[10px] text-foreground-subtle uppercase tracking-wider mb-1">Company</p>
                    <p className="text-sm font-semibold text-foreground">{r.companyName}</p>
                  </div>
                </div>

                {/* Preview banner */}
                {r.colors.length >= 2 && (
                  <div className="h-12 flex items-center px-4 gap-2"
                    style={{ background: `linear-gradient(135deg, ${r.colors[0]}, ${r.colors[1] || r.colors[0]})` }}>
                    <span className="text-white text-xs font-bold drop-shadow-sm">Banner preview</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Summary */}
        {results && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 rounded-xl border border-dashed border-border bg-background-alt/50 p-5"
          >
            <p className="text-sm font-bold text-foreground mb-3">Summary</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-foreground-subtle">
                    <th className="py-1 pr-4">Method</th>
                    <th className="py-1 pr-4">Speed</th>
                    <th className="py-1 pr-4">Colors</th>
                    <th className="py-1 pr-4">Cost</th>
                  </tr>
                </thead>
                <tbody className="text-foreground-muted">
                  <tr>
                    <td className="py-1 pr-4 font-medium">1. Logo.dev + Brandfetch</td>
                    <td className="py-1 pr-4 font-mono">{results[0]?.timeMs}ms</td>
                    <td className="py-1 pr-4">{results[0]?.colors.length} colors</td>
                    <td className="py-1 pr-4 text-green-600">Free</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4 font-medium">2. Logo.dev + Color Thief</td>
                    <td className="py-1 pr-4 font-mono">{results[1]?.timeMs}ms</td>
                    <td className="py-1 pr-4">{results[1]?.colors.length} colors</td>
                    <td className="py-1 pr-4 text-green-600">Free (no API)</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4 font-medium">3. Fully Brandfetch</td>
                    <td className="py-1 pr-4 font-mono">{results[2]?.timeMs}ms</td>
                    <td className="py-1 pr-4">{results[2]?.colors.length} colors</td>
                    <td className="py-1 pr-4 text-green-600">Free</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>}>
      <TestContent />
    </Suspense>
  );
}
