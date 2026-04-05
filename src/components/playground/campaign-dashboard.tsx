'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, MousePointerClick, TrendingUp, Users, ArrowUpRight, Activity } from 'lucide-react';

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / 125;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end]);

  return (
    <motion.span onViewportEnter={() => setStarted(true)} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </motion.span>
  );
}

const chartData = [35, 45, 38, 52, 48, 65, 58, 72, 68, 85, 78, 92];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function CampaignDashboard() {
  const t = useTranslations('playground_page');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const metrics = [
    { icon: Mail, label: 'Emails Sent', value: 524890, suffix: '', color: 'text-accent', trend: '+12%' },
    { icon: TrendingUp, label: 'Open Rate', value: 34, suffix: '%', color: 'text-emerald-500', trend: '+3.2%' },
    { icon: MousePointerClick, label: 'Click Rate', value: 8, suffix: '%', color: 'text-blue-500', trend: '+1.8%' },
    { icon: Users, label: 'Conversions', value: 1247, suffix: '', color: 'text-amber-500', trend: '+24%' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
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

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {metrics.map(({ icon: Icon, label, value, suffix, color, trend }) => (
          <div key={label} className="bg-surface p-5 group hover:bg-surface-hover transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs text-foreground-subtle font-medium">{label}</span>
            </div>
            <div className="text-2xl font-bold text-foreground flex items-baseline gap-2">
              <AnimatedCounter end={value} suffix={suffix} />
              <span className="text-xs font-medium text-emerald-500 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-6">
        <p className="text-xs font-medium text-foreground-subtle mb-4">Monthly email performance</p>
        <div className="flex items-end gap-2 h-40">
          {chartData.map((value, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-t-md cursor-pointer transition-colors relative"
                style={{
                  height: `${value}%`,
                  background: hoveredBar === i ? 'var(--accent)' : 'var(--secondary)',
                }}
                onHoverStart={() => setHoveredBar(i)}
                onHoverEnd={() => setHoveredBar(null)}
                initial={{ height: 0 }}
                whileInView={{ height: `${value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
              >
                {hoveredBar === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-accent whitespace-nowrap bg-surface px-1.5 py-0.5 rounded border border-border shadow-sm"
                  >
                    {value}%
                  </motion.div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {months.map((m, i) => (
            <span key={m} className={`text-[10px] flex-1 text-center ${hoveredBar === i ? 'text-accent font-medium' : 'text-foreground-subtle'}`}>
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
