import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/* eslint-disable @typescript-eslint/no-explicit-any */

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function calculateScore(lead: any, outreachLogs: any[], abmVisits: any[]): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Stage progression points
  const stagePoints: Record<string, number> = { prospect: 0, contacted: 10, opened: 25, clicked: 40, visited: 55, replied: 75, meeting: 90, won: 100, lost: 0 };
  score += stagePoints[lead.pipeline_stage] || 0;
  if (lead.pipeline_stage !== 'prospect' && lead.pipeline_stage !== 'lost') reasons.push(`${lead.pipeline_stage} stage (+${stagePoints[lead.pipeline_stage]})`);

  // Email engagement
  const logs = outreachLogs.filter(l => l.contact_id === lead.id);
  if (logs.some(l => l.opened_at)) { score += 10; reasons.push('opened email (+10)'); }
  if (logs.some(l => l.clicked_at)) { score += 15; reasons.push('clicked email CTA (+15)'); }
  if (logs.filter(l => l.opened_at).length > 1) { score += 5; reasons.push('opened multiple emails (+5)'); }

  // Site visits
  const visits = abmVisits.filter(v => v.company?.toLowerCase() === lead.companies?.domain?.toLowerCase());
  if (visits.length > 0) { score += 10; reasons.push(`${visits.length} site visit${visits.length > 1 ? 's' : ''} (+10)`); }
  if (visits.length >= 3) { score += 10; reasons.push('3+ visits — high interest (+10)'); }

  // Recency bonus
  const daysSinceUpdate = (Date.now() - new Date(lead.pipeline_updated_at).getTime()) / 86400000;
  if (daysSinceUpdate < 1) { score += 10; reasons.push('active today (+10)'); }
  else if (daysSinceUpdate < 3) { score += 5; reasons.push('active recently (+5)'); }
  else if (daysSinceUpdate > 7) { score -= 10; reasons.push('inactive 7+ days (-10)'); }

  // Has LinkedIn
  if (lead.linkedin_url) { score += 3; reasons.push('LinkedIn available (+3)'); }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

async function getAiDecision(lead: any, score: number, reasons: string[]): Promise<{ action: string; reasoning: string; send_window: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { action: 'Review manually', reasoning: 'AI unavailable', send_window: '' };

  try {
    const company = lead.companies?.name || lead.companies?.domain || 'Unknown';
    const prompt = `You are an ABM advisor for a Dutch marketer. Given this lead, suggest: 1) ONE best next action (max 8 words), 2) one-sentence reasoning, 3) best day+time to send follow-up (NL timezone).

Lead: ${lead.first_name} ${lead.last_name} at ${company}
Stage: ${lead.pipeline_stage}, Score: ${score}/100
Signals: ${reasons.join(', ')}
Days inactive: ${Math.floor((Date.now() - new Date(lead.pipeline_updated_at).getTime()) / 86400000)}
LinkedIn: ${lead.linkedin_url ? 'yes' : 'no'}

Respond ONLY in JSON, no backticks:
{"action":"...","reasoning":"...","send_window":"e.g. Tuesday 9:30 AM"}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 200, messages: [{ role: 'user', content: prompt }] }),
    });

    if (!res.ok) return { action: 'Review manually', reasoning: 'AI request failed', send_window: '' };
    const data = await res.json();
    const text = (data.content?.[0]?.text || '').trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { action: 'Review manually', reasoning: text.slice(0, 80), send_window: '' };
    const parsed = JSON.parse(jsonMatch[0]);
    return { action: parsed.action || 'Review', reasoning: parsed.reasoning || '', send_window: parsed.send_window || '' };
  } catch {
    return { action: 'Review manually', reasoning: 'AI parse error', send_window: '' };
  }
}

export async function POST() {
  // Fetch all leads with company data
  const { data: leads } = await supabase
    .from('contacts')
    .select('*, companies(domain, name)')
    .not('pipeline_stage', 'eq', 'lost');

  if (!leads?.length) return NextResponse.json({ scored: 0 });

  // Fetch outreach logs and ABM visits for scoring
  const [{ data: outreachLogs }, { data: abmVisits }] = await Promise.all([
    supabase.from('outreach_logs').select('contact_id, opened_at, clicked_at, status'),
    supabase.from('abm_visits').select('company, visited_at'),
  ]);

  const results: any[] = [];

  for (const lead of leads) {
    const { score, reasons } = calculateScore(lead, outreachLogs || [], abmVisits || []);
    const { action, reasoning, send_window } = await getAiDecision(lead, score, reasons);

    await supabase.from('contacts').update({
      engagement_score: score,
      ai_next_action: action,
      ai_reasoning: reasoning,
      ai_send_window: send_window,
      score_updated_at: new Date().toISOString(),
    }).eq('id', lead.id);

    results.push({ id: lead.id, name: `${lead.first_name} ${lead.last_name}`, score, action, reasoning });
  }

  // Update company-level scores
  const { data: companies } = await supabase.from('companies').select('id, domain');
  for (const co of companies || []) {
    const companyLeads = leads.filter(l => l.company_id === co.id);
    const totalScore = companyLeads.reduce((s, l) => {
      const { score } = calculateScore(l, outreachLogs || [], abmVisits || []);
      return s + score;
    }, 0);
    const activeCount = companyLeads.filter(l => {
      const days = (Date.now() - new Date(l.pipeline_updated_at).getTime()) / 86400000;
      return days < 7;
    }).length;
    const lastActivity = companyLeads.sort((a, b) => new Date(b.pipeline_updated_at).getTime() - new Date(a.pipeline_updated_at).getTime())[0];

    await supabase.from('companies').update({
      engagement_score: Math.round(totalScore / Math.max(companyLeads.length, 1)),
      active_contacts: activeCount,
      last_activity_at: lastActivity?.pipeline_updated_at || null,
    }).eq('id', co.id);
  }

  return NextResponse.json({ scored: results.length, results });
}
