'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Database, CheckCircle2, AlertCircle, Table, RotateCcw } from 'lucide-react';

interface Row { [key: string]: string | number | null; }

// ── Generate 100 energy customers for Samba Energy BV ──
const cities = ['Rotterdam', 'Amsterdam', 'Utrecht', 'Den Haag', 'Eindhoven', 'Groningen', 'Tilburg', 'Leiden', 'Breda', 'Almere', 'Arnhem', 'Maastricht', 'Enschede', 'Haarlem', 'Nijmegen', 'Dordrecht', 'Zwolle', 'Amersfoort', 'Apeldoorn', 'Delft'];
const firstNames = ['Jan', 'Lisa', 'Ahmed', 'Sophie', 'Mohammed', 'Emma', 'Fatima', 'Pieter', 'Aisha', 'Koen', 'Naomi', 'Daan', 'Maria', 'Kevin', 'Sandra', 'Jordi', 'Eva', 'Tom', 'Noor', 'Bas', 'Lotte', 'Ruben', 'Sara', 'Thijs', 'Fleur', 'Jesse', 'Anouk', 'Lars', 'Julia', 'Sven'];
const lastNames = ['de Vries', 'Bakker', 'Jansen', 'Smit', 'Mulder', 'van Dijk', 'Hendriks', 'Peters', 'Willems', 'El-Amrani', 'Diallo', 'Yilmaz', 'Bouali', 'Hassan', 'Mol', 'Verhoeven', 'Visser', 'Bos', 'Meijer', 'de Groot'];
const types = ['solar', 'wind', 'biomass', 'hydro'];
const contracts = ['gas + electric', 'electric only', 'gas only'];
const statuses = ['active', 'active', 'active', 'active', 'active', 'active', 'at_risk', 'churned'];
const domains = ['gmail.com', 'outlook.nl', 'hotmail.com', 'icloud.com', 'ziggo.nl', 'kpnmail.nl', 'yahoo.com'];

function seed(i: number) { return ((i * 9301 + 49297) % 233280) / 233280; }

const energyCustomers: Row[] = Array.from({ length: 100 }, (_, i) => {
  const fn = firstNames[Math.floor(seed(i) * firstNames.length)];
  const ln = lastNames[Math.floor(seed(i + 100) * lastNames.length)];
  const city = cities[Math.floor(seed(i + 200) * cities.length)];
  const status = statuses[Math.floor(seed(i + 300) * statuses.length)];
  const kwh = status === 'churned' ? 0 : Math.round(100 + seed(i + 400) * 600);
  const spend = status === 'churned' ? 0 : Math.round((kwh * 0.32 + 25) * 100) / 100;
  const yr = 2020 + Math.floor(seed(i + 500) * 5);
  const mo = String(1 + Math.floor(seed(i + 600) * 12)).padStart(2, '0');
  const day = String(1 + Math.floor(seed(i + 700) * 28)).padStart(2, '0');
  const optIn = seed(i + 800) > 0.2 ? 1 : 0;
  return {
    customer_id: `SE-${String(i + 1).padStart(3, '0')}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}@${domains[Math.floor(seed(i + 900) * domains.length)]}`,
    city,
    energy_type: types[Math.floor(seed(i + 1000) * types.length)],
    contract: contracts[Math.floor(seed(i + 1100) * contracts.length)],
    monthly_kwh: kwh,
    monthly_spend: spend,
    status,
    signup_date: `${yr}-${mo}-${day}`,
    email_opt_in: optIn,
  };
});

const emailCampaigns: Row[] = [
  { campaign_id: 'EM-001', campaign_name: 'Welcome onboarding', send_date: '2025-03-01', total_sent: 124500, delivered: 122000, opened: 48800, clicked: 19520, unsubscribed: 240, bounced: 2500, revenue: 285000 },
  { campaign_id: 'EM-002', campaign_name: 'Solar panel promo', send_date: '2025-03-05', total_sent: 850000, delivered: 835000, opened: 250500, clicked: 50100, unsubscribed: 850, bounced: 15000, revenue: 1420000 },
  { campaign_id: 'EM-003', campaign_name: 'Monthly overview feb', send_date: '2025-03-10', total_sent: 900000, delivered: 891000, opened: 356400, clicked: 44550, unsubscribed: 900, bounced: 9000, revenue: 0 },
  { campaign_id: 'EM-004', campaign_name: 'Churn win-back', send_date: '2025-03-15', total_sent: 340000, delivered: 332000, opened: 83000, clicked: 24900, unsubscribed: 1700, bounced: 8000, revenue: 678000 },
  { campaign_id: 'EM-005', campaign_name: 'Referral campaign', send_date: '2025-03-20', total_sent: 920000, delivered: 905000, opened: 362000, clicked: 90500, unsubscribed: 460, bounced: 15000, revenue: 2150000 },
  { campaign_id: 'EM-006', campaign_name: 'Contract renewal', send_date: '2025-03-25', total_sent: 280000, delivered: 275000, opened: 137500, clicked: 55000, unsubscribed: 140, bounced: 5000, revenue: 890000 },
  { campaign_id: 'EM-007', campaign_name: 'Energy saving tips', send_date: '2025-04-01', total_sent: 900000, delivered: 891000, opened: 267300, clicked: 26730, unsubscribed: 450, bounced: 9000, revenue: 0 },
  { campaign_id: 'EM-008', campaign_name: 'App download push', send_date: '2025-04-03', total_sent: 900000, delivered: 889200, opened: 355680, clicked: 88920, unsubscribed: 450, bounced: 10800, revenue: 0 },
];

type DatasetKey = 'customers' | 'campaigns';
const datasets: Record<DatasetKey, { data: Row[]; total: number; dbName: string }> = {
  customers: { data: energyCustomers, total: 912847, dbName: 'SAMBA_ENERGY.MARKETING.CUSTOMERS' },
  campaigns: { data: emailCampaigns, total: 2847, dbName: 'SAMBA_ENERGY.MARKETING.EMAIL_CAMPAIGNS' },
};

// ── Mini SQL Engine ──
function executeSQL(query: string, dataset: DatasetKey): { rows: Row[]; error: string | null; hint: string | null; time: number } {
  const start = performance.now();
  const q = query.trim().replace(/;$/, '');

  if (!q) return { rows: [], error: 'Empty query. Type a SELECT statement to get started.', hint: null, time: 0 };
  if (!/^\s*SELECT/i.test(q)) return { rows: [], error: 'Only SELECT statements are supported.', hint: 'Start your query with SELECT, e.g.:\nSELECT * FROM customers LIMIT 10', time: 0 };

  const fromMatch = q.match(/FROM\s+(\w+)/i);
  if (!fromMatch) return { rows: [], error: 'Missing FROM clause.', hint: 'Add a FROM clause to specify the table:\nSELECT * FROM customers', time: 0 };

  const tableName = fromMatch[1].toLowerCase();
  const validTables = Object.keys(datasets);
  if (!validTables.includes(tableName)) {
    return { rows: [], error: `Table "${fromMatch[1]}" does not exist.`, hint: `Available tables: ${validTables.join(', ')}\nExample: SELECT * FROM customers LIMIT 10`, time: 0 };
  }

  let data = [...datasets[tableName as DatasetKey].data];
  const columns = Object.keys(data[0] || {});

  // Parse SELECT columns
  const selectPart = q.match(/SELECT\s+([\s\S]*?)\s+FROM/i)?.[1]?.trim() || '*';
  const isSelectAll = selectPart === '*';

  // Parse WHERE
  const whereMatch = q.match(/WHERE\s+([\s\S]*?)(?:\s+GROUP\s+BY|\s+ORDER\s+BY|\s+LIMIT|$)/i);
  if (whereMatch) {
    const whereClauses = whereMatch[1];
    try {
      data = data.filter(row => {
        return evaluateWhere(whereClauses, row);
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { rows: [], error: `WHERE clause error: ${msg}`, hint: 'Check your WHERE syntax. Examples:\nWHERE status = \'active\'\nWHERE monthly_kwh > 300 AND city = \'Rotterdam\'', time: 0 };
    }
  }

  // Parse GROUP BY
  const groupMatch = q.match(/GROUP\s+BY\s+([\w,\s]+?)(?:\s+ORDER|\s+LIMIT|$)/i);
  const hasAgg = /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(selectPart);

  if (groupMatch || hasAgg) {
    const groupCols = groupMatch ? groupMatch[1].split(',').map(c => c.trim().toLowerCase()) : ['__all__'];
    // Validate group columns
    for (const gc of groupCols) {
      if (gc !== '__all__' && !columns.includes(gc)) {
        return { rows: [], error: `Column "${gc}" in GROUP BY does not exist.`, hint: `Available columns: ${columns.join(', ')}`, time: 0 };
      }
    }
    const groups: Record<string, Row[]> = {};
    for (const row of data) {
      const key = groupCols[0] === '__all__' ? '__all__' : groupCols.map(c => String(row[c])).join('|');
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    }

    const aggSelects = selectPart.split(',').map(s => s.trim());
    data = Object.entries(groups).map(([, rows]) => {
      const result: Row = {};
      for (const sel of aggSelects) {
        const aggMatch = sel.match(/^(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(\*|\w+)\s*\)(?:\s+AS\s+(\w+))?$/i);
        if (aggMatch) {
          const [, func, col, alias] = aggMatch;
          const name = alias || `${func.toLowerCase()}_${col}`;
          const vals = col === '*' ? rows : rows.map(r => Number(r[col.toLowerCase()]) || 0);
          switch (func.toUpperCase()) {
            case 'COUNT': result[name] = col === '*' ? rows.length : vals.length; break;
            case 'SUM': result[name] = Math.round((vals as number[]).reduce((a, b) => a + b, 0) * 100) / 100; break;
            case 'AVG': result[name] = Math.round(((vals as number[]).reduce((a, b) => a + b, 0) / (vals as number[]).length) * 100) / 100; break;
            case 'MIN': result[name] = Math.min(...(vals as number[])); break;
            case 'MAX': result[name] = Math.max(...(vals as number[])); break;
          }
        } else {
          const colName = sel.toLowerCase();
          if (columns.includes(colName)) result[colName] = rows[0][colName];
        }
      }
      return result;
    });
  } else if (!isSelectAll) {
    // Select specific columns
    const selCols = selectPart.split(',').map(c => c.trim().toLowerCase());
    for (const sc of selCols) {
      if (!columns.includes(sc)) {
        return { rows: [], error: `Column "${sc}" does not exist in table "${tableName}".`, hint: `Available columns: ${columns.join(', ')}`, time: 0 };
      }
    }
    data = data.map(row => {
      const r: Row = {};
      selCols.forEach(c => { r[c] = row[c]; });
      return r;
    });
  }

  // Parse ORDER BY
  const orderMatch = q.match(/ORDER\s+BY\s+([\w]+)(?:\s+(ASC|DESC))?/i);
  if (orderMatch) {
    const [, orderCol, orderDir] = orderMatch;
    const col = orderCol.toLowerCase();
    const dir = (orderDir || 'ASC').toUpperCase() === 'DESC' ? -1 : 1;
    const allCols = Object.keys(data[0] || {});
    if (!allCols.includes(col)) {
      return { rows: [], error: `Cannot ORDER BY "${orderCol}" — column not in result set.`, hint: `Available columns: ${allCols.join(', ')}`, time: 0 };
    }
    data.sort((a, b) => {
      const va = a[col] ?? 0, vb = b[col] ?? 0;
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
  }

  // Parse LIMIT
  const limitMatch = q.match(/LIMIT\s+(\d+)/i);
  const limit = limitMatch ? Math.min(parseInt(limitMatch[1]), 100) : 25;
  data = data.slice(0, limit);

  const time = Math.round(performance.now() - start);
  return { rows: data, error: null, hint: null, time };
}

function evaluateWhere(clause: string, row: Row): boolean {
  // Handle AND/OR
  const orParts = clause.split(/\bOR\b/i);
  if (orParts.length > 1) return orParts.some(p => evaluateWhere(p.trim(), row));
  const andParts = clause.split(/\bAND\b/i);
  if (andParts.length > 1) return andParts.every(p => evaluateWhere(p.trim(), row));

  // Handle IN
  const inMatch = clause.match(/(\w+)\s+IN\s*\(\s*(.*?)\s*\)/i);
  if (inMatch) {
    const col = inMatch[1].toLowerCase();
    const vals = inMatch[2].split(',').map(v => v.trim().replace(/'/g, ''));
    return vals.includes(String(row[col]));
  }

  // Handle comparisons
  const cmpMatch = clause.match(/(\w+)\s*(>=|<=|!=|<>|>|<|=|LIKE)\s*'?([^']*)'?/i);
  if (!cmpMatch) throw new Error(`Cannot parse condition: "${clause}"`);
  const [, col, op, val] = cmpMatch;
  const rowVal = row[col.toLowerCase()];
  const numVal = Number(val);
  const isNum = !isNaN(numVal) && val.trim() !== '';

  switch (op.toUpperCase()) {
    case '=': return isNum ? rowVal === numVal : String(rowVal) === val;
    case '!=': case '<>': return isNum ? rowVal !== numVal : String(rowVal) !== val;
    case '>': return Number(rowVal) > numVal;
    case '<': return Number(rowVal) < numVal;
    case '>=': return Number(rowVal) >= numVal;
    case '<=': return Number(rowVal) <= numVal;
    case 'LIKE': {
      const pattern = val.replace(/%/g, '.*');
      return new RegExp(`^${pattern}$`, 'i').test(String(rowVal));
    }
    default: throw new Error(`Unknown operator: ${op}`);
  }
}

// ── Preset queries ──
const presets = [
  { label: 'All customers (first 10)', query: "SELECT * FROM customers LIMIT 10" },
  { label: 'Active customers in Rotterdam', query: "SELECT name, email, monthly_kwh, monthly_spend FROM customers WHERE status = 'active' AND city = 'Rotterdam' LIMIT 20" },
  { label: 'High-value customers (>€100/mo)', query: "SELECT name, city, monthly_spend, energy_type FROM customers WHERE monthly_spend > 100 ORDER BY monthly_spend DESC LIMIT 15" },
  { label: 'Customers by city', query: "SELECT city, COUNT(*) AS total, AVG(monthly_spend) AS avg_spend FROM customers GROUP BY city ORDER BY total DESC" },
  { label: 'Churn risk overview', query: "SELECT status, COUNT(*) AS total, SUM(monthly_spend) AS total_revenue FROM customers GROUP BY status" },
  { label: 'Campaign performance', query: "SELECT campaign_name, total_sent, opened, clicked FROM campaigns ORDER BY total_sent DESC" },
  { label: 'Solar customers opted-in', query: "SELECT name, email, city, monthly_kwh FROM customers WHERE energy_type = 'solar' AND email_opt_in = 1 ORDER BY monthly_kwh DESC LIMIT 20" },
];

export function SQLQueryBuilder() {
  const [dataset, setDataset] = useState<DatasetKey>('customers');
  const [query, setQuery] = useState(presets[0].query);
  const [result, setResult] = useState<{ rows: Row[]; error: string | null; hint: string | null; time: number } | null>(null);

  const ds = datasets[dataset];

  const run = () => {
    const res = executeSQL(query, dataset);
    setResult(res);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background-alt">
        <div className="flex items-center gap-3">
          <Database className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs font-mono text-foreground-subtle">{ds.dbName}</p>
            <p className="text-xs text-foreground-subtle">{ds.total.toLocaleString()} rows — Samba Energy BV (900k customers)</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(Object.keys(datasets) as DatasetKey[]).map(k => (
            <button key={k} onClick={() => setDataset(k)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${dataset === k ? 'bg-accent text-white' : 'bg-surface border border-border text-foreground-muted hover:text-foreground'}`}>
              <Table className="w-3 h-3 inline mr-1" />{k}
            </button>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div className="p-3 border-b border-border flex gap-2 flex-wrap">
        {presets.map((p, i) => (
          <button key={i} onClick={() => { setQuery(p.query); setResult(null); }} className="px-2.5 py-1 rounded-md text-xs font-medium bg-background-alt border border-border text-foreground-muted hover:text-foreground hover:border-accent/30 transition-all cursor-pointer">
            {p.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="p-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); run(); } }}
            rows={4}
            spellCheck={false}
            className="w-full p-4 rounded-xl bg-[#0d1117] text-[#e6edf3] font-mono text-sm leading-relaxed resize-none outline-none border border-border focus:border-accent/50 transition-colors"
            placeholder="SELECT * FROM customers WHERE ..."
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button onClick={() => { setQuery(''); setResult(null); }} className="p-2 rounded-lg bg-surface/10 hover:bg-surface/20 text-[#8b949e] transition-colors cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button onClick={run} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">
              <Play className="w-3 h-3" /> Run
            </button>
          </div>
        </div>
        <p className="text-xs text-foreground-subtle mt-2">Snowflake SQL syntax — Supports SELECT, WHERE, GROUP BY, COUNT/SUM/AVG, ORDER BY, LIMIT, IN, AND/OR</p>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-border">
            {result.error ? (
              <div className="p-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-red-400">{result.error}</p>
                    {result.hint && <pre className="text-xs text-foreground-muted mt-2 whitespace-pre-wrap font-mono">{result.hint}</pre>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-foreground-subtle">{result.rows.length} rows returned in {result.time}ms</span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-background-alt">
                        {result.rows.length > 0 && Object.keys(result.rows[0]).map(col => (
                          <th key={col} className="px-3 py-2 text-left font-semibold text-foreground-subtle uppercase tracking-wider border-b border-border whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-surface/50">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="px-3 py-2 text-foreground-muted whitespace-nowrap font-mono">
                              {typeof val === 'number' ? val.toLocaleString() : String(val ?? 'NULL')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
