'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, FlaskConical, Target, Terminal } from 'lucide-react';
import { ABTestArena } from '@/components/playground/ab-test-arena';
import { SubjectLineAnalyzer } from '@/components/playground/subject-analyzer';
import { SQLQueryBuilder } from '@/components/playground/sql-query-builder';
import Link from 'next/link';

const sections = [
  { id: 'ab-test', num: '01', icon: FlaskConical, titleKey: 'ab_title' as const, subtitleKey: 'ab_subtitle' as const },
  { id: 'analyzer', num: '02', icon: Target, titleKey: 'analyzer_title' as const, subtitleKey: 'analyzer_subtitle' as const },
  { id: 'sql-builder', num: '03', icon: Terminal, titleKey: 'sql_title' as const, subtitleKey: 'sql_subtitle' as const },
];

const components: Record<string, React.ReactNode> = {
  'ab-test': <ABTestArena />,
  'analyzer': <SubjectLineAnalyzer />,
  'sql-builder': <SQLQueryBuilder />,
};

export default function PlaygroundPage() {
  const t = useTranslations('playground_page');
  const locale = useLocale();

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted mt-2 sm:mt-3 max-w-2xl">{t('subtitle')}</p>
        </motion.div>

        {/* Quick nav — horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
          className="mt-4 sm:mt-6 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto"
        >
          <div className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0">
            {sections.map(({ id, icon: Icon, titleKey }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-border text-foreground-muted hover:text-foreground hover:border-border-hover transition-all whitespace-nowrap"
              >
                <Icon className="w-3.5 h-3.5" />
                {t(titleKey)}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-20">
        {sections.map(({ id, num, icon: Icon, titleKey, subtitleKey }) => (
          <motion.section
            key={id}
            id={id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          >
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider mb-1 sm:mb-2">
                <Icon className="w-4 h-4" />
                {num}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{t(titleKey)}</h2>
              <p className="text-sm sm:text-base text-foreground-muted mt-1">{t(subtitleKey)}</p>
            </div>
            {components[id]}
          </motion.section>
        ))}
      </div>
    </div>
  );
}
