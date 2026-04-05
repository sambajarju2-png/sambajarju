'use client';

import { useTranslations } from 'next-intl';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Briefcase, Euro, Users, Sparkles } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

export function Hero() {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth spring-based cursor tracking
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Transform cursor position to gradient position
  const gradientX = useTransform(springX, [0, 1], ['20%', '80%']);
  const gradientY = useTransform(springY, [0, 1], ['20%', '80%']);

  // Parallax for grid
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
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden cursor-crosshair">
      {/* Base gradient */}
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

      {/* Animated grid with parallax */}
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

      {/* Orbital arc */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Main arc */}
          <path
            d="M 900 -100 Q 1300 400 700 900"
            fill="none"
            stroke="rgba(167,218,220,0.15)"
            strokeWidth="1"
          />
          {/* Second arc */}
          <path
            d="M 950 -50 Q 1350 450 750 950"
            fill="none"
            stroke="rgba(167,218,220,0.08)"
            strokeWidth="0.5"
          />

          {/* Orbiting dots */}
          <circle r="4" fill="#A7DADC" opacity="0.6">
            <animateMotion dur="20s" repeatCount="indefinite" path="M 900 -100 Q 1300 400 700 900" />
          </circle>
          <circle r="2" fill="white" opacity="0.4">
            <animateMotion dur="15s" repeatCount="indefinite" path="M 950 -50 Q 1350 450 750 950" begin="3s" />
          </circle>
          <circle r="3" fill="#EF476F" opacity="0.5">
            <animateMotion dur="25s" repeatCount="indefinite" path="M 900 -100 Q 1300 400 700 900" begin="8s" />
          </circle>

          {/* Static glow points on arc */}
          <circle cx="1050" cy="150" r="5" fill="#A7DADC" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="1100" cy="350" r="3" fill="white" opacity="0.2">
            <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" begin="1s" />
          </circle>
          <circle cx="950" cy="600" r="4" fill="#EF476F" opacity="0.2">
            <animate attributeName="opacity" values="0.15;0.4;0.15" dur="5s" repeatCount="indefinite" begin="2s" />
          </circle>
        </svg>
      </div>

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
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-teal" />
              <span className="text-sm text-teal font-medium">{t('greeting')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight"
            >
              {t('title').split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                  className={`inline-block mr-[0.3em] ${i === 1 ? 'text-teal' : ''}`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-white/60 max-w-lg leading-relaxed"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02]"
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
                    <span key={i} className="text-sm font-semibold text-white/25 mx-6 hover:text-white/50 transition-colors">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — Photo placeholder + floating badges */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
              {/* Glassmorphism frame */}
              <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center">
                      <Users className="w-8 h-8 text-white/30" />
                    </div>
                    <p className="text-white/25 text-sm">Photo placeholder</p>
                  </div>
                </div>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_ease_infinite]" />
              </div>

              {/* Floating glassmorphism badges */}
              <motion.div
                className="absolute -bottom-3 -left-3 right-3 flex gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
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

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
