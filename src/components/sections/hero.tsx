'use client';

import { useTranslations } from 'next-intl';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Briefcase, Euro, Users, Sparkles, X } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const orbitTools = [
  { slug: 'react', color: '61DAFB', name: 'React', usage: 'UI library for all my web projects — PayWatch, this portfolio, Workwings.', arc: 1 as const, dur: 35, begin: '0s' },
  { slug: 'nextdotjs', color: 'ffffff', name: 'Next.js', usage: 'My go-to framework. App Router, server components, Turbopack.', arc: 1 as const, dur: 35, begin: '-8s' },
  { slug: 'hubspot', color: 'FF7A59', name: 'HubSpot', usage: 'CRM and marketing automation at Kes Visum.', arc: 2 as const, dur: 30, begin: '0s' },
  { slug: 'supabase', color: '3FCF8E', name: 'Supabase', usage: 'Backend for PayWatch — auth, Postgres, RLS, real-time.', arc: 1 as const, dur: 35, begin: '-18s' },
  { slug: 'figma', color: 'F24E1E', name: 'Figma', usage: 'UI design and prototyping before building.', arc: 2 as const, dur: 30, begin: '-10s' },
  { slug: 'zapier', color: 'FF4F00', name: 'Zapier', usage: 'Connecting tools and automating workflows.', arc: 1 as const, dur: 35, begin: '-28s' },
  { slug: 'tailwindcss', color: '06B6D4', name: 'Tailwind CSS', usage: 'Styling everything. This entire portfolio runs on it.', arc: 2 as const, dur: 30, begin: '-20s' },
  { slug: 'googleanalytics', color: 'E37400', name: 'Google Analytics', usage: 'GA4 setup and event tracking.', arc: 2 as const, dur: 30, begin: '-16s' },
  { slug: 'mailchimp', color: 'FFE01B', name: 'Mailchimp', usage: 'Email campaigns for freelance clients.', arc: 1 as const, dur: 35, begin: '-14s' },
  { slug: 'resend', color: 'ffffff', name: 'Resend', usage: 'Transactional email for PayWatch.app.', arc: 2 as const, dur: 30, begin: '-6s' },
];

const arcPaths = {
  1: 'M 900 -100 Q 1300 400 700 900',
  2: 'M 950 -50 Q 1350 450 750 950',
};

// All tools for mobile ticker — includes Salesforce, Deployteq, etc.
const allTools = [
  { slug: 'react', color: '61DAFB' },
  { slug: 'nextdotjs', color: 'ffffff' },
  { slug: 'hubspot', color: 'FF7A59' },
  { slug: 'supabase', color: '3FCF8E' },
  { slug: 'figma', color: 'F24E1E' },
  { slug: 'tailwindcss', color: '06B6D4' },
  { slug: 'zapier', color: 'FF4F00' },
  { slug: 'googleanalytics', color: 'E37400' },
  { slug: 'mailchimp', color: 'FFE01B' },
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

export function Hero() {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLElement>(null);
  const [selectedTool, setSelectedTool] = useState<typeof orbitTools[0] | null>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const gridX = useTransform(springX, [0, 1], ['-5px', '5px']);
  const gridY = useTransform(springY, [0, 1], ['-5px', '5px']);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  const companies = ['ESET', 'Exact', 'NPO 3', 'Vandebron', 'Visma', 'Odido', 'Mollie'];

  return (
    <section ref={containerRef} className="relative min-h-[100svh] flex items-end sm:items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }} />
        <motion.div className="absolute inset-0 opacity-[0.06]" style={{ x: gridX, y: gridY }}>
          <svg width="100%" height="100%">
            <defs><pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </motion.div>
        <div className="absolute w-72 h-72 rounded-full blur-[140px] pointer-events-none" style={{ background: 'rgba(239,71,111,0.12)', left: '10%', top: '20%' }} />
        <div className="absolute w-56 h-56 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(167,218,220,0.1)', right: '15%', bottom: '20%' }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </div>

      {/* DESKTOP: Orbital SVG (lg+) */}
      <div className="absolute inset-0 hidden lg:block">
        <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d={arcPaths[1]} fill="none" stroke="rgba(167,218,220,0.12)" strokeWidth="1" />
          <path d={arcPaths[2]} fill="none" stroke="rgba(167,218,220,0.06)" strokeWidth="0.5" />
          {orbitTools.map((tool) => (
            <g key={tool.slug} style={{ cursor: 'pointer' }} onClick={() => setSelectedTool(tool)}>
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

      {/* Desktop tool popover */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTool(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="w-full max-w-[280px] rounded-2xl bg-surface border border-border shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedTool(null)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-background-alt text-foreground-subtle"><X className="w-4 h-4" /></button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-background-alt border border-border flex items-center justify-center p-2">
                <img src={`https://cdn.simpleicons.org/${selectedTool.slug}/${selectedTool.color}`} alt={selectedTool.name} width={24} height={24} className="dark:brightness-0 dark:invert dark:opacity-80" />
              </div>
              <h3 className="font-bold text-foreground">{selectedTool.name}</h3>
            </div>
            <p className="text-sm text-foreground-muted leading-relaxed">{selectedTool.usage}</p>
            <a href="#tools" onClick={() => setSelectedTool(null)} className="inline-flex items-center gap-1 text-xs font-medium text-accent mt-3 hover:underline">See all tools <ArrowRight className="w-3 h-3" /></a>
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-8 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Left column */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
              <Sparkles className="w-3.5 h-3.5 text-teal" />
              <span className="text-xs sm:text-sm text-teal font-medium">{t('greeting')}</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }} className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight mb-4">
              {t('title').split(' ').map((word: string, i: number) => (
                <span key={i} className={i === 1 ? 'text-teal' : 'text-white'}>{word}{' '}</span>
              ))}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }} className="text-sm sm:text-base lg:text-lg text-white/60 leading-relaxed mb-6 max-w-lg">
              {t('subtitle')}
            </motion.p>

            {/* CTAs — explicit white color on every text element */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }} className="flex flex-col sm:flex-row gap-3 mb-6">
              <a href="#contact" style={{ backgroundColor: '#EF476F', color: '#ffffff' }} className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90">
                {t('cta_primary')}
                <ArrowRight className="w-4 h-4" style={{ color: '#ffffff' }} />
              </a>
              <a href="#projects" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }} className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border text-sm font-medium transition-all hover:bg-white/10">
                {t('cta_secondary')}
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
                  <Icon className="w-3 h-3 text-teal flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-white whitespace-nowrap">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* MOBILE: Floating tool ticker — 20 tools, smooth scroll, above marquee */}
            <div className="lg:hidden mb-4 overflow-hidden">
              <div className="flex gap-3 animate-marquee" style={{ width: 'max-content' }}>
                {[...allTools, ...allTools].map((tool, i) => (
                  <div key={`${tool.slug}-${i}`} className="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                    <img src={`https://cdn.simpleicons.org/${tool.slug}/${tool.color}`} alt="" width={13} height={13} className="opacity-40" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            {/* Company marquee */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="pt-4 border-t border-white/10">
              <p className="text-[10px] sm:text-xs text-white/40 mb-2 uppercase tracking-wider">{t('visited')}</p>
              <div className="overflow-hidden relative">
                <div className="flex animate-marquee whitespace-nowrap">
                  {[...companies, ...companies].map((name, i) => (
                    <span key={i} className="text-xs sm:text-sm font-semibold text-white/25 mx-4 sm:mx-6">{name}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — Photo + badges (desktop only) */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.3 }} className="relative hidden lg:block">
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center"><Users className="w-8 h-8 text-white/30" /></div>
                    <p className="text-white/25 text-sm">Photo placeholder</p>
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
                    <Icon className="w-3.5 h-3.5 text-teal flex-shrink-0" />
                    <span className="text-xs font-semibold text-white truncate">{label}</span>
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
