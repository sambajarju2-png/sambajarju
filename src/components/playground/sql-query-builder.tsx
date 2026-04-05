'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Sparkles, Database, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface QueryResult {
  columns: string[];
  rows: string[][];
  rowCount: number;
  executionTime: string;
  message?: string;
}

const funnyResults: Record<string, QueryResult> = {
  default: {
    columns: ['subscriber_key', 'email', 'name', 'status', 'last_open'],
    rows: [
      ['SK-001', 'jan@gmail.com', 'Jan de Bakker', 'Active', '2 uur geleden'],
      ['SK-002', 'lisa@outlook.nl', 'Lisa Vermeer', 'Hot Lead', '12 min geleden'],
      ['SK-003', 'ahmed@yahoo.com', 'Ahmed El-Mansouri', 'Nurture', '3 dagen geleden'],
      ['SK-004', 'sophie@icloud.com', 'Sophie van Dijk', 'Converted', 'Gisteren'],
      ['SK-005', 'recruiter@bedrijf.nl', 'Jij?', 'Reading this portfolio', 'Nu'],
    ],
    rowCount: 524891,
    executionTime: '0.42s',
  },
  samba: {
    columns: ['skill', 'level', 'years', 'coffee_required'],
    rows: [
      ['Email Marketing', 'Expert', '5+', '2 bakjes'],
      ['SQL / AMPscript', 'Advanced', '3+', '3 bakjes'],
      ['Marketing Automation', 'Expert', '4+', '1 bak (het gaat vanzelf)'],
      ['Next.js / React', 'Advanced', '2+', '4 bakjes + pizza'],
      ['Stakeholder Management', 'Pro', '5+', '0 (pure energie)'],
    ],
    rowCount: 5,
    executionTime: '0.01s',
    message: 'Fun fact: Samba draait op koffie en ambities',
  },
  salary: {
    columns: ['metric', 'value', 'note'],
    rows: [
      ['Salaris range', '€3.800 – €4.500', 'Bruto per maand'],
      ['Koffie budget', '∞', 'Non-negotiable'],
      ['Vrijdagmiddag borrels', 'Verplicht', 'Met kaas'],
      ['Remote dagen', '2-3 per week', 'Focus mode'],
      ['Humor op de werkvloer', '100%', 'Anders ga ik weg'],
    ],
    rowCount: 5,
    executionTime: '0.00s',
    message: 'Salary expectation query executed successfully',
  },
  emails: {
    columns: ['campaign', 'sent', 'opened', 'clicked', 'converted'],
    rows: [
      ['Welcome Flow', '125.430', '90.310 (72%)', '22.577 (18%)', '4.515 (3.6%)'],
      ['Product Highlight', '98.200', '44.190 (45%)', '11.784 (12%)', '2.946 (3.0%)'],
      ['Win-back Serie', '45.000', '12.600 (28%)', '2.700 (6%)', '810 (1.8%)'],
      ['Birthday Email', '12.300', '10.455 (85%)', '6.150 (50%)', '3.690 (30%)'],
      ['Totaal deze maand', '524.890', '187.234 (36%)', '41.991 (8%)', '12.481 (2.4%)'],
    ],
    rowCount: 524890,
    executionTime: '1.23s',
  },
};

function matchQuery(query: string): QueryResult {
  const q = query.toLowerCase();
  if (q.includes('samba') || q.includes('skills') || q.includes('who')) return funnyResults.samba;
  if (q.includes('salary') || q.includes('salaris') || q.includes('geld') || q.includes('verdien')) return funnyResults.salary;
  if (q.includes('email') || q.includes('campaign') || q.includes('sent') || q.includes('open')) return funnyResults.emails;
  return funnyResults.default;
}

const presetQueries = [
  { label: 'Subscribers', query: 'SELECT * FROM subscribers LIMIT 5;' },
  { label: 'About Samba', query: "SELECT * FROM samba_skills WHERE coffee_required > 0;" },
  { label: 'Salary', query: "SELECT * FROM salary_expectations WHERE humor = 'mandatory';" },
  { label: 'Campaigns', query: 'SELECT campaign, sent, opened, clicked FROM email_campaigns;' },
];

export function SQLQueryBuilder() {
  const [query, setQuery] = useState('SELECT * FROM subscribers LIMIT 5;');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runQuery = () => {
    setIsRunning(true);
    setResult(null);
    // Simulate query execution delay
    setTimeout(() => {
      setResult(matchQuery(query));
      setIsRunning(false);
    }, 600 + Math.random() * 400);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent" />
          <span className="font-bold text-foreground text-sm">SQL Query Builder</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-medium">Connected</span>
        </div>
        <Database className="w-4 h-4 text-foreground-subtle" />
      </div>

      <div className="p-5 space-y-4">
        {/* Preset buttons */}
        <div className="flex flex-wrap gap-2">
          {presetQueries.map(({ label, query: q }) => (
            <button
              key={label}
              onClick={() => { setQuery(q); setResult(null); }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${
                query === q
                  ? 'bg-accent/10 border-accent/30 text-accent'
                  : 'bg-background-alt border-border text-foreground-muted hover:text-foreground hover:border-border-hover'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Query editor */}
        <div className="rounded-xl bg-[#0d1117] dark:bg-[#010409] border border-[#30363d] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d]">
            <span className="text-[11px] text-[#8b949e] font-mono">query.sql</span>
            <button
              onClick={runQuery}
              disabled={isRunning || !query.trim()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Clock className="w-3 h-3" />
                </motion.div>
              ) : (
                <Play className="w-3 h-3" />
              )}
              {isRunning ? 'Running...' : 'Run query'}
            </button>
          </div>
          <textarea
            value={query}
            onChange={(e) => { setQuery(e.target.value); setResult(null); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) runQuery(); }}
            className="w-full bg-transparent text-[#e6edf3] font-mono text-sm p-4 outline-none resize-none min-h-[80px] placeholder:text-[#484f58]"
            placeholder="Write your SQL query... (Ctrl+Enter to run)"
            spellCheck={false}
          />
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isRunning && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8 gap-2 text-sm text-foreground-subtle"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Sparkles className="w-4 h-4 text-accent" />
              </motion.div>
              Executing query...
            </motion.div>
          )}

          {result && !isRunning && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* Stats bar */}
              <div className="flex items-center gap-4 text-xs text-foreground-subtle">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {result.rowCount.toLocaleString()} rows
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {result.executionTime}
                </span>
                {result.message && (
                  <span className="flex items-center gap-1 text-accent">
                    <AlertCircle className="w-3 h-3" />
                    {result.message}
                  </span>
                )}
              </div>

              {/* Table */}
              <div className="rounded-xl border border-border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-background-alt">
                      {result.columns.map((col) => (
                        <th key={col} className="text-left px-4 py-2.5 font-semibold text-foreground text-xs uppercase tracking-wider border-b border-border whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors"
                      >
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2.5 text-foreground-muted whitespace-nowrap font-mono text-xs">
                            {cell}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

