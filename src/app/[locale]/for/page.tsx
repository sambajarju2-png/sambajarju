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
}

// Full-screen loading overlay — shows while API fetches
function LoadingOverlay({ company }: { company: string }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'var(--hero-gradient)' }}
    >
      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="load-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#load-grid)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative z-10 text-center px-6"
      >
        {/* SJ avatar */}
        <motion.div
          className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white text-xl font-bold mx-auto mb-6 shadow-lg shadow-accent/30"
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          SJ
        </motion.div>

        <h1 className="text-2xl font-extrabold text-white mb-2">Samba Jarju</h1>
        <p className="text-white/50 text-sm mb-8">Email Marketeer & Marketing Automation</p>

        {/* Loading indicator */}
        <div className="flex items-center gap-3 justify-center">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-accent"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-teal"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          />
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-white"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </div>

        <p className="text-white/30 text-xs mt-4">
          Preparing experience for <span className="text-white/60 font-medium">{company}</span>
        </p>
      </motion.div>
    </motion.div>
  );
}

function PersonalizedContent() {
  const searchParams = useSearchParams();
  const company = searchParams.get('company');
  const locale = useLocale();
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(!!company);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(company || '');
  const [logoError, setLogoError] = useState(false);
  const [showLoader, setShowLoader] = useState(!!company);

  const fetchBrand = async (companyDomain: string, isInitial = false) => {
    setLoading(true);
    setError(null);
    setLogoError(false);
    if (!isInitial) setBrandData(null);
    if (isInitial) setShowLoader(true);

    try {
      const res = await fetch('/api/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: companyDomain }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setBrandData(data);
      window.history.replaceState({}, '', `/for?company=${data.domain}`);
    } catch {
      setError('Kon bedrijfsgegevens niet ophalen. Controleer het domein.');
    } finally {
      setLoading(false);
      // Small delay so loading screen exit animation plays smoothly
      setTimeout(() => setShowLoader(false), 200);
    }
  };

  useEffect(() => {
    if (company) fetchBrand(company, true);
  }, []);

  const quickExamples = ['nike.com', 'spotify.com', 'vandebron.nl', 'shell.com', 'klm.com', 'bol.com', 'adidas.com', 'ing.nl'];

  return (
    <>
      {/* Loading overlay — only on initial page load with ?company= */}
      <AnimatePresence>
        {showLoader && company && <LoadingOverlay company={company} />}
      </AnimatePresence>

      <div className="min-h-screen">
        {/* Branded hero banner */}
        <AnimatePresence mode="wait">
          {brandData && !loading ? (
            <motion.div
              key={brandData.domain}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${brandData.primaryColor} 0%, ${brandData.secondaryColor || brandData.primaryColor}dd 50%, ${brandData.primaryColor}ee 100%)` }}
            >
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

              <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-[120px] opacity-30" style={{ background: brandData.secondaryColor || 'white' }} />

              <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-16">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors mb-8">
                  <ArrowLeft className="w-4 h-4" /> sambajarju.nl
                </Link>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className="flex items-center gap-4 mb-6">
                  {brandData.logo && !logoError ? (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white flex items-center justify-center p-2 shadow-lg">
                      <img src={brandData.logo} alt={brandData.companyName} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" onError={() => setLogoError(true)} />
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

                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-4">
                  {brandData.tagline}
                </motion.h2>

                <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }} className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed mb-8">
                  {brandData.greeting}
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }} className="flex flex-col sm:flex-row gap-3">
                  <a href={`mailto:samba@sambajarju.nl?subject=Samenwerking ${brandData.companyName}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-sm font-semibold transition-all hover:shadow-lg w-full sm:w-auto" style={{ color: brandData.primaryColor }}>
                    <Mail className="w-4 h-4" /> Contact opnemen <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link href="/playground" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-all w-full sm:w-auto">
                    <Briefcase className="w-4 h-4" /> Bekijk mijn werk
                  </Link>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 pt-6 border-t border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><svg className="h-3.5" viewBox="36 56 120 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M132 136H36V120H132C134.25 120 136.125 119.25 137.625 117.75C139.208 116.167 140 114.25 140 112C140 109.75 139.208 107.875 137.625 106.375C136.125 104.792 134.25 104 132 104H100C93.3333 104 87.6667 101.667 83 97C78.3333 92.3333 76 86.6667 76 80C76 73.3333 78.3333 67.6667 83 63C87.6667 58.3333 93.3333 56 100 56H148V72H100C97.75 72 95.8333 72.7917 94.25 74.375C92.75 75.875 92 77.75 92 80C92 82.25 92.75 84.1667 94.25 85.75C95.8333 87.25 97.75 88 100 88H132C138.667 88 144.333 90.3333 149 95C153.667 99.6667 156 105.333 156 112C156 118.667 153.667 124.333 149 129C144.333 133.667 138.667 136 132 136Z" fill="white"/></svg></div>
                  <div>
                    <p className="text-white text-sm font-semibold">Samba Jarju</p>
                    <p className="text-white/50 text-xs">Email Marketeer & Marketing Automation Specialist</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : !loading ? (
            <div className="pt-20 sm:pt-24" style={{ background: 'var(--hero-gradient)' }}>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors mb-6">
                  <ArrowLeft className="w-4 h-4" /> sambajarju.nl
                </Link>
                <div className="flex items-center gap-2 text-sm font-semibold text-teal uppercase tracking-wider mb-2">
                  <Palette className="w-4 h-4" /> Personalisatie
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">Dynamic company branding</h1>
                <p className="text-white/60 mt-2 text-sm sm:text-base max-w-xl">Voer een bedrijfsdomein in en zie hoe de pagina zich aanpast aan hun huisstijl.</p>
              </div>
            </div>
          ) : null}
        </AnimatePresence>

        {/* Controls below banner */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="flex gap-2">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && inputValue.trim() && fetchBrand(inputValue.trim())} placeholder="nike.com, spotify.com, vandebron.nl..." className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle outline-none focus:border-accent transition-colors" />
            <button onClick={() => inputValue.trim() && fetchBrand(inputValue.trim())} disabled={loading} className="px-5 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-40 transition-colors flex-shrink-0">
              {loading && !showLoader ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickExamples.map(ex => (
              <button key={ex} onClick={() => { setInputValue(ex); fetchBrand(ex); }} className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-surface text-foreground-muted hover:text-foreground hover:border-border-hover transition-all">{ex}</button>
            ))}
          </div>

          {error && <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">{error}</div>}

          {brandData && !loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-3 rounded-lg bg-surface border border-border">
                <p className="text-xs text-foreground-subtle flex items-center gap-1.5 flex-wrap">
                  <ExternalLink className="w-3 h-3 flex-shrink-0" /> Deel deze link:
                  <code className="text-accent font-mono bg-background-alt px-1.5 py-0.5 rounded text-[11px] break-all">sambajarju.nl/{locale}/for?company={brandData.domain}</code>
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-bold text-foreground">Extracted brand data</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-foreground-subtle mb-1">Colors</p>
                    <div className="flex gap-1">
                      {(brandData.allColors.length > 0 ? brandData.allColors : [brandData.primaryColor]).slice(0, 5).map((c, i) => (
                        <div key={i} className="w-6 h-6 rounded-md border border-border" style={{ backgroundColor: c }} title={c} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground-subtle mb-1">Logo</p>
                    <span className="font-mono text-foreground-muted">Logo.dev</span>
                  </div>
                  <div>
                    <p className="text-foreground-subtle mb-1">Colors via</p>
                    <span className="font-mono text-foreground-muted">Color Thief</span>
                  </div>
                  <div>
                    <p className="text-foreground-subtle mb-1">Text</p>
                    <span className="font-mono text-foreground-muted">Claude Haiku</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-border bg-background-alt/50 p-5">
                <p className="text-sm font-bold text-foreground mb-2">Hoe werkt dit?</p>
                <div className="text-xs text-foreground-muted space-y-1.5">
                  <p>1. Logo.dev haalt het bedrijfslogo op (instant CDN)</p>
                  <p>2. Color Thief extracteert merkkleuren uit het logo (MMCQ quantization, geen API)</p>
                  <p>3. Claude Haiku genereert gepersonaliseerde tekst (laagste kosten)</p>
                  <p>4. De banner past zich volledig aan met de brand identity</p>
                </div>
                <p className="text-xs text-accent mt-3 font-medium">Dit is account-based marketing personalisatie in actie.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

export default function PersonalizedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>}>
      <PersonalizedContent />
    </Suspense>
  );
}
