'use client';

import { useTranslations } from 'next-intl';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, Wrench, GraduationCap, AlertTriangle, Globe, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function Projects() {
  const t = useTranslations('projects');
  const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'learned'>('problem');

  const tabs = [
    { key: 'problem' as const, icon: AlertTriangle, label: 'Problem' },
    { key: 'solution' as const, icon: Wrench, label: 'Solution' },
    { key: 'learned' as const, icon: GraduationCap, label: 'Learned' },
  ];

  const otherProjects = [
    { key: 'abm_outreach', icon: Zap, url: '/abm-outreach', color: 'from-pink-500/20 to-rose-500/20', comingSoon: false, internal: true },
    { key: 'cleanprofs', icon: Sparkles, url: 'https://cleanprofs.nl', color: 'from-emerald-500/20 to-teal-500/20', comingSoon: false, internal: false },
    { key: 'workwings', icon: Globe, url: 'https://workwings.nl', color: 'from-blue-500/20 to-cyan-500/20', comingSoon: true, internal: false },
  ];

  return (
    <section id="projects" className="py-16 sm:py-24 bg-background-alt">
      <div className="max-w-7xl mx-auto px-6">
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
          <p className="text-foreground-muted mt-3 text-lg">{t('subtitle')}</p>
        </Reveal>

        {/* PayWatch featured project */}
        <Reveal delay={0.2}>
          <div className="mt-12 rounded-2xl border border-border bg-surface overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="grid lg:grid-cols-2">
              {/* Left - Image placeholder */}
              <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-navy/5 to-accent/5 border-b lg:border-b-0 lg:border-r border-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 dot-pattern opacity-30" />
                <div className="relative z-10 text-center space-y-3 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 mx-auto flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{t('paywatch.title')}</h3>
                  <p className="text-sm text-foreground-subtle max-w-xs mx-auto">{t('paywatch.description')}</p>
                </div>
              </div>

              {/* Right - Case study tabs */}
              <div className="p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">{t('case_study')}</span>
                  <a
                    href="https://www.paywatch.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-foreground-muted hover:text-accent transition-colors"
                  >
                    {t('view_project')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl bg-background-alt">
                  {tabs.map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        activeTab === key
                          ? 'bg-surface text-foreground shadow-sm'
                          : 'text-foreground-subtle hover:text-foreground-muted'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-foreground-muted leading-relaxed min-h-[100px]"
                >
                  {t(`paywatch.${activeTab}`)}
                </motion.div>

                {/* Tech stack pills */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {t('paywatch.tech').split(' · ').map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-background-alt border border-border text-foreground-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Other projects */}
        <StaggerContainer className="grid md:grid-cols-3 gap-6 mt-8">
          {otherProjects.map(({ key, icon: Icon, url, color, comingSoon, internal }) => {
            const cardClass = `group block rounded-2xl border border-border bg-surface p-6 transition-all relative overflow-hidden ${comingSoon ? 'cursor-default' : 'hover:border-border-hover hover:shadow-md'}`;
            const cardContent = (
              <>
                {comingSoon && (
                  <div className="absolute inset-0 backdrop-blur-[2px] bg-surface/60 z-10 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-accent/10 text-accent border border-accent/20">Coming soon</span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-accent transition-colors">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {t(`${key}.description`)}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('view_project')}
                  <ExternalLink className="w-3 h-3" />
                </div>
              </>
            );

            return (
              <StaggerItem key={key}>
                {comingSoon ? (
                  <div className={cardClass}>{cardContent}</div>
                ) : internal ? (
                  <Link href={url} className={cardClass}>{cardContent}</Link>
                ) : (
                  <a href={url} target="_blank" rel="noopener noreferrer" className={cardClass}>{cardContent}</a>
                )}
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
