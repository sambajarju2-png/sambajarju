'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { Workflow, Calculator, Database, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Playground() {
  const t = useTranslations('playground');
  const locale = useLocale();

  const demos = [
    { icon: Workflow, title: 'Email Automation Flow', desc: 'Watch a subscriber journey from signup to conversion with animated emails flowing through the pipeline.', color: 'from-blue-500/10 to-violet-500/10', border: 'hover:border-blue-300 dark:hover:border-blue-700' },
    { icon: Calculator, title: 'ROI Calculator', desc: 'Calculate how much time and money marketing automation saves with interactive sliders.', color: 'from-emerald-500/10 to-teal-500/10', border: 'hover:border-emerald-300 dark:hover:border-emerald-700' },
    { icon: Database, title: 'SQL in Marketing', desc: 'See how marketing goals translate to SQL queries and AMPscript — the code behind 500k+ emails/month.', color: 'from-amber-500/10 to-orange-500/10', border: 'hover:border-amber-300 dark:hover:border-amber-700' },
    { icon: BarChart3, title: 'Campaign Dashboard', desc: 'Live metrics from a fictional email campaign with animated charts and counters.', color: 'from-pink-500/10 to-rose-500/10', border: 'hover:border-pink-300 dark:hover:border-pink-700' },
  ];

  return (
    <section className="py-24 bg-background-alt">
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

        <StaggerContainer className="grid md:grid-cols-2 gap-5 mt-10">
          {demos.map(({ icon: Icon, title, desc, color, border }) => (
            <StaggerItem key={title}>
              <Link
                href={`/${locale}/playground`}
                className={`group block rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:shadow-md ${border}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-accent transition-colors">{title}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
