'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Mail, BarChart3, Zap, Database, Send, Target, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useRef, useEffect } from 'react';

/* Noise SVG as inline data URI */
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

const stats = [
  { value: '500k+', label: 'Emails / maand', icon: Send },
  { value: '42%', label: 'Open rate boost', icon: TrendingUp },
  { value: '7-step', label: 'ABM pipeline', icon: Target },
];

const floatingCards = [
  { label: 'Email verzonden', detail: 'peter@nike.com', icon: Mail, color: '#EF476F', x: 58, y: 12 },
  { label: 'Open rate', detail: '67.3%', icon: BarChart3, color: '#3FCF8E', x: 65, y: 38 },
  { label: 'Automation trigger', detail: 'If opened > 2x → retarget', icon: Zap, color: '#A7DADC', x: 52, y: 62 },
  { label: 'Pipeline update', detail: 'Nike → Site visited', icon: Database, color: '#8B5CF6', x: 70, y: 82 },
];

export default function TestHeroPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [mouseX, mouseY]);

  // Subtle parallax on mouse move
  const bgX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1400], [10, -10]);
  const bgY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 900], [10, -10]);

  return (
    <div>
      {/* Back link */}
      <a href="/" className="fixed top-4 left-4 z-50 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-medium no-underline hover:bg-white/20 transition">
        ← Back to current
      </a>

      <section ref={containerRef} className="relative min-h-screen overflow-hidden flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Base gradient — asymmetric */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg, #011627 0%, #023047 40%, #034a6e 70%, #023047 100%)' }} />

          {/* Parallax glow blobs */}
          <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-0">
            <div className="absolute w-[500px] h-[500px] rounded-full blur-[180px]" style={{ background: 'rgba(239,71,111,0.08)', left: '-5%', top: '10%' }} />
            <div className="absolute w-[400px] h-[400px] rounded-full blur-[160px]" style={{ background: 'rgba(167,218,220,0.06)', right: '5%', top: '40%' }} />
            <div className="absolute w-[300px] h-[300px] rounded-full blur-[120px]" style={{ background: 'rgba(99,102,241,0.05)', right: '20%', bottom: '10%' }} />
          </motion.div>

          {/* Grain overlay */}
          <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />

          {/* Subtle grid lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* Content — asymmetric: 60/40 split */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-24 lg:py-0">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-6 items-center min-h-screen lg:min-h-0 lg:h-screen lg:max-h-[900px]">

            {/* LEFT — Text heavy */}
            <div className="pt-16 lg:pt-0">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <div className="w-2 h-2 rounded-full bg-[#3FCF8E] animate-pulse" />
                <span className="text-xs font-mono text-[#A7DADC]/70 uppercase tracking-widest">Beschikbaar voor projecten</span>
              </motion.div>

              {/* Headline — asymmetric sizing */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-[clamp(2rem,5.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight mb-6"
              >
                <span className="text-white">Je CRM weet meer</span><br />
                <span className="text-white">dan je denkt.</span><br />
                <span className="text-[#A7DADC]" style={{ fontStyle: 'italic', fontWeight: 800 }}>Ik maak het</span>
                {' '}
                <span className="relative inline-block">
                  <span className="text-[#EF476F]">actief.</span>
                  {/* hand-drawn underline feel */}
                  <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 120 8" fill="none" preserveAspectRatio="none">
                    <path d="M2 5.5C20 2 40 7 60 4C80 1 100 6 118 3" stroke="#EF476F" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
                  </svg>
                </span>
              </motion.h1>

              {/* Subtext — opinionated, not corporate */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-[15px] leading-relaxed max-w-[480px] mb-8"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                De meeste email funnels lekken geld. Ik bouw systemen die opvolgen wanneer jij het vergeet — van eerste contact tot deal, volledig geautomatiseerd.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-col sm:flex-row gap-3 mb-10"
              >
                <a
                  href="/for"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#EF476F] text-white text-sm font-bold no-underline transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Bekijk wat ik voor jouw bedrijf kan doen
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/15 text-white/80 text-sm font-medium no-underline transition-all hover:bg-white/5 hover:border-white/25"
                >
                  Neem contact op
                </a>
              </motion.div>

              {/* Proof stats — inline, not cards */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex gap-8 pt-6"
                style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
              >
                {stats.map(({ value, label, icon: Icon }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Icon size={14} style={{ color: '#EF476F', opacity: 0.7 }} />
                    <div>
                      <div className="text-white font-extrabold text-lg leading-none">{value}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — Floating UI cards (not a photo) */}
            <div className="relative hidden lg:block h-[600px]">
              {/* Photo behind the cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute top-[10%] left-[15%] w-[280px] h-[350px] rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
              >
                <Image
                  src="https://cdn.sanity.io/images/ncaxnx1f/production/457dbd5579630310e185021175c7b426e7619fa2-800x800.png?rect=80,0,640,800&w=400&h=500"
                  alt="Samba Jarju"
                  fill
                  style={{ objectFit: 'cover', opacity: 0.7 }}
                  priority
                />
                {/* Gradient fade over photo */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,48,71,0.8) 0%, transparent 50%)' }} />
              </motion.div>

              {/* Floating cards overlapping the photo */}
              {floatingCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.4 + i * 0.12 }}
                  style={{ position: 'absolute', left: `${card.x}%`, top: `${card.y}%`, transform: 'translate(-50%, -50%)' }}
                  className="group"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl transition-all hover:scale-105"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: `0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.05)`,
                      minWidth: 220,
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}>
                      <card.icon size={15} style={{ color: card.color }} />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-white/80">{card.label}</div>
                      <div className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>{card.detail}</div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}

              {/* Connection lines between cards (subtle) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.08 }}>
                <line x1="62%" y1="18%" x2="68%" y2="38%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="68%" y1="44%" x2="58%" y2="62%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="58%" y1="68%" x2="72%" y2="82%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Company marquee at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-0 left-0 right-0 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.1)' }}
        >
          <div className="overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...'Silverflow,Adyen,Snowflake,Bunq,ESET,Exact,NPO 3,Vandebron,Visma,Odido,Mollie'.split(','), ...'Silverflow,Adyen,Snowflake,Bunq,ESET,Exact,NPO 3,Vandebron,Visma,Odido,Mollie'.split(',')].map((name, i) => (
                <span key={i} className="mx-6 text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.2)' }}>{name}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'var(--border)' }} />
      </section>

      {/* Second section — quick scroll target to see transition */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <p className="text-sm text-[#8BA3B5] mb-2 font-mono uppercase tracking-wider">Test pagina</p>
        <h2 className="text-3xl font-extrabold text-[#023047] mb-4">Dit is een test van de nieuwe hero</h2>
        <p className="text-[#4A6B7F] leading-relaxed mb-6">
          Vergelijk dit met de huidige versie op <a href="/" className="text-[#EF476F] underline">sambajarju.com</a>.
          Let op het verschil in layout (asymmetrisch vs gecentreerd), de grain textuur,
          de floating UI cards in plaats van alleen een foto, en de scherpere copy.
        </p>
        <div className="flex gap-3">
          <a href="/" className="px-5 py-2.5 rounded-lg bg-[#023047] text-white text-sm font-semibold no-underline">Bekijk huidige versie</a>
          <a href="/test-hero" className="px-5 py-2.5 rounded-lg border border-[#E2E8F0] text-sm font-semibold no-underline text-[#023047]">Refresh test</a>
        </div>
      </section>
    </div>
  );
}
