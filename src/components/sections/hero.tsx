'use client';

import { useTranslations } from 'next-intl';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Briefcase, Euro, Users, Sparkles, X } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

interface FloatingTool {
  slug: string;
  color: string;
  name: string;
  usage: string;
  // Position as percentage — works on any screen size
  x: string;
  y: string;
  // Mobile-specific position (smaller screens need different layout)
  mobileX?: string;
  mobileY?: string;
  dur: number;
  delay: number;
  size: number; // icon container size in px
}

const floatingTools: FloatingTool[] = [
  { slug: 'react', color: '61DAFB', name: 'React', usage: 'UI library for all my web projects — PayWatch, this portfolio, Workwings.', x: '85%', y: '12%', mobileX: '78%', mobileY: '6%', dur: 5, delay: 0, size: 40 },
  { slug: 'nextdotjs', color: 'ffffff', name: 'Next.js', usage: 'My go-to framework. App Router, server components, Turbopack.', x: '75%', y: '80%', mobileX: '8%', mobileY: '4%', dur: 6, delay: 0.5, size: 36 },
  { slug: 'hubspot', color: 'FF7A59', name: 'HubSpot', usage: 'CRM and marketing automation at Kes Visum. Lead scoring and nurture flows.', x: '90%', y: '45%', mobileX: '88%', mobileY: '42%', dur: 4.5, delay: 1, size: 34 },
  { slug: 'supabase', color: '3FCF8E', name: 'Supabase', usage: 'Backend for PayWatch — auth, Postgres, row-level security, real-time.', x: '70%', y: '60%', mobileX: '5%', mobileY: '38%', dur: 5.5, delay: 1.5, size: 36 },
  { slug: 'figma', color: 'F24E1E', name: 'Figma', usage: 'UI design and prototyping. Designed PayWatch mockups here.', x: '5%', y: '20%', mobileX: '45%', mobileY: '3%', dur: 6.5, delay: 2, size: 32 },
  { slug: 'tailwindcss', color: '06B6D4', name: 'Tailwind CSS', usage: 'Styling everything. This entire portfolio runs on it.', x: '8%', y: '65%', mobileX: '75%', mobileY: '88%', dur: 4, delay: 2.5, size: 34 },
  { slug: 'zapier', color: 'FF4F00', name: 'Zapier', usage: 'Connecting tools and automating workflows across all marketing roles.', x: '92%', y: '70%', mobileX: '10%', mobileY: '85%', dur: 5, delay: 3, size: 32 },
  { slug: 'googleanalytics', color: 'E37400', name: 'Google Analytics', usage: 'GA4 setup and event tracking across all projects.', x: '3%', y: '45%', mobileX: '60%', mobileY: '90%', dur: 5.5, delay: 0.8, size: 30 },
];

export function Hero() {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLElement>(null);
  const [selectedTool, setSelectedTool] = useState<FloatingTool | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const gridX = useTransform(springX, [0, 1], ['-5px', '5px']);
  const gridY = useTransform(springY, [0, 1], ['-5px', '5px']);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };
    const el = containerRef.current;
    el?.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', checkMobile);
      el?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const companies = ['ESET', 'Exact', 'NPO 3', 'Vandebron', 'Visma', 'Odido', 'Mollie'];

  return (
    <section ref={containerRef} className="relative min-h-[100svh] flex items-center">
      {/* Background — this layer has overflow hidden for decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }} />

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

        {/* Floating orbs */}
        <div className="absolute w-72 h-72 rounded-full blur-[140px] pointer-events-none" style={{ background: 'rgba(239,71,111,0.12)', left: '10%', top: '20%' }} />
        <div className="absolute w-56 h-56 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(167,218,220,0.1)', right: '15%', bottom: '20%' }} />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </div>

      {/* Floating tool icons — visible on ALL screens */}
      <div className="absolute inset-0 pointer-events-none z-[5]">
        {floatingTools.map((tool) => (
          <motion.button
            key={tool.slug}
            onClick={() => setSelectedTool(tool)}
            className="absolute pointer-events-auto rounded-xl bg-white/[0.07] backdrop-blur-[2px] border border-white/[0.1] flex items-center justify-center hover:bg-white/[0.12] hover:border-white/[0.2] transition-colors"
            style={{
              left: isMobile ? (tool.mobileX || tool.x) : tool.x,
              top: isMobile ? (tool.mobileY || tool.y) : tool.y,
              width: isMobile ? tool.size * 0.85 : tool.size,
              height: isMobile ? tool.size * 0.85 : tool.size,
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: tool.dur, repeat: Infinity, ease: 'easeInOut', delay: tool.delay }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={`https://cdn.simpleicons.org/${tool.slug}/${tool.color}`}
              alt={tool.name}
              width={isMobile ? 14 : 18}
              height={isMobile ? 14 : 18}
              className="opacity-60"
              loading="lazy"
            />
          </motion.button>
        ))}
      </div>

      {/* Tool popover */}
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

      {/* Content — NO overflow hidden here, so text never clips */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left column */}
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

            {/* Title — sized to fit mobile without overflow */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }}
              className="text-[1.75rem] leading-[1.15] sm:text-[2.8rem] md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight"
            >
              {t('title').split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? 'text-teal' : ''}>
                  {word}{' '}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
              className="text-sm sm:text-base lg:text-lg text-white/60 max-w-lg leading-relaxed"
            >
              {t('subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <a href="#contact" className="group flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-accent/25">
                {t('cta_primary')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="#projects" className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-all">
                {t('cta_secondary')}
              </a>
            </motion.div>

            {/* Badges — horizontal scroll on mobile */}
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
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 flex-shrink-0">
                  <Icon className="w-3 h-3 text-teal flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-white whitespace-nowrap">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* Company marquee */}
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

          {/* Right — Photo placeholder + badges (desktop only) */}
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
