'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, Sparkles, ExternalLink, ArrowLeft, Palette, Zap, Mail, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface BrandData {
  companyName: string;
  domain: string;
  primaryColor: string;
  secondaryColor: string;
  allColors: string[];
  greeting: string;
  tagline: string;
  logo: string | null;
  description: string;
}

function PersonalizedContent() {
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
    setBrandData(null);
    try {
      const res = await fetch('/api/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: companyDomain }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setBrandData(data);
      // Update URL without reload
      window.history.replaceState({}, '', `/${locale}/for?company=${data.domain}`);
    } catch {
      setError('Kon de bedrijfsgegevens niet ophalen. Controleer het domein en probeer opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) fetchBrand(company);
  }, [company]);

  const quickExamples = ['nike.com', 'spotify.com', 'vandebron.nl', 'shell.com', 'klm.com', 'bol.com', 'adidas.com', 'ing.nl'];

  return (
    <div className="min-h-screen">
      {/* Branded hero banner — takes full width */}
      <AnimatePresence mode="wait">
        {brandData && !loading ? (
          <motion.div
            key={brandData.domain}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${brandData.primaryColor} 0%, ${brandData.secondaryColor || brandData.primaryColor}dd 50%, ${brandData.primaryColor}ee 100%)` }}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.06]">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="brand-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#brand-grid)" />
              </svg>
            </div>

            {/* Glow */}
            <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-[120px] opacity-30" style={{ background: brandData.secondaryColor || 'white' }} />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-16">
              {/* Back link */}
              <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                sambajarju.nl
              </Link>

              {/* Company badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="flex items-center gap-4 mb-6"
              >
                {brandData.logo && !logoError ? (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white flex items-center justify-center p-2 shadow-lg">
                    <img
                      src={brandData.logo}
                      alt={brandData.companyName}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                      onError={() => setLogoError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-xl font-bold text-white">
                    {brandData.companyName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider font-medium">Speciaal voor</p>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{brandData.companyName}</h1>
                </div>
              </motion.div>

              {/* Tagline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-4"
              >
                {brandData.tagline}
              </motion.h2>

              {/* Greeting */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
                className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed mb-8"
              >
                {brandData.greeting}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <a
                  href={`mailto:samba@sambajarju.nl?subject=Samenwerking ${brandData.companyName}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-sm font-semibold transition-all hover:shadow-lg w-full sm:w-auto"
                  style={{ color: brandData.primaryColor }}
                >
                  <Mail className="w-4 h-4" />
                  Contact opnemen
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href={`/${locale}/playground`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-all w-full sm:w-auto"
                >
                  <Briefcase className="w-4 h-4" />
                  Bekijk mijn werk
                </Link>
              </motion.div>

              {/* Who is Samba mini */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 pt-6 border-t border-white/10 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">SJ</div>
                <div>
                  <p className="text-white text-sm font-semibold">Samba Jarju</p>
                  <p className="text-white/50 text-xs">Email Marketeer & Marketing Automation Specialist</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-20 sm:pt-24"
            style={{ background: 'var(--hero-gradient)' }}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
              <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" />
                sambajarju.nl
              </Link>

              <div className="flex items-center gap-2 text-sm font-semibold text-teal uppercase tracking-wider mb-2">
                <Palette className="w-4 h-4" />
                Personalisatie demo
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Dynamic company branding
              </h1>
              <p className="text-white/60 mt-2 text-sm sm:text-base max-w-xl">
                Voer een bedrijfsdomein in en zie hoe de hele pagina zich aanpast aan hun huisstijl. Logo, kleuren, en gepersonaliseerde tekst — allemaal automatisch.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input + results below banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Input */}
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
        <div className="flex flex-wrap gap-2">
          {quickExamples.map((ex) => (
            <button
              key={ex}
              onClick={() => { setInputValue(ex); fetchBrand(ex); }}
              className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-surface text-foreground-muted hover:text-foreground hover:border-border-hover transition-all"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
            <p className="text-sm text-foreground-subtle">Logo en kleuren ophalen via Logo.dev + AI tekst genereren...</p>
          </motion.div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">{error}</div>
        )}

        {/* Brand data panel */}
        {brandData && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Shareable URL */}
            <div className="p-3 rounded-lg bg-surface border border-border">
              <p className="text-xs text-foreground-subtle flex items-center gap-1.5 flex-wrap">
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                Deel deze link:
                <code className="text-accent font-mono bg-background-alt px-1.5 py-0.5 rounded text-[11px] break-all">
                  sambajarju.nl/{locale}/for?company={brandData.domain}
                </code>
              </p>
            </div>

            {/* Extracted data */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm font-bold text-foreground">Extracted brand data</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-foreground-subtle mb-1">Colors</p>
                  <div className="flex gap-1">
                    {(brandData.allColors.length > 0 ? brandData.allColors : [brandData.primaryColor]).slice(0, 4).map((c, i) => (
                      <div key={i} className="w-6 h-6 rounded-md border border-border" style={{ backgroundColor: c }} title={c} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-foreground-subtle mb-1">Logo</p>
                  <span className="font-mono text-foreground-muted">Logo.dev API</span>
                </div>
                <div>
                  <p className="text-foreground-subtle mb-1">Greeting</p>
                  <span className="font-mono text-foreground-muted">Claude Haiku</span>
                </div>
                <div>
                  <p className="text-foreground-subtle mb-1">Domain</p>
                  <span className="font-mono text-foreground-muted">{brandData.domain}</span>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-xl border border-dashed border-border bg-background-alt/50 p-5">
              <p className="text-sm font-bold text-foreground mb-2">Hoe werkt dit?</p>
              <div className="text-xs text-foreground-muted space-y-1.5">
                <p>1. Logo.dev Describe API haalt logo + merkkleuren op (instant)</p>
                <p>2. Claude Haiku genereert gepersonaliseerde tekst (laagste kosten)</p>
                <p>3. De banner past zich volledig aan met de brand identity</p>
                <p>4. Stuur de link naar een prospect voor gepersonaliseerde outreach</p>
              </div>
              <p className="text-xs text-accent mt-3 font-medium">
                Dit is hoe ik account-based marketing personalisatie inzet.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function PersonalizedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>}>
      <PersonalizedContent />
    </Suspense>
  );
}
