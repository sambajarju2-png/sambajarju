'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calculator, Clock, Euro, Mail, TrendingUp, Sparkles } from 'lucide-react';

function formatNumber(n: number): string {
  return n.toLocaleString('nl-NL');
}

export function ROICalculator() {
  const t = useTranslations('playground_page');
  const [listSize, setListSize] = useState(10000);
  const [manualHours, setManualHours] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(45);

  // Calculations
  const automationEfficiency = 0.75; // 75% time saved
  const hoursSaved = Math.round(manualHours * 4 * automationEfficiency);
  const moneySaved = Math.round(hoursSaved * hourlyRate);
  const emailsAutomated = Math.round(listSize * 3.5); // ~3.5 emails per contact per month

  const sliders = [
    { label: t('roi_list_size'), value: listSize, setter: setListSize, min: 1000, max: 100000, step: 1000, format: (v: number) => formatNumber(v), icon: Mail },
    { label: t('roi_manual_hours'), value: manualHours, setter: setManualHours, min: 5, max: 60, step: 1, format: (v: number) => `${v}h`, icon: Clock },
    { label: t('roi_hourly_rate'), value: hourlyRate, setter: setHourlyRate, min: 25, max: 100, step: 5, format: (v: number) => `€${v}`, icon: Euro },
  ];

  const results = [
    { label: t('roi_hours_saved'), value: `${hoursSaved}h`, icon: Clock, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
    { label: t('roi_money_saved'), value: `€${formatNumber(moneySaved)}`, icon: Euro, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/50' },
    { label: t('roi_emails_auto'), value: formatNumber(emailsAutomated), icon: Mail, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/50' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-accent" />
          <span className="font-bold text-foreground text-sm">{t('roi_title')}</span>
        </div>
        <TrendingUp className="w-4 h-4 text-emerald-500" />
      </div>

      <div className="p-6 lg:p-8 space-y-8">
        {/* Sliders */}
        <div className="space-y-6">
          {sliders.map(({ label, value, setter, min, max, step, format, icon: Icon }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-foreground-subtle" />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
                <span className="text-sm font-bold text-accent font-mono">{format(value)}</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer
                  bg-border [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-white
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
              />
              <div className="flex justify-between mt-1 text-[10px] text-foreground-subtle">
                <span>{format(min)}</span>
                <span>{format(max)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold text-accent uppercase tracking-wider">With automation</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {results.map(({ label, value, icon: Icon, color, bg }) => (
            <motion.div
              key={label}
              layout
              className={`rounded-xl p-4 ${bg} text-center`}
            >
              <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
              <motion.p
                key={value}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-2xl font-extrabold ${color} font-mono`}
              >
                {value}
              </motion.p>
              <p className="text-xs text-foreground-subtle mt-1 font-medium">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
