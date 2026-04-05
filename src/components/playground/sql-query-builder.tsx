'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Sparkles, Database, Clock, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';

interface Row { [key: string]: string | number; }
interface Dataset { columns: string[]; rows: Row[]; }

// Samba Energy BV — 900k energy customers
const energyCustomers: Row[] = [
  { id: 'SE-001', name: 'Jan de Vries', email: 'jan@gmail.com', city: 'Rotterdam', type: 'solar', contract: 'gas + electric', monthly_kwh: 280, status: 'active', since: '2022-03-15' },
  { id: 'SE-002', name: 'Lisa Bakker', email: 'lisa@outlook.nl', city: 'Amsterdam', type: 'non-solar', contract: 'gas + electric', monthly_kwh: 420, status: 'active', since: '2021-08-01' },
  { id: 'SE-003', name: 'Ahmed El-Amrani', email: 'ahmed@yahoo.com', city: 'Utrecht', type: 'solar', contract: 'electric only', monthly_kwh: 180, status: 'active', since: '2023-01-10' },
  { id: 'SE-004', name: 'Sophie Jansen', email: 'sophie@icloud.com', city: 'Den Haag', type: 'non-solar', contract: 'gas only', monthly_kwh: 0, status: 'churned', since: '2020-11-22' },
  { id: 'SE-005', name: 'Mohammed Yilmaz', email: 'mo@gmail.com', city: 'Rotterdam', type: 'solar', contract: 'gas + electric', monthly_kwh: 310, status: 'active', since: '2023-06-05' },
  { id: 'SE-006', name: 'Emma van Dijk', email: 'emma@hotmail.com', city: 'Eindhoven', type: 'non-solar', contract: 'electric only', monthly_kwh: 350, status: 'active', since: '2022-09-18' },
  { id: 'SE-007', name: 'Fatima Bouali', email: 'fatima@gmail.com', city: 'Amsterdam', type: 'solar', contract: 'gas + electric', monthly_kwh: 220, status: 'active', since: '2024-02-28' },
  { id: 'SE-008', name: 'Pieter Smit', email: 'pieter@ziggo.nl', city: 'Groningen', type: 'non-solar', contract: 'gas + electric', monthly_kwh: 480, status: 'active', since: '2021-04-12' },
  { id: 'SE-009', name: 'Aisha Diallo', email: 'aisha@gmail.com', city: 'Rotterdam', type: 'solar', contract: 'electric only', monthly_kwh: 150, status: 'active', since: '2024-07-01' },
  { id: 'SE-010', name: 'Koen Willems', email: 'koen@outlook.nl', city: 'Tilburg', type: 'non-solar', contract: 'gas only', monthly_kwh: 0, status: 'churned', since: '2022-01-15' },
  { id: 'SE-011', name: 'Naomi Hendriks', email: 'naomi@gmail.com', city: 'Den Haag', type: 'solar', contract: 'gas + electric', monthly_kwh: 290, status: 'active', since: '2023-11-08' },
  { id: 'SE-012', name: 'Recruiter', email: 'recruiter@bedrijf.nl', city: 'Jouw stad', type: 'solar (hopelijk)', contract: 'hire Samba', monthly_kwh: 999, status: 'reading portfolio', since: 'nu' },
];

// Cleanprofs — cleaning services
const cleanprofsData: Row[] = [
  { order_id: 'CP-001', client: 'Gemeente Rotterdam', bak_type: 'GFT', city: 'Rotterdam', frequency: 'wekelijks', duration_min: 15, price: 12.50, status: 'completed' },
  { order_id: 'CP-002', client: 'Fam. De Boer', bak_type: 'RST', city: 'Amsterdam', frequency: '2-wekelijks', duration_min: 20, price: 18.00, status: 'scheduled' },
  { order_id: 'CP-003', client: 'Woningcorp Vestia', bak_type: 'PMD', city: 'Den Haag', frequency: 'wekelijks', duration_min: 12, price: 10.00, status: 'completed' },
  { order_id: 'CP-004', client: 'Fam. Jansen', bak_type: 'GFT', city: 'Utrecht', frequency: 'maandelijks', duration_min: 25, price: 22.50, status: 'completed' },
  { order_id: 'CP-005', client: 'VvE Kralingen', bak_type: 'RST', city: 'Rotterdam', frequency: 'wekelijks', duration_min: 30, price: 28.00, status: 'in progress' },
  { order_id: 'CP-006', client: 'Fam. Van Leeuwen', bak_type: 'GFT', city: 'Breda', frequency: '2-wekelijks', duration_min: 18, price: 15.00, status: 'completed' },
  { order_id: 'CP-007', client: 'Gemeente Eindhoven', bak_type: 'PMD', city: 'Eindhoven', frequency: 'wekelijks', duration_min: 10, price: 8.50, status: 'scheduled' },
  { order_id: 'CP-008', client: 'Fam. Bakker', bak_type: 'Papier', city: 'Amsterdam', frequency: 'maandelijks', duration_min: 12, price: 10.00, status: 'completed' },
  { order_id: 'CP-009', client: 'VvE Centrum', bak_type: 'RST', city: 'Rotterdam', frequency: 'wekelijks', duration_min: 35, price: 32.00, status: 'in progress' },
  { order_id: 'CP-010', client: 'Fam. Yilmaz', bak_type: 'GFT', city: 'Den Haag', frequency: '2-wekelijks', duration_min: 20, price: 17.50, status: 'completed' },
];

// Samba skills (easter egg)
const sambaSkills: Row[] = [
  { skill: 'Email Marketing', level: 'Expert', years: '5+', coffee_needed: '2 bakjes' },
  { skill: 'SQL / AMPscript', level: 'Advanced', years: '3+', coffee_needed: '3 bakjes' },
  { skill: 'Marketing Automation', level: 'Expert', years: '4+', coffee_needed: '1 bak (gaat vanzelf)' },
  { skill: 'Next.js / React', level: 'Advanced', years: '2+', coffee_needed: '4 bakjes + pizza' },
  { skill: 'Deployteq', level: 'Expert', years: '2+', coffee_needed: '0 (pure passie)' },
  { skill: 'Stakeholder Mgmt', level: 'Pro', years: '5+', coffee_needed: '0 (pure energie)' },
];

const datasets: Record<string, { data: Row[]; total: number; dbName: string }> = {
  energy_customers: { data: energyCustomers, total: 912847, dbName: 'Samba Energy BV' },
  cleanprofs_orders: { data: cleanprofsData, total: 45230, dbName: 'Cleanprofs.nl' },
  samba_skills: { data: sambaSkills, total: 6, dbName: 'Samba Brain' },
};

function parseQuery(query: string): { dataset: string; limit: number; where: string | null; columns: string[] | null } {
  const q = query.toLowerCase().trim().replace(/;$/, '');
  let dataset = 'energy_customers';
  let limit = 999;
  let where: string | null = null;
  let columns: string[] | null = null;

  // Detect dataset
  if (q.includes('cleanprof') || q.includes('order') || q.includes('bak') || q.includes('cleaning') || q.includes('schoon')) {
    dataset = 'cleanprofs_orders';
  } else if (q.includes('samba') || q.includes('skill') || q.includes('about') || q.includes('who')) {
    dataset = 'samba_skills';
  }

  // Parse LIMIT
  const limitMatch = q.match(/limit\s+(\d+)/);
  if (limitMatch) limit = parseInt(limitMatch[1]);

  // Parse WHERE (simple)
  const whereMatch = q.match(/where\s+(\w+)\s*=\s*'([^']+)'/);
  if (whereMatch) where = `${whereMatch[1]}=${whereMatch[2]}`;

  // Parse columns (SELECT x, y FROM ...)
  const selectMatch = q.match(/select\s+(.+?)\s+from/);
  if (selectMatch && selectMatch[1].trim() !== '*') {
    columns = selectMatch[1].split(',').map(c => c.trim());
  }

  return { dataset, limit, where, columns };
}

function executeQuery(query: string): { columns: string[]; rows: Row[]; total: number; dbName: string; executionTime: string } {
  const { dataset, limit, where, columns: selectedCols } = parseQuery(query);
  const ds = datasets[dataset];
  let rows = [...ds.data];

  // Apply WHERE filter
  if (where) {
    const [field, value] = where.split('=');
    rows = rows.filter(r => {
      const cellVal = String(r[field] || '').toLowerCase();
      return cellVal.includes(value.toLowerCase());
    });
  }

  // Apply LIMIT
  rows = rows.slice(0, limit);

  // Select columns
  let cols = Object.keys(ds.data[0]);
  if (selectedCols) {
    cols = cols.filter(c => selectedCols.some(sc => c.toLowerCase().includes(sc.toLowerCase())));
    if (cols.length === 0) cols = Object.keys(ds.data[0]);
  }

  const time = (0.1 + Math.random() * 0.9).toFixed(2);
  return { columns: cols, rows, total: where ? rows.length : ds.total, dbName: ds.dbName, executionTime: `${time}s` };
}

const presetQueries = [
  { label: 'Energy klanten', query: "SELECT * FROM energy_customers LIMIT 5;" },
  { label: 'Alleen solar', query: "SELECT * FROM energy_customers WHERE type = 'solar';" },
  { label: 'Cleanprofs orders', query: "SELECT * FROM cleanprofs_orders LIMIT 5;" },
  { label: 'GFT bakken', query: "SELECT * FROM cleanprofs_orders WHERE bak_type = 'GFT';" },
  { label: 'Rotterdam only', query: "SELECT * FROM energy_customers WHERE city = 'Rotterdam';" },
  { label: 'Over Samba', query: "SELECT * FROM samba_skills;" },
];

export function SQLQueryBuilder() {
  const [query, setQuery] = useState("SELECT * FROM energy_customers LIMIT 5;");
  const [result, setResult] = useState<ReturnType<typeof executeQuery> | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const runQuery = () => {
    if (!query.trim()) return;
    setIsRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(executeQuery(query));
      setIsRunning(false);
    }, 400 + Math.random() * 400);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
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
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors"
            >
              {isRunning ? <Sparkles className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              {isRunning ? 'Running...' : 'Run query'}
            </button>
          </div>
          <textarea
            value={query}
            onChange={(e) => { setQuery(e.target.value); setResult(null); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) runQuery(); }}
            className="w-full bg-transparent text-[#e6edf3] font-mono text-sm p-4 outline-none resize-none min-h-[70px] placeholder:text-[#484f58]"
            placeholder="SELECT * FROM energy_customers WHERE type = 'solar' LIMIT 3;"
            spellCheck={false}
          />
        </div>

        {/* Database info */}
        <div className="flex items-center gap-3 text-[11px] text-foreground-subtle">
          <span className="flex items-center gap-1"><Database className="w-3 h-3" /> Samba Energy BV (912k rows)</span>
          <span>·</span>
          <span>Cleanprofs.nl (45k rows)</span>
          <span>·</span>
          <span>Samba Brain (6 rows)</span>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isRunning && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8 gap-2 text-sm text-foreground-subtle">
              <Sparkles className="w-4 h-4 text-accent animate-spin" />
              Executing query...
            </motion.div>
          )}

          {result && !isRunning && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-3">
              <div className="flex items-center gap-4 text-xs text-foreground-subtle">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" />{result.total.toLocaleString()} rows</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{result.executionTime}</span>
                <span className="flex items-center gap-1 text-accent"><Database className="w-3 h-3" />{result.dbName}</span>
              </div>

              <div className="rounded-xl border border-border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-background-alt">
                      {result.columns.map(col => (
                        <th key={col} className="text-left px-4 py-2.5 font-semibold text-foreground text-xs uppercase tracking-wider border-b border-border whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <motion.tr key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                        {result.columns.map(col => (
                          <td key={col} className="px-4 py-2.5 text-foreground-muted whitespace-nowrap font-mono text-xs">{String(row[col] ?? '')}</td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {result.rows.length === 0 && (
                <p className="text-sm text-foreground-subtle text-center py-4">Geen resultaten gevonden. Probeer een andere query!</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
