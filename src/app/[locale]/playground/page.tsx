'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Workflow, Calculator, Database, BarChart3, Terminal, Code2 } from 'lucide-react';
import { EmailFlowV2 } from '@/components/playground/email-flow-v2';
import { ROICalculator } from '@/components/playground/roi-calculator';
import { SQLShowcase } from '@/components/playground/sql-showcase';
import { SQLQueryBuilder } from '@/components/playground/sql-query-builder';
import { CampaignDashboard } from '@/components/playground/campaign-dashboard';
import Link from 'next/link';

const demos = [
  { id: 'flow', icon: Workflow },
  { id: 'roi', icon: Calculator },
  { id: 'sql-builder', icon: Terminal },
  { id: 'sql-showcase', icon: Code2 },
  { id: 'dashboard', icon: BarChart3 },
];

export default function PlaygroundPage() {
  const t = useTranslations('playground_page');
  const locale = useLocale();

  const sections = [
    { id: 'flow', num: '01', icon: Workflow, titleKey: 'flow_title', subtitleKey: 'flow_subtitle', component: <EmailFlowV2 /> },
    { id: 'roi', num: '02', icon: Calculator, titleKey: 'roi_title', subtitleKey: 'roi_subtitle', component: <ROICalculator /> },
    { id: 'sql-builder', num: '03', icon: Terminal, titleKey: 'sql_title', subtitleKey: 'sql_subtitle', component: <SQLQueryBuilder /> },
    { id: 'sql-showcase', num: '04', icon: Code2, titleKey: 'sql_showcase_title', subtitleKey: 'sql_showcase_subtitle', component: <SQLShowcase /> },
    { id: 'dashboard', num: '05', icon: BarChart3, titleKey: 'dashboard_title', subtitleKey: 'dashboard_subtitle', component: <CampaignDashboard /> },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg text-foreground-muted mt-3 max-w-2xl">{t('subtitle')}</p>
        </motion.div>

        {/* Quick nav */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mt-6"
        >
          {sections.map(({ id, icon: Icon, titleKey }) => (
            <a
              key={id}
              href={`#${id}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-border text-foreground-muted hover:text-foreground hover:border-border-hover transition-all"
            >
              <Icon className="w-3.5 h-3.5" />
              {t(titleKey)}
            </a>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {sections.map(({ id, num, icon: Icon, titleKey, subtitleKey, component }) => (
          <motion.section
            key={id}
            id={id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider mb-2">
                <Icon className="w-4 h-4" />
                {num}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t(titleKey)}</h2>
              <p className="text-foreground-muted mt-1">{t(subtitleKey)}</p>
            </div>
            {component}
          </motion.section>
        ))}
      </div>
    </div>
  );
}
