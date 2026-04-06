'use client';

import { useTranslations } from 'next-intl';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Briefcase, Euro, Users, Sparkles, X } from 'lucide-react';
import { useRef, useEffect, useState, memo } from 'react';

/* ── Magnetic Filing ── */
const Filing = memo(function Filing({ mouseX, mouseY }: { mouseX: ReturnType<typeof useMotionValue<number>>; mouseY: ReturnType<typeof useMotionValue<number>> }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotate = useSpring(0, { damping: 20, stiffness: 150 });

  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = Math.atan2(mouseY.get() - cy, mouseX.get() - cx);
      rotate.set(angle * (180 / Math.PI));
    };
    const unX = mouseX.on('change', update);
    const unY = mouseY.on('change', update);
    return () => { unX(); unY(); };
  }, [mouseX, mouseY, rotate]);

  return (
    <motion.div
      ref={ref}
      style={{ rotate }}
      className="w-[2px] h-5 rounded-full bg-white/[0.15]"
    />
  );
});

const orbitTools = [
  { slug: 'react', color: '61DAFB', name: 'React', usage: 'UI library for all my web projects — PayWatch, this portfolio, Workwings.', arc: 1 as const, dur: 35, begin: '0s' },
  { slug: 'nextdotjs', color: 'ffffff', name: 'Next.js', usage: 'My go-to framework. App Router, server components, Turbopack.', arc: 1 as const, dur: 35, begin: '-7s' },
  { slug: 'hubspot', color: 'FF7A59', name: 'HubSpot', usage: 'CRM and marketing automation at Kes Visum.', arc: 2 as const, dur: 30, begin: '0s' },
  { slug: 'supabase', color: '3FCF8E', name: 'Supabase', usage: 'Backend for PayWatch — auth, Postgres, RLS, real-time.', arc: 1 as const, dur: 35, begin: '-14s' },
  { slug: 'figma', color: 'F24E1E', name: 'Figma', usage: 'UI design and prototyping before building.', arc: 2 as const, dur: 30, begin: '-8s' },
  { slug: 'zapier', color: 'FF4F00', name: 'Zapier', usage: 'Connecting tools and automating workflows.', arc: 1 as const, dur: 35, begin: '-21s' },
  { slug: 'tailwindcss', color: '06B6D4', name: 'Tailwind CSS', usage: 'Styling everything. This entire portfolio runs on it.', arc: 2 as const, dur: 30, begin: '-16s' },
  { slug: 'googleanalytics', color: 'E37400', name: 'Google Analytics', usage: 'GA4 setup and event tracking.', arc: 2 as const, dur: 30, begin: '-12s' },
  { slug: 'salesforce', color: '00A1E0', name: 'Salesforce', usage: 'Marketing Cloud at Vandebron — 500k+ emails/month.', arc: 1 as const, dur: 35, begin: '-28s' },
  { slug: 'resend', color: 'ffffff', name: 'Resend', usage: 'Transactional email for PayWatch.app.', arc: 2 as const, dur: 30, begin: '-4s' },
  { slug: 'semrush', color: 'FF642D', name: 'SEMRush', usage: 'SEO research and competitive analysis.', arc: 2 as const, dur: 30, begin: '-22s' },
  { slug: 'hotjar', color: 'FF3C00', name: 'Hotjar', usage: 'Heatmaps and session recordings for CRO.', arc: 1 as const, dur: 35, begin: '-32s' },
  { slug: 'anthropic', color: 'D97757', name: 'Claude AI', usage: 'AI assistant for coding, content, and automation.', arc: 2 as const, dur: 30, begin: '-26s' },
  { slug: 'postgresql', color: '4169E1', name: 'PostgreSQL', usage: 'Database for PayWatch via Supabase.', arc: 1 as const, dur: 35, begin: '-4s' },
];

const arcPaths = {
  1: 'M 900 -100 Q 1300 400 700 900',
  2: 'M 950 -50 Q 1350 450 750 950',
};

const allTools = [
  { slug: 'react', color: '61DAFB' },
  { slug: 'nextdotjs', color: 'ffffff' },
  { slug: 'hubspot', color: 'FF7A59' },
  { slug: 'supabase', color: '3FCF8E' },
  { slug: 'figma', color: 'F24E1E' },
  { slug: 'tailwindcss', color: '06B6D4' },
  { slug: 'zapier', color: 'FF4F00' },
  { slug: 'googleanalytics', color: 'E37400' },
  { slug: 'salesforce', color: '00A1E0' },
  { slug: 'resend', color: 'ffffff' },
  { slug: 'semrush', color: 'FF642D' },
  { slug: 'hotjar', color: 'FF3C00' },
  { slug: 'typescript', color: '3178C6' },
  { slug: 'postgresql', color: '4169E1' },
  { slug: 'sanity', color: 'F03E2F' },
  { slug: 'vercel', color: 'ffffff' },
  { slug: 'make', color: '6D00CC' },
  { slug: 'wordpress', color: '21759B' },
  { slug: 'anthropic', color: 'D97757' },
  { slug: 'googlegemini', color: '8E75B2' },
];

const FILING_COLS = 28;
const FILING_ROWS = 12;
const FILING_COUNT = FILING_COLS * FILING_ROWS;

export function Hero() {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLElement>(null);
  const [selectedTool, setSelectedTool] = useState<typeof orbitTools[0] | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [mouseX, mouseY]);

  const companies = ['ESET', 'Exact', 'NPO 3', 'Vandebron', 'Visma', 'Odido', 'Mollie'];

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }} />
        <div className="absolute w-72 h-72 rounded-full blur-[140px]" style={{ background: 'rgba(239,71,111,0.12)', left: '10%', top: '20%' }} />
        <div className="absolute w-56 h-56 rounded-full blur-[120px]" style={{ background: 'rgba(167,218,220,0.1)', right: '15%', bottom: '20%' }} />
        {/* Gradient fade — z-0 so it sits BEHIND the marquee text */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-0" />
      </div>

      {/* Magnetic Filings — full screen 1fr grid */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none overflow-hidden z-[1]">
        <div
          className="w-full h-full opacity-50"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${FILING_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${FILING_ROWS}, 1fr)`,
            justifyItems: 'center',
            alignItems: 'center',
          }}
        >
          {Array.from({ length: FILING_COUNT }).map((_, i) => (
            <Filing key={i} mouseX={mouseX} mouseY={mouseY} />
          ))}
        </div>
      </div>

      {/* Orbital SVG — z-[15] above content glass card */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none z-[15]">
        <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d={arcPaths[1]} fill="none" stroke="rgba(167,218,220,0.12)" strokeWidth="1" />
          <path d={arcPaths[2]} fill="none" stroke="rgba(167,218,220,0.06)" strokeWidth="0.5" />
          {orbitTools.map((tool) => (
            <g key={tool.slug} style={{ cursor: 'pointer', pointerEvents: 'auto' }} onClick={() => setSelectedTool(tool)}>
              <animateMotion dur={`${tool.dur}s`} repeatCount="indefinite" path={arcPaths[tool.arc]} begin={tool.begin} />
              <circle r="22" fill={`#${tool.color}`} opacity="0.08" />
              <circle r="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
              <image href={`https://cdn.simpleicons.org/${tool.slug}/${tool.color}`} x="-10" y="-10" width="20" height="20" opacity="0.7" />
            </g>
          ))}
          <circle r="2" fill="white" opacity="0.3"><animateMotion dur="18s" repeatCount="indefinite" path={arcPaths[1]} begin="-5s" /></circle>
          <circle r="1.5" fill="#EF476F" opacity="0.4"><animateMotion dur="22s" repeatCount="indefinite" path={arcPaths[2]} begin="-12s" /></circle>
        </svg>
      </div>

      {/* Tool popover */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTool(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="relative w-full max-w-[280px] rounded-2xl bg-surface border border-border shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedTool(null)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-background-alt text-foreground-subtle"><X className="w-4 h-4" /></button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-background-alt border border-border flex items-center justify-center p-2">
                <img src={`https://cdn.simpleicons.org/${selectedTool.slug}/${selectedTool.color}`} alt={selectedTool.name} width={24} height={24} />
              </div>
              <h3 className="font-bold text-foreground">{selectedTool.name}</h3>
            </div>
            <p className="text-sm text-foreground-muted leading-relaxed">{selectedTool.usage}</p>
            <a href="#tools" onClick={() => setSelectedTool(null)} className="inline-flex items-center gap-1 text-xs font-medium text-accent mt-3 hover:underline">See all tools <ArrowRight className="w-3 h-3" /></a>
          </motion.div>
        </div>
      )}

      {/* Content — mobile: auto height, desktop: full viewport */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center min-h-[auto] lg:min-h-[100svh] pt-28 pb-12 lg:pt-[80px] lg:pb-[32px]">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center w-full">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#A7DADC' }} />
              <span className="text-xs sm:text-sm font-medium" style={{ color: '#A7DADC' }}>{t('greeting')}</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight mb-4">
              {t('title').split(' ').map((word: string, i: number) => (
                <span key={i} style={{ color: i === 1 ? '#A7DADC' : '#ffffff' }}>{word}{' '}</span>
              ))}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }} className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6 max-w-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {t('subtitle')}
            </motion.p>

            {/* CTAs — brute-forced with Tailwind, no external CSS classes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8">
              <a href="#contact" className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#EF476F] hover:bg-[#d83c5f] transition-colors shadow-lg shadow-pink-500/25">
                <span className="text-white font-semibold shrink-0">{t('cta_primary')}</span>
                <ArrowRight className="text-white w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#projects" className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/30 hover:border-white hover:bg-white/10 transition-all">
                <span className="text-white font-semibold shrink-0">{t('cta_secondary')}</span>
              </a>
            </motion.div>

            {/* Badges */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }} className="flex gap-2 overflow-x-auto pb-1 lg:hidden mb-4">
              {[
                { icon: Briefcase, label: t('badge_role') },
                { icon: Euro, label: t('badge_salary') },
                { icon: Users, label: t('badge_team') },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/10 flex-shrink-0">
                  <Icon className="w-3 h-3 flex-shrink-0" style={{ color: '#A7DADC' }} />
                  <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{label}</span>
                </div>
              ))}
            </motion.div>

            {/* Mobile tool ticker */}
            <div className="lg:hidden mb-4 overflow-hidden">
              <div className="flex gap-3 animate-marquee" style={{ width: 'max-content' }}>
                {[...allTools, ...allTools].map((tool, i) => (
                  <a key={`${tool.slug}-${i}`} href="#tools" className="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                    <img src={`https://cdn.simpleicons.org/${tool.slug}/${tool.color}`} alt="" width={13} height={13} className="opacity-40" loading="lazy" />
                  </a>
                ))}
              </div>
            </div>

            {/* Company marquee — z-10 to stay above gradient */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="pt-4 border-t border-white/10 relative z-10">
              <p className="text-[10px] sm:text-xs mb-2 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('visited')}</p>
              <div className="overflow-hidden relative">
                <div className="flex animate-marquee whitespace-nowrap">
                  {[...companies, ...companies].map((name, i) => (
                    <span key={i} className="text-xs sm:text-sm font-semibold mx-4 sm:mx-6" style={{ color: 'rgba(255,255,255,0.25)' }}>{name}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — Photo + badges (desktop) */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.3 }} className="relative hidden lg:block">
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center"><Users className="w-8 h-8" style={{ color: 'rgba(255,255,255,0.3)' }} /></div>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>Photo placeholder</p>
                  </div>
                </div>
              </div>
              <motion.div className="absolute -bottom-3 -left-3 right-3 flex gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.6 }}>
                {[
                  { icon: Briefcase, label: t('badge_role') },
                  { icon: Euro, label: t('badge_salary') },
                  { icon: Users, label: t('badge_team') },
                ].map(({ icon: Icon, label }, i) => (
                  <motion.div key={i} className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg" animate={{ y: [0, -4, 0] }} transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}>
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#A7DADC' }} />
                    <span className="text-xs font-semibold truncate" style={{ color: '#ffffff' }}>{label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
