'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Target, ChevronRight, Database, Mail, Users, TrendingDown } from 'lucide-react';

interface SQLExample {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  goal: string;
  goalDetail: string;
  platform: string;
  code: string;
  language: string;
}

const examples: SQLExample[] = [
  {
    id: 'inactive',
    icon: TrendingDown,
    goal: 'Find inactive subscribers',
    goalDetail: 'Identify all subscribers who haven\'t opened an email in the last 30 days for a win-back campaign.',
    platform: 'Salesforce Marketing Cloud',
    language: 'SQL',
    code: `SELECT
  s.SubscriberKey,
  s.EmailAddress,
  s.FirstName,
  MAX(o.EventDate) AS LastOpenDate,
  DATEDIFF(day, MAX(o.EventDate), GETDATE()) AS DaysInactive
FROM _Subscribers s
LEFT JOIN _Open o
  ON s.SubscriberKey = o.SubscriberKey
GROUP BY s.SubscriberKey, s.EmailAddress, s.FirstName
HAVING MAX(o.EventDate) < DATEADD(day, -30, GETDATE())
   OR MAX(o.EventDate) IS NULL
ORDER BY DaysInactive DESC`,
  },
  {
    id: 'segment',
    icon: Users,
    goal: 'Build a VIP segment',
    goalDetail: 'Create a segment of customers who clicked 3+ emails AND made a purchase in the last 90 days.',
    platform: 'Salesforce Marketing Cloud',
    language: 'SQL',
    code: `SELECT
  c.SubscriberKey,
  c.EmailAddress,
  COUNT(DISTINCT cl.JobID) AS EmailClicks,
  p.TotalPurchases,
  p.LastPurchaseDate
FROM _Subscribers c
INNER JOIN _Click cl
  ON c.SubscriberKey = cl.SubscriberKey
  AND cl.EventDate > DATEADD(day, -90, GETDATE())
INNER JOIN PurchaseHistory p
  ON c.SubscriberKey = p.SubscriberKey
  AND p.LastPurchaseDate > DATEADD(day, -90, GETDATE())
GROUP BY c.SubscriberKey, c.EmailAddress,
  p.TotalPurchases, p.LastPurchaseDate
HAVING COUNT(DISTINCT cl.JobID) >= 3`,
  },
  {
    id: 'personalize',
    icon: Mail,
    goal: 'Personalize email content',
    goalDetail: 'Use AMPscript to dynamically show product recommendations based on the subscriber\'s last purchase category.',
    platform: 'Marketing Cloud (AMPscript)',
    language: 'AMPscript',
    code: `%%[
VAR @subKey, @category, @prodName, @prodImg, @prodURL

SET @subKey = _subscriberkey
SET @category = Lookup("PurchaseHistory",
  "LastCategory", "SubscriberKey", @subKey)

IF @category == "electronics" THEN
  SET @prodName = "Wireless Earbuds Pro"
  SET @prodImg = "https://cdn.brand.nl/earbuds.jpg"
  SET @prodURL = "https://brand.nl/earbuds"
ELSEIF @category == "clothing" THEN
  SET @prodName = "Summer Collection 2025"
  SET @prodImg = "https://cdn.brand.nl/summer.jpg"
  SET @prodURL = "https://brand.nl/summer"
ELSE
  SET @prodName = "Bestsellers deze week"
  SET @prodImg = "https://cdn.brand.nl/best.jpg"
  SET @prodURL = "https://brand.nl/bestsellers"
ENDIF
]%%`,
  },
];

export function SQLShowcase() {
  const t = useTranslations('playground_page');
  const [activeExample, setActiveExample] = useState(0);
  const [showCode, setShowCode] = useState(false);

  const current = examples[activeExample];

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-accent" />
          <span className="font-bold text-foreground text-sm">{t('sql_title')}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">Vandebron</span>
      </div>

      <div className="p-6 lg:p-8">
        {/* Example selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {examples.map((ex, i) => {
            const Icon = ex.icon;
            return (
              <button
                key={ex.id}
                onClick={() => { setActiveExample(i); setShowCode(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeExample === i
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-background-alt text-foreground-muted hover:text-foreground border border-border'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {ex.goal}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.id}-${showCode}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {!showCode ? (
              /* Marketing Goal View */
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                  <Target className="w-3.5 h-3.5" />
                  {t('sql_goal')}
                </div>
                <h3 className="text-xl font-bold text-foreground">{current.goal}</h3>
                <p className="text-foreground-muted leading-relaxed">{current.goalDetail}</p>
                <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                  <span className="px-2 py-0.5 rounded-md bg-background-alt border border-border font-medium">{current.platform}</span>
                </div>
                <button
                  onClick={() => setShowCode(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy text-white dark:bg-accent font-semibold text-sm hover:opacity-90 transition-opacity mt-2"
                >
                  <Code2 className="w-4 h-4" />
                  {t('sql_code')}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Code View */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                    <Code2 className="w-3.5 h-3.5" />
                    {t('sql_code')} — {current.language}
                  </div>
                  <button
                    onClick={() => setShowCode(false)}
                    className="text-xs text-foreground-subtle hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Target className="w-3 h-3" />
                    {t('sql_goal')}
                  </button>
                </div>
                <div className="rounded-xl bg-[#0d1117] dark:bg-[#010409] p-5 overflow-x-auto border border-[#30363d]">
                  <pre className="text-sm font-mono leading-relaxed text-[#e6edf3] whitespace-pre">
                    {current.code.split('\n').map((line, i) => (
                      <div key={i} className="flex">
                        <span className="text-[#484f58] select-none w-8 text-right pr-4 flex-shrink-0">{i + 1}</span>
                        <span>{highlightSyntax(line, current.language)}</span>
                      </div>
                    ))}
                  </pre>
                </div>
                <p className="text-xs text-foreground-subtle italic">
                  {current.language === 'SQL' ? 'Runs on Marketing Cloud SQL Query Activity' : 'Used inside email templates for dynamic content'}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function highlightSyntax(line: string, language: string): React.ReactNode {
  if (language === 'AMPscript') {
    return <span dangerouslySetInnerHTML={{ __html:
      line
        .replace(/(%%\[|%%\]|\]%%)/g, '<span style="color:#ff7b72">$1</span>')
        .replace(/\b(VAR|SET|IF|THEN|ELSEIF|ELSE|ENDIF|Lookup)\b/g, '<span style="color:#ff7b72">$1</span>')
        .replace(/(@\w+)/g, '<span style="color:#79c0ff">$1</span>')
        .replace(/"([^"]*)"/g, '<span style="color:#a5d6ff">"$1"</span>')
        .replace(/(==)/g, '<span style="color:#ff7b72">$1</span>')
    }} />;
  }
  // SQL highlighting
  return <span dangerouslySetInnerHTML={{ __html:
    line
      .replace(/\b(SELECT|FROM|LEFT JOIN|INNER JOIN|ON|WHERE|GROUP BY|HAVING|ORDER BY|AND|OR|AS|DISTINCT|IS NULL|DESC|COUNT|MAX|DATEDIFF|DATEADD|GETDATE)\b/gi,
        (m) => `<span style="color:#ff7b72">${m.toUpperCase()}</span>`)
      .replace(/'([^']*)'/g, '<span style="color:#a5d6ff">\'$1\'</span>')
      .replace(/(-?\d+)/g, '<span style="color:#79c0ff">$1</span>')
      .replace(/(--.*$)/g, '<span style="color:#484f58">$1</span>')
  }} />;
}
