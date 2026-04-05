'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Workflow, Calculator, Database, BarChart3 } from 'lucide-react';
import { EmailFlowV2 } from '@/components/playground/email-flow-v2';
import { ROICalculator } from '@/components/playground/roi-calculator';
import { SQLShowcase } from '@/components/playground/sql-showcase';
import { CampaignDashboard } from '@/components/playground/campaign-dashboard';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const demos = [
  { id: 'flow', icon: Workflow, gradient: 'from-blue-500/10 to-violet-500/10' },
  { id: 'roi', icon: Calculator, gradient: 'from-emerald-500/10 to-teal-500/10' },
  { id: 'sql', icon: Database, gradient: 'from-amber-500/10 to-orange-500/10' },
  { id: 'dashboard', icon: BarChart3, gradient: 'from-pink-500/10 to-rose-500/10' },
];

export default function PlaygroundPage() {
  const t = useTranslations('playground_page');
  const locale = useLocale();

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg text-foreground-muted mt-3 max-w-2xl">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Quick nav pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mt-6"
        >
          {demos.map(({ id, icon: Icon, gradient }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r ${gradient} border border-border text-foreground hover:border-border-hover transition-all`}
            >
              <Icon className="w-4 h-4" />
              {t(`${id === 'flow' ? 'flow' : id === 'roi' ? 'roi' : id === 'sql' ? 'sql' : 'dashboard'}_title`)}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Demos */}
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* 1. Email Flow */}
        <motion.section
          id="flow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider mb-2">
              <Workflow className="w-4 h-4" />
              01
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('flow_title')}</h2>
            <p className="text-foreground-muted mt-1">{t('flow_subtitle')}</p>
          </div>
          <EmailFlowV2 />
        </motion.section>

        {/* 2. ROI Calculator */}
        <motion.section
          id="roi"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider mb-2">
              <Calculator className="w-4 h-4" />
              02
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('roi_title')}</h2>
            <p className="text-foreground-muted mt-1">{t('roi_subtitle')}</p>
          </div>
          <ROICalculator />
        </motion.section>

        {/* 3. SQL Showcase */}
        <motion.section
          id="sql"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider mb-2">
              <Database className="w-4 h-4" />
              03
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('sql_title')}</h2>
            <p className="text-foreground-muted mt-1">{t('sql_subtitle')}</p>
          </div>
          <SQLShowcase />
        </motion.section>

        {/* 4. Campaign Dashboard */}
        <motion.section
          id="dashboard"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider mb-2">
              <BarChart3 className="w-4 h-4" />
              04
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('dashboard_title')}</h2>
            <p className="text-foreground-muted mt-1">{t('dashboard_subtitle')}</p>
          </div>
          <CampaignDashboard />
        </motion.section>
      </div>
    </div>
  );
}
