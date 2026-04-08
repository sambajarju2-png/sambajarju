'use client';

import { useTranslations } from 'next-intl';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { FlaskConical, Target, Terminal, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Playground() {
  const t = useTranslations('playground');

  const demos = [
    { icon: FlaskConical, title: 'A/B Test Arena', desc: 'Pick the winning subject line. Test your marketing instincts against real campaign data.', color: 'from-violet-500/10 to-purple-500/10', border: 'hover:border-violet-300 dark:hover:border-violet-700' },
    { icon: Target, title: 'Subject Line Analyzer', desc: 'AI-powered analysis of any email subject line. Get instant scores and improvement tips.', color: 'from-pink-500/10 to-rose-500/10', border: 'hover:border-pink-300 dark:hover:border-pink-700' },
    { icon: Terminal, title: 'SQL Query Builder', desc: 'Write and run Snowflake SQL queries against energy customer data. 100 rows, real syntax.', color: 'from-blue-500/10 to-cyan-500/10', border: 'hover:border-blue-300 dark:hover:border-blue-700' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background-alt">
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

        <StaggerContainer className="grid sm:grid-cols-2 gap-4 sm:gap-5 mt-8 sm:mt-10">
          {demos.map(({ icon: Icon, title, desc, color, border }) => (
            <StaggerItem key={title}>
              <Link
                href="/playground"
                className={`group block rounded-2xl border border-border bg-surface p-5 sm:p-6 transition-all duration-300 hover:shadow-md ${border}`}
              >
                <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 sm:mb-4`}>
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-bold text-foreground text-base sm:text-lg mb-1.5 sm:mb-2 group-hover:text-accent transition-colors">{title}</h3>
                <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">{desc}</p>
                <div className="mt-3 sm:mt-4 flex items-center gap-1 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Reveal delay={0.3}>
          <div className="mt-6 text-center">
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
            >
              View all demos
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
