'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/motion';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Zap, Briefcase, Rocket, Building2, Award, ChevronRight, Sparkles, X } from 'lucide-react';

const experiences = [
  { key: 'vandebron', icon: Zap, active: true, color: 'bg-accent' },
  { key: 'cleanprofs', icon: Sparkles, active: true, color: 'bg-teal' },
  { key: 'cordital', icon: Rocket, active: false, color: 'bg-teal' },
  { key: 'guardey', icon: Building2, active: false, color: 'bg-navy dark:bg-secondary' },
  { key: 'silverflow', icon: Briefcase, active: false, color: 'bg-navy dark:bg-secondary' },
  { key: 'kesvisum', icon: Award, active: false, color: 'bg-accent' },
];

export function Experience() {
  const t = useTranslations('experience');
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    // On mobile, open the bottom sheet
    if (window.innerWidth < 1024) {
      setMobileOpen(true);
    }
  };

  const activeExp = experiences[activeIndex];

  const DetailContent = () => (
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            {t(`${activeExp.key}.company`)}
          </h3>
          <p className="text-accent font-semibold mt-1">
            {t(`${activeExp.key}.role`)}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-background-alt border border-border text-foreground-subtle whitespace-nowrap">
          {t(`${activeExp.key}.period`)}
        </span>
      </div>

      <p className="text-foreground-muted leading-relaxed text-sm sm:text-lg mt-4">
        {t(`${activeExp.key}.description`)}
      </p>

      {activeExp.active && (
        <div className="mt-4 sm:mt-6 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">Currently active</span>
        </div>
      )}
    </div>
  );

  return (
    <section id="experience" className="py-16 sm:py-24 bg-background-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider">
            <span className="w-8 h-px bg-accent" />
            {t('label')}
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mt-4">{t('title')}</h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-foreground-muted mt-3 text-base sm:text-lg">{t('subtitle')}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 sm:mt-12 grid lg:grid-cols-[300px_1fr] gap-6 sm:gap-8">
            {/* Timeline selector */}
            <div className="space-y-2">
              {experiences.map(({ key, icon: Icon, active, color }, index) => (
                <button
                  key={key}
                  onClick={() => handleSelect(index)}
                  className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 sm:gap-4 group ${
                    activeIndex === index
                      ? 'bg-surface border-accent shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-surface hover:border-border'
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    activeIndex === index ? color + ' text-white' : 'bg-background-alt text-foreground-subtle'
                  }`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold text-sm truncate ${activeIndex === index ? 'text-foreground' : 'text-foreground-muted'}`}>
                      {t(`${key}.company`)}
                    </p>
                    <p className="text-xs text-foreground-subtle truncate">{t(`${key}.period`)}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-all ${
                    activeIndex === index ? 'text-accent opacity-100' : 'opacity-0 group-hover:opacity-50'
                  }`} />
                </button>
              ))}
            </div>

            {/* Desktop detail card — hidden on mobile */}
            <div className="hidden lg:block">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="rounded-2xl border border-border bg-surface p-6 sm:p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-full" />
                <DetailContent />
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border rounded-t-2xl z-50 lg:hidden max-h-[70vh] overflow-y-auto"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              <div className="px-5 pb-8 pt-2">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeExp.color} text-white`}>
                    <activeExp.icon className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-lg hover:bg-background-alt text-foreground-subtle"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <DetailContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
