'use client';

import { useTranslations } from 'next-intl';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Briefcase, Euro, Users, Sparkles, X } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

// Desktop orbital tools
const orbitTools = [
  { slug: 'react', color: '61DAFB', name: 'React', usage: 'UI library for all my web projects — PayWatch, this portfolio, Workwings.', arc: 1 as const, dur: 35, begin: '0s' },
  { slug: 'nextdotjs', color: 'ffffff', name: 'Next.js', usage: 'My go-to framework. App Router, server components, Turbopack.', arc: 1 as const, dur: 35, begin: '-8s' },
  { slug: 'hubspot', color: 'FF7A59', name: 'HubSpot', usage: 'CRM and marketing automation at Kes Visum. Lead scoring and nurture flows.', arc: 2 as const, dur: 30, begin: '0s' },
  { slug: 'supabase', color: '3FCF8E', name: 'Supabase', usage: 'Backend for PayWatch — auth, Postgres, row-level security, real-time.', arc: 1 as const, dur: 35, begin: '-18s' },
  { slug: 'figma', color: 'F24E1E', name: 'Figma', usage: 'UI design and prototyping. Designed PayWatch mockups here.', arc: 2 as const, dur: 30, begin: '-10s' },
  { slug: 'zapier', color: 'FF4F00', name: 'Zapier', usage: 'Connecting tools and automating workflows across all marketing roles.', arc: 1 as const, dur: 35, begin: '-28s' },
  { slug: 'tailwindcss', color: '06B6D4', name: 'Tailwind CSS', usage: 'Styling everything. This entire portfolio runs on it.', arc: 2 as const, dur: 30, begin: '-20s' },
  { slug: 'googleanalytics', color: 'E37400', name: 'Google Analytics', usage: 'GA4 setup and event tracking across all projects.', arc: 2 as const, dur: 30, begin: '-16s' },
];

const arcPaths = {
  1: 'M 900 -100 Q 1300 400 700 900',
  2: 'M 950 -50 Q 1350 450 750 950',
};

// Mobile horizontal strip tools (subset, simpler)
const mobileTools = [
  { slug: 'react', color: '61DAFB', name: 'React' },
  { slug: 'nextdotjs', color: 'ffffff', name: 'Next.js' },
  { slug: 'hubspot', color: 'FF7A59', name: 'HubSpot' },
  { slug: 'supabase', color: '3FCF8E', name: 'Supabase' },
  { slug: 'figma', color: 'F24E1E', name: 'Figma' },
  { slug: 'tailwindcss', color: '06B6D4', name: 'Tailwind' },
  { slug: 'zapier', color: 'FF4F00', name: 'Zapier' },
  { slug: 'googleanalytics', color: 'E37400', name: 'Analytics' },
  { slug: 'mailchimp', color: 'FFE01B', name: 'Mailchimp' },
  { slug: 'resend', color: 'ffffff', name: 'Resend' },
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
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };
    const el = containerRef.current;
    el?.addEventListener('mousemove', handleMouseMove);
    return () => { el?.removeEventListener('mousemove', handleMouseMove); };
  }, [mouseX, mouseY]);

  const companies = ['ESET', 'Exact', 'NPO 3', 'Vandebron', 'Visma', 'Odido', 'Mollie'];

  return (
    <section ref={containerRef} className="relative min-h-[100svh] flex items-center overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }} />
        <motion.div className="absolute inset-0 opacity-[0.06]" style={{ x: gridX, y: gridY }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </motion.div>
        <div className="absolute w-72 h-72 rounded-full blur-[140px] pointer-events-none" style={{ background: 'rgba(239,71,111,0.12)', left: '10%', top: '20%' }} />
        <div className="absolute w-56 h-56 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(167,218,220,0.1)', right: '15%', bottom: '20%' }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </div>

      {/* ═══ DESKTOP: Orbital SVG satellites (lg+) ═══ */}
      <div className="absolute inset-0 overflow-hidden hidden lg:block">
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
          <circle r="2" fill="white" opacity="0.3">
            <animateMotion dur="18s" repeatCount="indefinite" path={arcPaths[1]} begin="-5s" />
          </circle>
          <circle r="1.5" fill="#EF476F" opacity="0.4">
            <animateMotion dur="22s" repeatCount="indefinite" path={arcPaths[2]} begin="-12s" />
          </circle>
        </svg>
      </div>

      {/* ═══ MOBILE: Horizontal floating icon strip (below lg) ═══ */}
      <div className="absolute top-16 left-0 right-0 overflow-hidden lg:hidden z-[5]">
        <motion.div
          className="flex gap-4 px-4 whitespace-nowrap"
          animate={{ x: [0, -400, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...mobileTools, ...mobileTools].map((tool, i) => (
            <motion.div
              key={`${tool.slug}-${i}`}
              className="w-9 h-9 rounded-xl bg-white/[0.07] border border-white/[0.1] flex items-center justify-center flex-shrink-0"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
            >
              <img
                src={`https://cdn.simpleicons.org/${tool.slug}/${tool.color}`}
                alt={tool.name}
                width={14}
                height={14}
                className="opacity-50"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Tool popover (desktop orbital click) */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTool(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="w-full max-w-[280px] rounded-2xl bg-surface border border-border shadow-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedTool(null)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-background-alt text-foreground-subtle">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-background-alt border border-border flex items-center justify-center p-2">
                <img src={`https://cdn.simpleicons.org/${selectedTool.slug}/${selectedTool.color}`} alt={selectedTool.name} width={24} height={24} className="dark:brightness-0 dark:invert dark:opacity-80" />
              </div>
              <h3 className="font-bold text-foreground">{selectedTool.name}</h3>
            </div>
            <p className="text-sm text-foreground-muted leading-relaxed">{selectedTool.usage}</p>
            <a href="#tools" onClick={() => setSelectedTool(null)} className="inline-flex items-center gap-1 text-xs font-medium text-accent mt-3 hover:underline">
              See all tools <ArrowRight className="w-3 h-3" />
            </a>
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-24 pb-10 sm:pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal" />
              <span className="text-xs sm:text-sm text-teal font-medium">{t('greeting')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight tracking-tight"
            >
              {t('title').split(' ').map((word: string, i: number) => (
                <span key={i} className={i === 1 ? 'text-teal' : ''}>
                  {word}{' '}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
              className="text-sm sm:text-base lg:text-lg text-white/60 leading-relaxed max-w-lg"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <a href="#contact" className="group flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-accent/25">
                <span>{t('cta_primary')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="#projects" className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-all">
                <span>{t('cta_secondary')}</span>
              </a>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
              className="flex gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap lg:hidden pb-1"
            >
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

            {/* Marquee */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-4 sm:pt-6 border-t border-white/10"
            >
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

          {/* Desktop right column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center">
                      <Users className="w-8 h-8 text-white/30" />
                    </div>
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
