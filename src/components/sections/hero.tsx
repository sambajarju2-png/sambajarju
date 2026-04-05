'use client';

import { useTranslations } from 'next-intl';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Briefcase, Euro, Users, Sparkles, X } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

interface OrbitingTool {
  slug: string;
  color: string;
  name: string;
  usage: string;
  arc: 1 | 2;
  dur: number;
  begin: string;
}

const orbitingTools: OrbitingTool[] = [
  { slug: 'react', color: '61DAFB', name: 'React', usage: 'UI library for all my web projects — PayWatch, this portfolio, Workwings.', arc: 1, dur: 35, begin: '0s' },
  { slug: 'nextdotjs', color: 'ffffff', name: 'Next.js', usage: 'My go-to framework. App Router, server components, Turbopack.', arc: 1, dur: 35, begin: '-8s' },
  { slug: 'hubspot', color: 'FF7A59', name: 'HubSpot', usage: 'CRM and marketing automation at Kes Visum. Lead scoring and nurture flows.', arc: 2, dur: 30, begin: '0s' },
  { slug: 'supabase', color: '3FCF8E', name: 'Supabase', usage: 'Backend for PayWatch — auth, Postgres, row-level security, real-time.', arc: 1, dur: 35, begin: '-18s' },
  { slug: 'figma', color: 'F24E1E', name: 'Figma', usage: 'UI design and prototyping before building. Designed PayWatch mockups here.', arc: 2, dur: 30, begin: '-10s' },
  { slug: 'zapier', color: 'FF4F00', name: 'Zapier', usage: 'Connecting tools and automating workflows across all marketing roles.', arc: 1, dur: 35, begin: '-28s' },
  { slug: 'tailwindcss', color: '06B6D4', name: 'Tailwind CSS', usage: 'Styling everything. Fast, consistent, and this entire portfolio runs on it.', arc: 2, dur: 30, begin: '-20s' },
  { slug: 'mailchimp', color: 'FFE01B', name: 'Mailchimp', usage: 'Email campaigns for smaller clients during freelance work at Cordital.', arc: 2, dur: 30, begin: '-6s' },
  { slug: 'resend', color: 'ffffff', name: 'Resend', usage: 'Transactional email for PayWatch.app. Clean API, great DX.', arc: 1, dur: 35, begin: '-14s' },
  { slug: 'googleanalytics', color: 'E37400', name: 'Google Analytics', usage: 'Tracking and analyzing marketing performance. GA4 setup and event tracking.', arc: 2, dur: 30, begin: '-16s' },
];

const arcPaths = {
  1: 'M 900 -100 Q 1300 400 700 900',
  2: 'M 950 -50 Q 1350 450 750 950',
};

export function Hero() {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLElement>(null);
  const [selectedTool, setSelectedTool] = useState<OrbitingTool | null>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const gradientX = useTransform(springX, [0, 1], ['20%', '80%']);
  const gradientY = useTransform(springY, [0, 1], ['20%', '80%']);
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
    return () => el?.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const companies = ['ESET', 'Exact', 'NPO 3', 'Vandebron', 'Visma', 'Odido', 'Mollie'];

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }} />

      {/* Mouse-tracking spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform(
            [gradientX, gradientY],
            ([x, y]) => `radial-gradient(600px circle at ${x} ${y}, rgba(239,71,111,0.12), rgba(167,218,220,0.06) 40%, transparent 70%)`
          ),
        }}
      />

      {/* Parallax grid */}
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

      {/* Orbital arcs with tool icons as satellites */}
      <div className="absolute inset-0 overflow-hidden hidden lg:block">
        <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Arc lines */}
          <path d={arcPaths[1]} fill="none" stroke="rgba(167,218,220,0.12)" strokeWidth="1" />
          <path d={arcPaths[2]} fill="none" stroke="rgba(167,218,220,0.06)" strokeWidth="0.5" />

          {/* Orbiting tool icons */}
          {orbitingTools.map((tool) => (
            <g key={tool.slug} style={{ cursor: 'pointer' }} onClick={() => setSelectedTool(tool)}>
              <animateMotion
                dur={`${tool.dur}s`}
                repeatCount="indefinite"
                path={arcPaths[tool.arc]}
                begin={tool.begin}
              />
              {/* Glow behind icon */}
              <circle r="22" fill={`#${tool.color}`} opacity="0.08" />
              {/* Background circle */}
              <circle r="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
              {/* Tool logo */}
              <image
                href={`https://cdn.simpleicons.org/${tool.slug}/${tool.color}`}
                x="-10" y="-10" width="20" height="20"
                opacity="0.7"
              />
            </g>
          ))}

          {/* Extra orbiting dots for atmosphere */}
          <circle r="2" fill="white" opacity="0.3">
            <animateMotion dur="18s" repeatCount="indefinite" path={arcPaths[1]} begin="-5s" />
          </circle>
          <circle r="1.5" fill="#EF476F" opacity="0.4">
            <animateMotion dur="22s" repeatCount="indefinite" path={arcPaths[2]} begin="-12s" />
          </circle>
        </svg>
      </div>

      {/* Tool popover */}
      {selectedTool && (
        <div className="fixed inset-0 z-50" onClick={() => setSelectedTool(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 rounded-2xl bg-surface border border-border shadow-2xl p-5 z-50"
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

      {/* Floating orbs with cursor influence */}
      <motion.div
        className="absolute w-72 h-72 rounded-full blur-[140px] pointer-events-none"
        style={{
          background: 'rgba(239,71,111,0.15)',
          left: useTransform(springX, [0, 1], ['15%', '35%']),
          top: useTransform(springY, [0, 1], ['15%', '35%']),
        }}
      />
      <motion.div
        className="absolute w-56 h-56 rounded-full blur-[120px] pointer-events-none"
        style={{
          background: 'rgba(167,218,220,0.12)',
          right: useTransform(springX, [0, 1], ['25%', '15%']),
          bottom: useTransform(springY, [0, 1], ['25%', '15%']),
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-teal" />
              <span className="text-sm text-teal font-medium">{t('greeting')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight"
            >
              {t('title').split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.15 + i * 0.08 }}
                  className={`inline-block mr-[0.3em] ${i === 1 ? 'text-teal' : ''}`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
              className="text-lg text-white/60 max-w-lg leading-relaxed"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-accent/25"
              >
                {t('cta_primary')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 font-medium transition-all duration-200"
              >
                {t('cta_secondary')}
              </a>
            </motion.div>

            {/* Mobile badges - visible below lg */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
              className="flex flex-wrap gap-2 lg:hidden"
            >
              {[
                { icon: Briefcase, label: t('badge_role') },
                { icon: Euro, label: t('badge_salary') },
                { icon: Users, label: t('badge_team') },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <Icon className="w-3.5 h-3.5 text-teal flex-shrink-0" />
                  <span className="text-xs font-semibold text-white">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* Company marquee */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-6 border-t border-white/10"
            >
              <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">{t('visited')}</p>
              <div className="overflow-hidden relative">
                <div className="flex animate-marquee whitespace-nowrap">
                  {[...companies, ...companies].map((name, i) => (
                    <span key={i} className="text-sm font-semibold text-white/25 mx-6">{name}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — Photo placeholder + badges */}
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
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_ease_infinite]" />
              </div>

              <motion.div
                className="absolute -bottom-3 -left-3 right-3 flex gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.6 }}
              >
                {[
                  { icon: Briefcase, label: t('badge_role') },
                  { icon: Euro, label: t('badge_salary') },
                  { icon: Users, label: t('badge_team') },
                ].map(({ icon: Icon, label }, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                  >
                    <Icon className="w-3.5 h-3.5 text-teal flex-shrink-0" />
                    <span className="text-xs font-semibold text-white truncate">{label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
