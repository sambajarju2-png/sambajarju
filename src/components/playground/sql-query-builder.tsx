'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Sparkles, Database, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Row { [key: string]: string | number | null; }

// ── Vandebron-style energy customer data ──
const energyCustomers: Row[] = [
  { customer_id: 'VDB-001', name: 'Jan de Vries', email: 'jan@gmail.com', city: 'Rotterdam', energy_type: 'solar', contract: 'gas + electric', monthly_kwh: 280, monthly_spend: 89.50, status: 'active', signup_date: '2022-03-15', last_email_open: '2025-03-28', email_opt_in: 1 },
  { customer_id: 'VDB-002', name: 'Lisa Bakker', email: 'lisa@outlook.nl', city: 'Amsterdam', energy_type: 'wind', contract: 'gas + electric', monthly_kwh: 420, monthly_spend: 134.40, status: 'active', signup_date: '2021-08-01', last_email_open: '2025-04-01', email_opt_in: 1 },
  { customer_id: 'VDB-003', name: 'Ahmed El-Amrani', email: 'ahmed@yahoo.com', city: 'Utrecht', energy_type: 'solar', contract: 'electric only', monthly_kwh: 180, monthly_spend: 57.60, status: 'active', signup_date: '2023-01-10', last_email_open: '2025-03-15', email_opt_in: 0 },
  { customer_id: 'VDB-004', name: 'Sophie Jansen', email: 'sophie@icloud.com', city: 'Den Haag', energy_type: 'wind', contract: 'gas only', monthly_kwh: 0, monthly_spend: 65.00, status: 'churned', signup_date: '2020-11-22', last_email_open: '2024-08-12', email_opt_in: 1 },
  { customer_id: 'VDB-005', name: 'Mohammed Yilmaz', email: 'mo@gmail.com', city: 'Rotterdam', energy_type: 'solar', contract: 'gas + electric', monthly_kwh: 310, monthly_spend: 99.20, status: 'active', signup_date: '2023-06-05', last_email_open: '2025-04-02', email_opt_in: 1 },
  { customer_id: 'VDB-006', name: 'Emma van Dijk', email: 'emma@hotmail.com', city: 'Eindhoven', energy_type: 'biomass', contract: 'electric only', monthly_kwh: 350, monthly_spend: 112.00, status: 'active', signup_date: '2022-09-18', last_email_open: '2025-03-20', email_opt_in: 1 },
  { customer_id: 'VDB-007', name: 'Fatima Bouali', email: 'fatima@gmail.com', city: 'Amsterdam', energy_type: 'solar', contract: 'gas + electric', monthly_kwh: 220, monthly_spend: 70.40, status: 'active', signup_date: '2024-02-28', last_email_open: '2025-04-03', email_opt_in: 1 },
  { customer_id: 'VDB-008', name: 'Pieter Smit', email: 'pieter@ziggo.nl', city: 'Groningen', energy_type: 'wind', contract: 'gas + electric', monthly_kwh: 480, monthly_spend: 153.60, status: 'at_risk', signup_date: '2021-04-12', last_email_open: '2024-12-01', email_opt_in: 0 },
  { customer_id: 'VDB-009', name: 'Aisha Diallo', email: 'aisha@gmail.com', city: 'Rotterdam', energy_type: 'solar', contract: 'electric only', monthly_kwh: 150, monthly_spend: 48.00, status: 'active', signup_date: '2024-07-01', last_email_open: '2025-04-04', email_opt_in: 1 },
  { customer_id: 'VDB-010', name: 'Koen Willems', email: 'koen@outlook.nl', city: 'Tilburg', energy_type: 'wind', contract: 'gas only', monthly_kwh: 0, monthly_spend: 72.00, status: 'churned', signup_date: '2022-01-15', last_email_open: '2024-06-30', email_opt_in: 0 },
  { customer_id: 'VDB-011', name: 'Naomi Hendriks', email: 'naomi@gmail.com', city: 'Den Haag', energy_type: 'solar', contract: 'gas + electric', monthly_kwh: 290, monthly_spend: 92.80, status: 'active', signup_date: '2023-11-08', last_email_open: '2025-03-30', email_opt_in: 1 },
  { customer_id: 'VDB-012', name: 'Daan Mulder', email: 'daan@gmail.com', city: 'Leiden', energy_type: 'biomass', contract: 'gas + electric', monthly_kwh: 390, monthly_spend: 124.80, status: 'at_risk', signup_date: '2021-12-03', last_email_open: '2025-01-15', email_opt_in: 1 },
];

// ── Email campaign performance data ──
const emailCampaigns: Row[] = [
  { campaign_id: 'EM-001', campaign_name: 'Welkom onboarding', send_date: '2025-03-01', total_sent: 12450, delivered: 12200, opened: 4880, clicked: 1952, unsubscribed: 24, bounced: 250, revenue: 28500.00 },
  { campaign_id: 'EM-002', campaign_name: 'Zonnepanelen promo', send_date: '2025-03-05', total_sent: 85000, delivered: 83500, opened: 25050, clicked: 5010, unsubscribed: 85, bounced: 1500, revenue: 142000.00 },
  { campaign_id: 'EM-003', campaign_name: 'Maandoverzicht feb', send_date: '2025-03-10', total_sent: 450000, delivered: 445500, opened: 178200, clicked: 22275, unsubscribed: 450, bounced: 4500, revenue: 0 },
  { campaign_id: 'EM-004', campaign_name: 'Churn win-back', send_date: '2025-03-15', total_sent: 34000, delivered: 33200, opened: 8300, clicked: 2490, unsubscribed: 170, bounced: 800, revenue: 67800.00 },
  { campaign_id: 'EM-005', campaign_name: 'Referral actie', send_date: '2025-03-20', total_sent: 92000, delivered: 90500, opened: 36200, clicked: 9050, unsubscribed: 46, bounced: 1500, revenue: 215000.00 },
  { campaign_id: 'EM-006', campaign_name: 'Contract verlenging', send_date: '2025-03-25', total_sent: 28000, delivered: 27500, opened: 13750, clicked: 5500, unsubscribed: 14, bounced: 500, revenue: 89000.00 },
  { campaign_id: 'EM-007', campaign_name: 'Energiebespaartips', send_date: '2025-04-01', total_sent: 500000, delivered: 495000, opened: 148500, clicked: 14850, unsubscribed: 250, bounced: 5000, revenue: 0 },
  { campaign_id: 'EM-008', campaign_name: 'App download push', send_date: '2025-04-03', total_sent: 120000, delivered: 118200, opened: 47280, clicked: 11820, unsubscribed: 60, bounced: 1800, revenue: 0 },
];

const datasets: Record<string, { data: Row[]; total: number; dbName: string }> = {
  energy_customers: { data: energyCustomers, total: 912847, dbName: 'VANDEBRON_DWH.MARKETING.CUSTOMERS' },
  email_campaigns: { data: emailCampaigns, total: 2847, dbName: 'VANDEBRON_DWH.MARKETING.EMAIL_CAMPAIGNS' },
};

// ── Snowflake SQL parser ──
function tokenize(query: string): string {
  return query.replace(/\s+/g, ' ').trim().replace(/;$/, '');
}

function detectDataset(q: string): string {
  if (q.includes('email_campaign') || q.includes('campaign')) return 'email_campaigns';
  return 'energy_customers';
}

function evaluateCondition(row: Row, field: string, op: string, value: string): boolean {
  const cell = row[field];
  if (cell === undefined || cell === null) return false;

  // Numeric comparison
  const numCell = typeof cell === 'number' ? cell : parseFloat(String(cell));
  const numVal = parseFloat(value);
  const isNumeric = !isNaN(numCell) && !isNaN(numVal);

  switch (op) {
    case '=': return isNumeric ? numCell === numVal : String(cell).toLowerCase() === value.toLowerCase();
    case '!=': case '<>': return isNumeric ? numCell !== numVal : String(cell).toLowerCase() !== value.toLowerCase();
    case '>': return isNumeric ? numCell > numVal : false;
    case '<': return isNumeric ? numCell < numVal : false;
    case '>=': return isNumeric ? numCell >= numVal : false;
    case '<=': return isNumeric ? numCell <= numVal : false;
    case 'LIKE': {
      const pattern = value.replace(/%/g, '.*').replace(/_/g, '.');
      return new RegExp(`^${pattern}$`, 'i').test(String(cell));
    }
    case 'ILIKE': {
      const pattern = value.replace(/%/g, '.*').replace(/_/g, '.');
      return new RegExp(`^${pattern}$`, 'i').test(String(cell));
    }
    default: return false;
  }
}

function parseWhere(whereClause: string, rows: Row[]): Row[] {
  // Handle IN (...)
  const inMatch = whereClause.match(/(\w+)\s+IN\s*\(([^)]+)\)/i);
  if (inMatch) {
    const field = inMatch[1];
    const values = inMatch[2].split(',').map(v => v.trim().replace(/'/g, '').toLowerCase());
    return rows.filter(r => values.includes(String(r[field] ?? '').toLowerCase()));
  }

  // Handle AND conditions
  if (whereClause.toUpperCase().includes(' AND ')) {
    const parts = whereClause.split(/\s+AND\s+/i);
    let result = rows;
    for (const part of parts) {
      result = parseWhere(part.trim(), result);
    }
    return result;
  }

  // Handle OR conditions
  if (whereClause.toUpperCase().includes(' OR ')) {
    const parts = whereClause.split(/\s+OR\s+/i);
    const sets = parts.map(p => parseWhere(p.trim(), rows));
    const ids = new Set<number>();
    const combined: Row[] = [];
    for (const set of sets) {
      for (const row of set) {
        const idx = rows.indexOf(row);
        if (!ids.has(idx)) { ids.add(idx); combined.push(row); }
      }
    }
    return combined;
  }

  // Single condition: field OP value
  const condMatch = whereClause.match(/(\w+)\s*(>=|<=|!=|<>|>|<|=|ILIKE|LIKE)\s*'?([^']*?)'?\s*$/i);
  if (condMatch) {
    const [, field, op, value] = condMatch;
    return rows.filter(r => evaluateCondition(r, field, op.toUpperCase(), value));
  }

  return rows;
}

type AggResult = { columns: string[]; rows: Row[] };

function executeQuery(query: string): { columns: string[]; rows: Row[]; total: number; dbName: string; executionTime: string; error?: string } {
  const q = tokenize(query);
  const qUp = q.toUpperCase();

  if (!qUp.startsWith('SELECT')) {
    return { columns: [], rows: [], total: 0, dbName: '', executionTime: '0s', error: 'Only SELECT queries are supported in this demo.' };
  }

  const dataset = detectDataset(q.toLowerCase());
  const ds = datasets[dataset];
  let rows = [...ds.data];
  const allCols = Object.keys(ds.data[0]);

  // Extract WHERE clause
  const whereMatch = q.match(/WHERE\s+(.+?)(?:\s+GROUP\s+BY|\s+ORDER\s+BY|\s+LIMIT|\s*$)/i);
  if (whereMatch) {
    rows = parseWhere(whereMatch[1], rows);
  }

  // Check for aggregate functions
  const selectMatch = q.match(/SELECT\s+(.+?)\s+FROM/i);
  const selectClause = selectMatch ? selectMatch[1].trim() : '*';
  const hasAgg = /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(selectClause);

  // GROUP BY
  const groupByMatch = q.match(/GROUP\s+BY\s+([\w,\s]+?)(?:\s+ORDER|\s+LIMIT|\s*$)/i);

  if (hasAgg && groupByMatch) {
    const groupCol = groupByMatch[1].trim();
    const groups = new Map<string, Row[]>();
    for (const row of rows) {
      const key = String(row[groupCol] ?? 'NULL');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
    }

    const aggRows: Row[] = [];
    for (const [key, groupRows] of groups) {
      const newRow: Row = { [groupCol]: key };
      // Parse each select expression
      const exprs = selectClause.split(',').map(e => e.trim());
      for (const expr of exprs) {
        if (expr.toLowerCase() === groupCol.toLowerCase()) continue;
        const aggMatch = expr.match(/(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(\*|\w+)\s*\)/i);
        if (aggMatch) {
          const [, fn, col] = aggMatch;
          const alias = expr.match(/\s+AS\s+(\w+)/i)?.[1] || `${fn.toLowerCase()}_${col}`;
          switch (fn.toUpperCase()) {
            case 'COUNT': newRow[alias] = groupRows.length; break;
            case 'SUM': newRow[alias] = Math.round(groupRows.reduce((s, r) => s + (Number(r[col]) || 0), 0) * 100) / 100; break;
            case 'AVG': newRow[alias] = Math.round(groupRows.reduce((s, r) => s + (Number(r[col]) || 0), 0) / groupRows.length * 100) / 100; break;
            case 'MIN': newRow[alias] = Math.min(...groupRows.map(r => Number(r[col]) || 0)); break;
            case 'MAX': newRow[alias] = Math.max(...groupRows.map(r => Number(r[col]) || 0)); break;
          }
        }
      }
      aggRows.push(newRow);
    }
    rows = aggRows;
  } else if (hasAgg && !groupByMatch) {
    // Aggregate without GROUP BY — single row result
    const newRow: Row = {};
    const exprs = selectClause.split(',').map(e => e.trim());
    for (const expr of exprs) {
      const aggMatch = expr.match(/(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(\*|\w+)\s*\)/i);
      if (aggMatch) {
        const [, fn, col] = aggMatch;
        const alias = expr.match(/\s+AS\s+(\w+)/i)?.[1] || `${fn.toLowerCase()}_${col}`;
        switch (fn.toUpperCase()) {
          case 'COUNT': newRow[alias] = rows.length; break;
          case 'SUM': newRow[alias] = Math.round(rows.reduce((s, r) => s + (Number(r[col]) || 0), 0) * 100) / 100; break;
          case 'AVG': newRow[alias] = Math.round(rows.reduce((s, r) => s + (Number(r[col]) || 0), 0) / rows.length * 100) / 100; break;
          case 'MIN': newRow[alias] = Math.min(...rows.map(r => Number(r[col]) || 0)); break;
          case 'MAX': newRow[alias] = Math.max(...rows.map(r => Number(r[col]) || 0)); break;
        }
      }
    }
    rows = [newRow];
  }

  // ORDER BY
  const orderMatch = q.match(/ORDER\s+BY\s+(\w+)\s*(ASC|DESC)?/i);
  if (orderMatch) {
    const [, col, dir] = orderMatch;
    const desc = dir?.toUpperCase() === 'DESC';
    rows.sort((a, b) => {
      const va = a[col] ?? '';
      const vb = b[col] ?? '';
      const na = Number(va), nb = Number(vb);
      if (!isNaN(na) && !isNaN(nb)) return desc ? nb - na : na - nb;
      return desc ? String(vb).localeCompare(String(va)) : String(va).localeCompare(String(vb));
    });
  }

  // LIMIT
  const limitMatch = q.match(/LIMIT\s+(\d+)/i);
  if (limitMatch) rows = rows.slice(0, parseInt(limitMatch[1]));

  // Column selection (non-aggregate)
  let outputCols = allCols;
  if (!hasAgg && selectClause !== '*') {
    const requestedCols = selectClause.split(',').map(c => c.trim().toLowerCase());
    outputCols = allCols.filter(c => requestedCols.includes(c.toLowerCase()));
    if (outputCols.length === 0) outputCols = allCols;
  } else if (hasAgg) {
    outputCols = Object.keys(rows[0] || {});
  }

  const time = (0.08 + Math.random() * 0.4).toFixed(2);
  return { columns: outputCols, rows, total: rows.length, dbName: ds.dbName, executionTime: `${time}s` };
}

// ── Real-life marketing challenges ──
const presetQueries = [
  { label: '🔍 Solar klanten', query: "SELECT name, email, city, monthly_kwh\nFROM energy_customers\nWHERE energy_type = 'solar';" },
  { label: '⚡ Top verbruikers', query: "SELECT name, energy_type, monthly_kwh, monthly_spend\nFROM energy_customers\nWHERE monthly_kwh > 300\nORDER BY monthly_kwh DESC;" },
  { label: '🚨 Churn risico', query: "SELECT name, email, status, last_email_open\nFROM energy_customers\nWHERE status IN ('churned', 'at_risk');" },
  { label: '📊 Verbruik per type', query: "SELECT energy_type, COUNT(*) AS klanten, AVG(monthly_kwh) AS gem_kwh, SUM(monthly_spend) AS totaal_omzet\nFROM energy_customers\nGROUP BY energy_type;" },
  { label: '📧 Campagne stats', query: "SELECT campaign_name, total_sent, opened, clicked,\n  ROUND(opened * 100.0 / delivered) AS open_rate\nFROM email_campaigns\nORDER BY opened DESC;" },
  { label: '💰 Omzet campagnes', query: "SELECT campaign_name, revenue, clicked\nFROM email_campaigns\nWHERE revenue > 0\nORDER BY revenue DESC;" },
  { label: '🏙 Rotterdam segment', query: "SELECT name, email, energy_type, email_opt_in\nFROM energy_customers\nWHERE city = 'Rotterdam' AND email_opt_in = 1;" },
  { label: '📬 Email opt-outs', query: "SELECT name, city, status\nFROM energy_customers\nWHERE email_opt_in = 0;" },
];

export function SQLQueryBuilder() {
  const [query, setQuery] = useState(presetQueries[0].query);
  const [result, setResult] = useState<ReturnType<typeof executeQuery> | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runQuery = () => {
    if (!query.trim()) return;
    setIsRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(executeQuery(query));
      setIsRunning(false);
    }, 300 + Math.random() * 300);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent" />
          <span className="font-bold text-foreground text-sm">Snowflake SQL Console</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-medium">CONNECTED</span>
        </div>
        <span className="text-[10px] text-foreground-subtle font-mono">VANDEBRON_DWH</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Preset challenge buttons */}
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
        <div className="rounded-xl bg-[#0d1117] border border-[#30363d] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d]">
            <span className="text-[11px] text-[#8b949e] font-mono">worksheet.sql — Snowflake</span>
            <button
              onClick={runQuery}
              disabled={isRunning || !query.trim()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors"
            >
              {isRunning ? <Sparkles className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              {isRunning ? 'Running...' : '▶ Run (⌘↵)'}
            </button>
          </div>
          <textarea
            value={query}
            onChange={(e) => { setQuery(e.target.value); setResult(null); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) runQuery(); }}
            className="w-full bg-transparent text-[#e6edf3] font-mono text-sm p-4 outline-none resize-none min-h-[100px] placeholder:text-[#484f58]"
            placeholder="SELECT * FROM energy_customers WHERE energy_type = 'solar' LIMIT 5;"
            spellCheck={false}
          />
        </div>

        {/* Database info */}
        <div className="flex items-center gap-3 text-[10px] text-foreground-subtle font-mono">
          <span className="flex items-center gap-1"><Database className="w-3 h-3" /> MARKETING.CUSTOMERS (912k)</span>
          <span>·</span>
          <span>MARKETING.EMAIL_CAMPAIGNS (2.8k)</span>
          <span className="ml-auto text-foreground-subtle/50">Snowflake • Warehouse: MARKETING_WH</span>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isRunning && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8 gap-2 text-sm text-foreground-subtle">
              <Sparkles className="w-4 h-4 text-accent animate-spin" />
              Executing on MARKETING_WH...
            </motion.div>
          )}

          {result && !isRunning && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-3">
              {result.error ? (
                <div className="flex items-center gap-2 text-sm text-red-500 py-4">
                  <AlertCircle className="w-4 h-4" />
                  {result.error}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 text-xs text-foreground-subtle">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" />{result.total} rows returned</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{result.executionTime}</span>
                    <span className="font-mono text-[10px] text-foreground-subtle/60">{result.dbName}</span>
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
                          <motion.tr key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                            className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                            {result.columns.map(col => (
                              <td key={col} className="px-4 py-2.5 text-foreground-muted whitespace-nowrap font-mono text-xs">
                                {row[col] === null ? <span className="text-foreground-subtle/40 italic">NULL</span> : String(row[col])}
                              </td>
                            ))}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {result.rows.length === 0 && (
                    <p className="text-sm text-foreground-subtle text-center py-4">No results. Try adjusting your WHERE clause.</p>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
