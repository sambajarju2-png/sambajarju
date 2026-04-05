'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, Sparkles, ExternalLink, ArrowLeft, Palette, Zap } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface BrandData {
  primaryColor: string;
  secondaryColor: string;
  companyName: string;
  greeting: string;
  tagline: string;
  logo: string;
  domain: string;
}

export default function PersonalizedPage() {
  const searchParams = useSearchParams();
  const company = searchParams.get('company');
  const locale = useLocale();
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(company || '');
  const [logoError, setLogoError] = useState(false);

  const fetchBrand = async (companyDomain: string) => {
    setLoading(true);
    setError(null);
    setLogoError(false);
    try {
      const res = await fetch('/api/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: companyDomain }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setBrandData(data);
    } catch {
      setError('Kon de bedrijfsgegevens niet ophalen. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) fetchBrand(company);
  }, [company]);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar portfolio
        </Link>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider mb-2">
            <Palette className="w-4 h-4" />
            Personalisatie demo
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Dynamic company branding
          </h1>
          <p className="text-foreground-muted mt-2 text-sm sm:text-base">
            Voer een bedrijfsnaam in en zie hoe de pagina zich aanpast met hun branding. Dit is hoe ik personalisatie inzet als marketeer.
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && inputValue.trim() && fetchBrand(inputValue.trim())}
              placeholder="nike.com, spotify.com, vandebron.nl..."
              className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle outline-none focus:border-accent transition-colors"
            />
            <button
              onClick={() => inputValue.trim() && fetchBrand(inputValue.trim())}
              disabled={loading || !inputValue.trim()}
              className="px-5 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-40 transition-colors flex items-center gap-2 flex-shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span className="hidden sm:inline">Generate</span>
            </button>
          </div>

          {/* Quick examples */}
          <div className="flex flex-wrap gap-2 mt-3">
            {['nike.com', 'spotify.com', 'vandebron.nl', 'shell.com', 'klm.com', 'bol.com'].map((ex) => (
              <button
                key={ex}
                onClick={() => { setInputValue(ex); fetchBrand(ex); }}
                className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-background-alt text-foreground-muted hover:text-foreground hover:border-border-hover transition-all"
              >
                {ex}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Shareable URL hint */}
        {brandData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-3 rounded-lg bg-background-alt border border-border"
          >
            <p className="text-xs text-foreground-subtle flex items-center gap-1.5 flex-wrap">
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
              Shareable link:
              <code className="text-accent font-mono bg-surface px-1.5 py-0.5 rounded text-[11px] break-all">
                sambajarju.nl/{locale}/for?company={brandData.domain}
              </code>
            </p>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
            <p className="text-sm text-foreground-subtle">AI analyseert het merk...</p>
          </motion.div>
        )}

        {/* Branded result */}
        <AnimatePresence>
          {brandData && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="space-y-6"
            >
              {/* Branded hero card */}
              <div
                className="rounded-2xl overflow-hidden border border-border relative"
                style={{ background: `linear-gradient(135deg, ${brandData.primaryColor}15, ${brandData.secondaryColor}10)` }}
              >
                {/* Color bar */}
                <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${brandData.primaryColor}, ${brandData.secondaryColor})` }} />

                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 sm:gap-6 mb-6">
                    {/* Company logo */}
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-border overflow-hidden bg-white"
                    >
                      {!logoError ? (
                        <img
                          src={brandData.logo}
                          alt={brandData.companyName}
                          className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                          onError={() => setLogoError(true)}
                        />
                      ) : (
                        <span className="text-xl font-bold" style={{ color: brandData.primaryColor }}>
                          {brandData.companyName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: brandData.primaryColor }}>
                        Speciaal voor {brandData.companyName}
                      </p>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">{brandData.tagline}</h2>
                    </div>
                  </div>

                  <p className="text-foreground-muted leading-relaxed text-sm sm:text-base">
                    {brandData.greeting}
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <a
                      href={`mailto:samba@sambajarju.nl?subject=Samenwerking ${brandData.companyName}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90"
                      style={{ backgroundColor: brandData.primaryColor }}
                    >
                      Contact opnemen
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <Link
                      href={`/${locale}/playground`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border font-medium text-sm transition-all"
                      style={{ borderColor: brandData.primaryColor, color: brandData.primaryColor }}
                    >
                      Bekijk mijn werk
                    </Link>
                  </div>
                </div>
              </div>

              {/* Brand colors extracted */}
              <div className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-bold text-foreground">Extracted brand data</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <p className="text-[10px] text-foreground-subtle mb-1">Primary</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md border border-border" style={{ backgroundColor: brandData.primaryColor }} />
                      <span className="text-xs font-mono text-foreground-muted">{brandData.primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-foreground-subtle mb-1">Secondary</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md border border-border" style={{ backgroundColor: brandData.secondaryColor }} />
                      <span className="text-xs font-mono text-foreground-muted">{brandData.secondaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-foreground-subtle mb-1">Logo</p>
                    <span className="text-xs font-mono text-foreground-muted">Clearbit API</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-foreground-subtle mb-1">Text</p>
                    <span className="text-xs font-mono text-foreground-muted">Claude AI</span>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="rounded-xl border border-dashed border-border bg-background-alt/50 p-5">
                <p className="text-sm font-bold text-foreground mb-2">Hoe werkt dit?</p>
                <ol className="text-xs text-foreground-muted space-y-1.5 list-decimal list-inside">
                  <li>Bedrijfsnaam/domein wordt doorgegeven via URL parameter</li>
                  <li>Clearbit API haalt het bedrijfslogo op</li>
                  <li>Claude AI detecteert de merkkleuren en genereert gepersonaliseerde tekst</li>
                  <li>De pagina past zich dynamisch aan met de brand identity</li>
                </ol>
                <p className="text-xs text-accent mt-3 font-medium">
                  Dit is precies het soort personalisatie dat ik inzet bij email marketing campagnes.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!brandData && !loading && !company && (
          <div className="text-center py-12 space-y-3">
            <Palette className="w-10 h-10 text-foreground-subtle mx-auto" />
            <p className="text-foreground-muted text-sm">Voer een bedrijfsnaam in om de personalisatie te zien</p>
          </div>
        )}
      </div>
    </div>
  );
}
