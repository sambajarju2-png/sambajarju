'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Euro, Users, Sparkles } from 'lucide-react';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }} />

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-[120px]"
        style={{ background: 'var(--glow-pink)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full blur-[100px]"
        style={{ background: 'var(--glow-teal)' }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
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
                <span key={i} className={i === 1 ? 'text-teal' : ''}>
                  {word}{' '}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/60 max-w-lg leading-relaxed"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-accent/25"
              >
                {t('cta_primary')}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 font-medium transition-all duration-200"
              >
                {t('cta_secondary')}
              </a>
            </motion.div>

            {/* Company logos strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-6 border-t border-white/10"
            >
              <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">{t('visited')}</p>
              <div className="flex items-center gap-6 flex-wrap">
                {['ESET', 'Exact', 'NPO 3', 'Vandebron', 'Visma', 'Odido', 'Mollie'].map((name) => (
                  <span key={name} className="text-sm font-medium text-white/30 hover:text-white/60 transition-colors">
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right side - Photo + badges */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Photo placeholder */}
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center">
                    <Users className="w-8 h-8 text-white/40" />
                  </div>
                  <p className="text-white/30 text-sm">Photo placeholder</p>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -bottom-4 -left-4 flex gap-3"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {[
                  { icon: Briefcase, label: t('badge_role') },
                  { icon: Euro, label: t('badge_salary') },
                  { icon: Users, label: t('badge_team') },
                ].map(({ icon: Icon, label }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg"
                  >
                    <Icon className="w-4 h-4 text-teal" />
                    <span className="text-sm font-semibold text-white whitespace-nowrap">{label}</span>
                  </div>
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
