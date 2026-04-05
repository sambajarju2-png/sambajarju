'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/motion';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, MousePointerClick, TrendingUp, Users, ArrowUpRight, Activity, Workflow } from 'lucide-react';
import { EmailFlowVisualizer } from './email-flow';

function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      className="tabular-nums"
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  );
}

const miniChart = [35, 45, 38, 52, 48, 65, 58, 72, 68, 85, 78, 92];

export function Playground() {
  const t = useTranslations('playground');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'flow'>('flow');

  const metrics = [
    { icon: Mail, label: t('emails_sent'), value: 524890, suffix: '', color: 'text-accent' },
    { icon: TrendingUp, label: t('open_rate'), value: 34, suffix: '%', color: 'text-emerald-500' },
    { icon: MousePointerClick, label: t('click_rate'), value: 8, suffix: '%', color: 'text-blue-500' },
    { icon: Users, label: t('conversions'), value: 1247, suffix: '', color: 'text-amber-500' },
  ];

  const tabs = [
    { key: 'flow' as const, icon: Workflow, label: 'Automation Flow' },
    { key: 'dashboard' as const, icon: Activity, label: 'Campaign Dashboard' },
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

        {/* Tab switcher */}
        <Reveal delay={0.2}>
          <div className="flex gap-1 p-1 rounded-xl bg-surface border border-border w-fit mt-8">
            {tabs.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === key
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-foreground-subtle hover:text-foreground-muted hover:bg-background-alt'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {activeTab === 'flow' ? (
                <motion.div
                  key="flow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <EmailFlowVisualizer />
                </motion.div>
              ) : (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
                    {/* Dashboard header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-accent" />
                        <span className="font-bold text-foreground text-sm">{t('dashboard_title')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                        <span className="text-xs text-green-600 dark:text-green-400">Live</span>
                      </div>
                    </div>

                    {/* Metrics row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
                      {metrics.map(({ icon: Icon, label, value, suffix, color }) => (
                        <div key={label} className="bg-surface p-5 group hover:bg-surface-hover transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={`w-4 h-4 ${color}`} />
                            <span className="text-xs text-foreground-subtle font-medium">{label}</span>
                          </div>
                          <div className="text-2xl font-bold text-foreground flex items-baseline gap-1">
                            <AnimatedCounter end={value} suffix={suffix} />
                            <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mini chart */}
                    <div className="p-6">
                      <div className="flex items-end gap-2 h-32">
                        {miniChart.map((value, i) => (
                          <motion.div
                            key={i}
                            className="flex-1 rounded-t-md cursor-pointer transition-colors"
                            style={{
                              height: `${value}%`,
                              background: hoveredBar === i ? 'var(--accent)' : 'var(--secondary)',
                            }}
                            onHoverStart={() => setHoveredBar(i)}
                            onHoverEnd={() => setHoveredBar(null)}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-foreground-subtle">
                        <span>Jan</span>
                        <span>Jun</span>
                        <span>Dec</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
