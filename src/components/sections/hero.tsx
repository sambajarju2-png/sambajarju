'use client';

import { useTranslations } from 'next-intl';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Briefcase, Euro, Users, X } from 'lucide-react';
import Image from 'next/image';
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
  { slug: 'resend', color: 'ffffff', name: 'Resend', usage: 'Transactional email for PayWatch.app.', arc: 1 as const, dur: 35, begin: '0s' },
  { slug: 'supabase', color: '3FCF8E', name: 'Supabase', usage: 'Backend for PayWatch.', arc: 1 as const, dur: 35, begin: '-7s' },
  { slug: 'hubspot', color: 'FF7A59', name: 'HubSpot', usage: 'CRM and marketing automation at Kes Visum.', arc: 2 as const, dur: 30, begin: '0s' },
  { slug: 'semrush', color: 'FF642D', name: 'SEMRush', usage: 'SEO research and competitive analysis.', arc: 1 as const, dur: 35, begin: '-14s' },
  { slug: 'mailchimp', color: 'FFE01B', name: 'Mailchimp', usage: 'Email campaigns and audience management.', arc: 1 as const, dur: 35, begin: '-21s' },
  { slug: 'googleanalytics', color: 'E37400', name: 'Google Analytics', usage: 'GA4 setup and event tracking.', arc: 2 as const, dur: 30, begin: '-8s' },
  { slug: 'hotjar', color: 'FF3C00', name: 'Hotjar', usage: 'Heatmaps and session recordings for CRO.', arc: 1 as const, dur: 35, begin: '-28s' },
  { slug: 'zoho', color: 'C8202B', name: 'Zoho', usage: 'CRM and business applications.', arc: 1 as const, dur: 35, begin: '-32s' },
  { slug: 'wordpress', color: '21759B', name: 'WordPress', usage: 'CMS for client websites and plugins.', arc: 2 as const, dur: 30, begin: '-16s' },
  { slug: 'shopify', color: '7AB55C', name: 'Shopify', usage: 'E-commerce platform.', arc: 1 as const, dur: 35, begin: '-4s' },
  { slug: 'figma', color: 'F24E1E', name: 'Figma', usage: 'UI design and prototyping.', arc: 2 as const, dur: 30, begin: '-22s' },
  { slug: 'anthropic', color: 'D97757', name: 'Claude AI', usage: 'AI assistant for coding, content, and automation.', arc: 1 as const, dur: 35, begin: '-18s' },
  { slug: 'zapier', color: 'FF4F00', name: 'Zapier', usage: 'Connecting tools and automating workflows.', arc: 2 as const, dur: 30, begin: '-26s' },
  { slug: 'mailgun', color: 'F06B66', name: 'Mailgun', usage: 'Email delivery for outreach system.', arc: 2 as const, dur: 30, begin: '-20s' },
  { slug: 'snowflake', color: '29B5E8', name: 'Snowflake', usage: 'Cloud data warehouse for marketing analytics.', arc: 1 as const, dur: 35, begin: '-10s' },
  { slug: 'n8n', color: 'EA4B71', name: 'n8n', usage: 'Workflow automation.', arc: 2 as const, dur: 30, begin: '-4s' },
  { slug: 'sanity', color: 'F03E2F', name: 'Sanity CMS', usage: 'Headless CMS for content management.', arc: 1 as const, dur: 35, begin: '-12s' },
  { slug: 'make', color: '6D00CC', name: 'Make', usage: 'Visual automation platform.', arc: 2 as const, dur: 30, begin: '-15s' },
];

const arcPaths = {
  1: 'M 900 -100 Q 1300 400 700 900',
  2: 'M 950 -50 Q 1350 450 750 950',
};

const allTools = [
  { slug: 'resend', color: 'ffffff' }, { slug: 'supabase', color: '3FCF8E' },
  { slug: 'semrush', color: 'FF642D' }, { slug: 'mailchimp', color: 'FFE01B' },
  { slug: 'googleanalytics', color: 'E37400' }, { slug: 'hotjar', color: 'FF3C00' },
  { slug: 'hubspot', color: 'FF7A59' }, { slug: 'zoho', color: 'C8202B' },
  { slug: 'wordpress', color: '21759B' }, { slug: 'shopify', color: '7AB55C' },
  { slug: 'figma', color: 'F24E1E' }, { slug: 'anthropic', color: 'D97757' },
  { slug: 'zapier', color: 'FF4F00' }, { slug: 'sanity', color: 'F03E2F' },
  { slug: 'make', color: '6D00CC' }, { slug: 'mailgun', color: 'F06B66' },
  { slug: 'snowflake', color: '29B5E8' }, { slug: 'n8n', color: 'EA4B71' },
];

const FILING_COLS = 28;
const FILING_ROWS = 12;
const FILING_COUNT = FILING_COLS * FILING_ROWS;

interface HeroData {
  photoUrl?: string | null;
  greeting_nl?: string;
  greeting_en?: string;
  title_nl?: string;
  title_en?: string;
  subtitle_nl?: string;
  subtitle_en?: string;
  companies?: string[];
  [key: string]: unknown;
}

export function Hero({ heroData }: { heroData?: HeroData | null }) {
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const companies = ['Silverflow', 'Adyen', 'Snowflake', 'Bunq', 'ESET', 'Exact', 'NPO 3', 'Vandebron', 'Visma', 'Odido', 'Mollie'];

  return (
    <section ref={containerRef} className="relative overflow-x-hidden">
      {/* Background — no bottom gradient, clean edge */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }} />
        <div className="absolute w-72 h-72 rounded-full blur-[140px]" style={{ background: 'rgba(239,71,111,0.12)', left: '10%', top: '20%' }} />
        <div className="absolute w-56 h-56 rounded-full blur-[120px]" style={{ background: 'rgba(167,218,220,0.1)', right: '15%', bottom: '20%' }} />
      </div>

      {/* Magnetic Filings */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none overflow-hidden z-[1]">
        <div className="w-full h-full opacity-50" style={{ display: 'grid', gridTemplateColumns: `repeat(${FILING_COLS}, 1fr)`, gridTemplateRows: `repeat(${FILING_ROWS}, 1fr)`, justifyItems: 'center', alignItems: 'center' }}>
          {Array.from({ length: FILING_COUNT }).map((_, i) => (
            <Filing key={i} mouseX={mouseX} mouseY={mouseY} />
          ))}
        </div>
      </div>

      {/* Orbital SVG */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none z-[15]">
        <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path d={arcPaths[1]} fill="none" stroke="rgba(167,218,220,0.12)" strokeWidth="1" />
          <path d={arcPaths[2]} fill="none" stroke="rgba(167,218,220,0.06)" strokeWidth="0.5" />
          {orbitTools.map((tool) => (
            <g key={tool.slug} style={{ cursor: 'pointer', pointerEvents: 'auto' }} onClick={() => setSelectedTool(tool)}>
              <animateMotion dur={`${tool.dur}s`} repeatCount="indefinite" path={arcPaths[tool.arc]} begin={tool.begin} />
              <circle r="22" fill={`#${tool.color}`} opacity="0.08" />
              <circle r="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
              <image href={`https://cdn.simpleicons.org/${tool.slug}/EF476F`} x="-10" y="-10" width="20" height="20" opacity="0.7" />
            </g>
          ))}
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
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center min-h-[auto] lg:min-h-[100svh] pt-28 pb-16 lg:pt-[80px] lg:pb-[48px]">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center w-full">
          <div className="min-w-0 overflow-hidden">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 mb-5 animate-[fadeInUp_0.5s_ease-out]">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FCF8E] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3FCF8E]" />
              </span>
              <span className="text-[11px] font-mono font-medium uppercase tracking-[0.15em]" style={{ color: 'rgba(167,218,220,0.7)' }}>{t('eyebrow')}</span>
            </div>

            <h1 className="text-[clamp(1.75rem,6vw,4.5rem)] font-extrabold leading-[1.08] tracking-tight mb-5 animate-[fadeInUp_0.6s_ease-out_0.05s_both]">
              <span className="text-white">{t('title_line1')}</span><br />
              <span className="text-white">{t('title_line2')}</span><br />
              <span className="text-[#A7DADC]" style={{ fontStyle: 'italic' }}>{t('title_accent')}</span>
              {' '}
              <span className="relative inline-block">
                <span className="text-[#EF476F]">{t('title_highlight')}</span>
                <svg className="absolute -bottom-0.5 left-0 w-full" height="8" viewBox="0 0 120 8" fill="none" preserveAspectRatio="none">
                  <path d="M2 5.5C20 2 40 7 60 4C80 1 100 6 118 3" stroke="#EF476F" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                </svg>
              </span>
            </h1>

            <p className="text-[14px] sm:text-[15px] leading-[1.7] mb-6 animate-[fadeInUp_0.5s_ease-out_0.15s_both]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {t('subtitle')}
            </p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }} className="hidden sm:flex flex-col gap-3 mb-6 sm:flex-row sm:items-center">
              <a
                href="/for"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#EF476F] border-0 text-white text-sm font-semibold transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] no-underline w-full sm:w-auto"
              >
                <span suppressHydrationWarning>{t('cta_primary')}</span>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </a>
              <button
                type="button"
                onClick={() => scrollTo('contact')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/20 bg-transparent text-white text-sm font-medium transition-all hover:bg-white/10 appearance-none w-full sm:w-auto"
              >
                <span suppressHydrationWarning>{t('cta_secondary')}</span>
              </button>
            </motion.div>

            {/* Badges */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }} className="flex gap-2 overflow-x-auto pb-1 lg:hidden mb-4 -mx-6 px-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
              {[
                { icon: Briefcase, label: t('badge_role') },
                { icon: Euro, label: t('badge_salary') },
                { icon: Users, label: t('badge_team') },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                  <Icon style={{ width: 12, height: 12, color: '#A7DADC' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap' }}>{label}</span>
                </div>
              ))}
            </motion.div>

            {/* Mobile tool ticker */}
            <div className="lg:hidden mb-4 overflow-hidden">
              <div className="flex gap-3 animate-marquee" style={{ width: 'max-content' }}>
                {[...allTools, ...allTools].map((tool, i) => (
                  <div key={`${tool.slug}-${i}`} onClick={() => scrollTo('tools')} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                    <img src={`https://cdn.simpleicons.org/${tool.slug}/EF476F`} alt="" width={13} height={13} style={{ opacity: 0.5 }} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            {/* Company marquee */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }} style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('visited')}</p>
              <div className="overflow-hidden relative">
                <div className="flex animate-marquee whitespace-nowrap">
                  {[...companies, ...companies].map((name, i) => (
                    <span key={i} style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.3)', margin: '0 20px' }}>{name}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — Photo + badges (desktop) */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.3 }} className="relative hidden lg:block">
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
              <div style={{ position: 'absolute', inset: 0, borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', overflow: 'hidden' }}>
                {heroData?.photoUrl ? (
                  <Image src={heroData.photoUrl} alt="Samba Jarju" fill style={{ objectFit: 'cover' }} priority sizes="(max-width: 1024px) 0px, 400px" />
                ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users style={{ width: 32, height: 32, color: 'rgba(255,255,255,0.3)' }} /></div>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>Photo placeholder</p>
                  </div>
                </div>
                )}
              </div>
              <motion.div style={{ position: 'absolute', bottom: -12, left: -12, right: 12, display: 'flex', gap: 8 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.6 }}>
                {[
                  { icon: Briefcase, label: t('badge_role') },
                  { icon: Euro, label: t('badge_salary') },
                  { icon: Users, label: t('badge_team') },
                ].map(({ icon: Icon, label }, i) => (
                  <motion.div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }} animate={{ y: [0, -4, 0] }} transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}>
                    <Icon style={{ width: 14, height: 14, color: '#A7DADC', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Clean bottom edge — simple divider, no gradient overlay */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'var(--border)' }} />
    </section>
  );
}
