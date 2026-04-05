'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Euro, Users, Target, Handshake, ArrowDown } from 'lucide-react';

interface FunnelStage {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultRate: number;
  color: string;
  darkColor: string;
}

const stages: FunnelStage[] = [
  { name: 'Website visitors', icon: Users, defaultRate: 100, color: '#A7DADC', darkColor: '#5B8A9A' },
  { name: 'Leads (form fills)', icon: Target, defaultRate: 8, color: '#61DAFB', darkColor: '#3A8DB8' },
  { name: 'MQL (qualified)', icon: TrendingDown, defaultRate: 35, color: '#8E75B2', darkColor: '#6B5A8A' },
  { name: 'SQL (sales ready)', icon: Handshake, defaultRate: 50, color: '#EF476F', darkColor: '#C0395A' },
  { name: 'Customers', icon: Euro, defaultRate: 25, color: '#3FCF8E', darkColor: '#2A9A65' },
];

export function FunnelSimulator() {
  const [visitors, setVisitors] = useState(10000);
  const [rates, setRates] = useState(stages.map(s => s.defaultRate));
  const [avgDealValue, setAvgDealValue] = useState(500);

  const funnelData = useMemo(() => {
    const data: { name: string; count: number; rate: number; color: string }[] = [];
    let current = visitors;

    stages.forEach((stage, i) => {
      if (i === 0) {
        data.push({ name: stage.name, count: current, rate: 100, color: stage.color });
      } else {
        current = Math.round(current * (rates[i] / 100));
        data.push({ name: stage.name, count: current, rate: rates[i], color: stage.color });
      }
    });

    return data;
  }, [visitors, rates, avgDealValue]);

  const customers = funnelData[funnelData.length - 1].count;
  const revenue = customers * avgDealValue;
  const overallConversion = visitors > 0 ? ((customers / visitors) * 100).toFixed(2) : '0';

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-accent" />
          <span className="font-bold text-foreground text-sm">Marketing Funnel Simulator</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-foreground-muted">Monthly visitors</span>
              <span className="text-xs font-bold text-accent font-mono">{visitors.toLocaleString()}</span>
            </div>
            <input
              type="range" min={1000} max={100000} step={1000} value={visitors}
              onChange={(e) => setVisitors(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-foreground-muted">Avg deal value</span>
              <span className="text-xs font-bold text-accent font-mono">€{avgDealValue}</span>
            </div>
            <input
              type="range" min={50} max={5000} step={50} value={avgDealValue}
              onChange={(e) => setAvgDealValue(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm"
            />
          </div>
        </div>

        {/* Funnel visualization */}
        <div className="space-y-0">
          {funnelData.map((stage, i) => {
            const widthPercent = Math.max(15, (stage.count / visitors) * 100);
            const Icon = stages[i].icon;

            return (
              <div key={stage.name}>
                <motion.div
                  className="relative mx-auto rounded-lg overflow-hidden"
                  style={{ width: `${widthPercent}%`, minWidth: '140px' }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ type: 'spring', stiffness: 80, damping: 20, delay: i * 0.1 }}
                >
                  <div
                    className="px-3 sm:px-4 py-3 flex items-center justify-between gap-2"
                    style={{ backgroundColor: stage.color + '20' }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex-shrink-0" style={{ color: stage.color }}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium text-foreground truncate">{stage.name}</span>
                    </div>
                    <span className="text-xs font-bold text-foreground font-mono flex-shrink-0">
                      {stage.count.toLocaleString()}
                    </span>
                  </div>
                </motion.div>

                {/* Conversion rate slider between stages */}
                {i > 0 && i < stages.length - 1 && (
                  <div className="flex items-center justify-center py-1">
                    <div className="flex items-center gap-2 px-2">
                      <ArrowDown className="w-3 h-3 text-foreground-subtle" />
                      <input
                        type="range" min={1} max={80} value={rates[i + 1]}
                        onChange={(e) => {
                          const newRates = [...rates];
                          newRates[i + 1] = Number(e.target.value);
                          setRates(newRates);
                        }}
                        className="w-16 sm:w-20 h-1 rounded-full appearance-none cursor-pointer bg-border
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
                      />
                      <span className="text-[10px] font-mono text-foreground-subtle w-7">{rates[i + 1]}%</span>
                    </div>
                  </div>
                )}

                {i === 0 && (
                  <div className="flex items-center justify-center py-1">
                    <div className="flex items-center gap-2 px-2">
                      <ArrowDown className="w-3 h-3 text-foreground-subtle" />
                      <input
                        type="range" min={1} max={30} value={rates[1]}
                        onChange={(e) => {
                          const newRates = [...rates];
                          newRates[1] = Number(e.target.value);
                          setRates(newRates);
                        }}
                        className="w-16 sm:w-20 h-1 rounded-full appearance-none cursor-pointer bg-border
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
                      />
                      <span className="text-[10px] font-mono text-foreground-subtle w-7">{rates[1]}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Customers', value: customers.toLocaleString(), color: 'text-emerald-500' },
            { label: 'Revenue', value: `€${revenue.toLocaleString()}`, color: 'text-blue-500' },
            { label: 'Conversion', value: `${overallConversion}%`, color: 'text-accent' },
          ].map(({ label, value, color }) => (
            <motion.div
              key={label}
              layout
              className="text-center p-3 rounded-xl bg-background-alt"
            >
              <motion.p
                key={value}
                initial={{ scale: 1.05, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-lg sm:text-xl font-bold font-mono ${color}`}
              >
                {value}
              </motion.p>
              <p className="text-[10px] text-foreground-subtle mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
