'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/motion';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Zap, Briefcase, Rocket, Building2, Award, ChevronRight, Sparkles } from 'lucide-react';

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

  return (
    <section id="experience" className="py-24 bg-background-alt">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider">
            <span className="w-8 h-px bg-accent" />
            {t('label')}
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mt-4">{t('title')}</h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-foreground-muted mt-3 text-lg">{t('subtitle')}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 grid lg:grid-cols-[300px_1fr] gap-8">
            {/* Left - Timeline selector */}
            <div className="space-y-2">
              {experiences.map(({ key, icon: Icon, active, color }, index) => (
                <button
                  key={key}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${
                    activeIndex === index
                      ? 'bg-surface border-accent shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-surface hover:border-border'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    activeIndex === index ? color + ' text-white' : 'bg-background-alt text-foreground-subtle'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold text-sm truncate ${activeIndex === index ? 'text-foreground' : 'text-foreground-muted'}`}>
                      {t(`${key}.company`)}
                    </p>
                    <p className="text-xs text-foreground-subtle truncate">{t(`${key}.period`)}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ml-auto flex-shrink-0 transition-all ${
                    activeIndex === index ? 'text-accent opacity-100' : 'opacity-0 group-hover:opacity-50'
                  }`} />
                </button>
              ))}
            </div>

            {/* Right - Detail card */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-border bg-surface p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-full" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {t(`${experiences[activeIndex].key}.company`)}
                    </h3>
                    <p className="text-accent font-semibold mt-1">
                      {t(`${experiences[activeIndex].key}.role`)}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-background-alt border border-border text-foreground-subtle">
                    {t(`${experiences[activeIndex].key}.period`)}
                  </span>
                </div>

                <p className="text-foreground-muted leading-relaxed mt-4 text-lg">
                  {t(`${experiences[activeIndex].key}.description`)}
                </p>

                {experiences[activeIndex].active && (
                  <div className="mt-6 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Currently active</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
