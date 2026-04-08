import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createAdminClient();

  const [companies, contacts, outreach, pageViews, threads, pipelineLeads, scheduledActions, unreadContacts] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('outreach_logs').select('*, contacts(first_name, last_name), companies(domain, name)').order('sent_at', { ascending: false }).limit(20),
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('email_threads').select('*').eq('direction', 'inbound').order('received_at', { ascending: false }).limit(20),
    supabase.from('contacts').select('id, first_name, last_name, email, pipeline_stage, pipeline_updated_at, companies(domain, name)').order('pipeline_updated_at', { ascending: false }),
    supabase.from('scheduled_actions').select('*').eq('status', 'pending').lte('scheduled_for', new Date().toISOString()),
    supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('read', false),
  ]);

  const logs = outreach.data || [];
  const allLogs = await supabase.from('outreach_logs').select('opened_at, clicked_at, status');
  const allL = allLogs.data || [];
  const sent = allL.length;
  const opened = allL.filter(l => l.opened_at).length;
  const clicked = allL.filter(l => l.clicked_at).length;
  const replied = allL.filter(l => l.status === 'replied').length;

  // Build focus items
  const now = Date.now();
  const leads = pipelineLeads.data || [];
  const focus: { type: string; priority: number; label: string; detail: string; leadId?: string }[] = [];

  // Stale leads (contacted/opened but no update in 3+ days)
  leads.forEach((l: any) => {
    const daysSince = (now - new Date(l.pipeline_updated_at).getTime()) / 86400000;
    const company = (l.companies as any)?.name || (l.companies as any)?.domain || '';
    if (['contacted', 'opened'].includes(l.pipeline_stage) && daysSince > 3) {
      focus.push({ type: 'stale', priority: 2, label: `Follow up ${l.first_name} ${l.last_name}`, detail: `${company} — ${l.pipeline_stage} ${Math.floor(daysSince)}d ago`, leadId: l.id });
    }
    if (['clicked', 'visited'].includes(l.pipeline_stage) && daysSince < 2) {
      focus.push({ type: 'hot', priority: 1, label: `Hot lead: ${l.first_name} ${l.last_name}`, detail: `${company} — ${l.pipeline_stage} recently`, leadId: l.id });
    }
    // Ghosting: was engaged (clicked/visited) but gone cold 5+ days
    if (['clicked', 'visited'].includes(l.pipeline_stage) && daysSince > 5) {
      focus.push({ type: 'ghost', priority: 1, label: `Ghosting: ${l.first_name} ${l.last_name}`, detail: `${company} — was ${l.pipeline_stage}, silent ${Math.floor(daysSince)}d. Re-engage now`, leadId: l.id });
    }
  });

  // IP-identified companies (organic visitors detected via IPInfo)
  const { data: recentAbm } = await supabase
    .from('abm_visits')
    .select('company, contact_name, visited_at')
    .is('contact_name', null)
    .gte('visited_at', new Date(now - 48 * 3600000).toISOString())
    .order('visited_at', { ascending: false })
    .limit(5);

  const ipCompanies = new Set<string>();
  (recentAbm || []).forEach((v: any) => {
    if (v.company && !ipCompanies.has(v.company)) {
      ipCompanies.add(v.company);
      focus.push({ type: 'ip_identified', priority: 2, label: `New visitor: ${v.company}`, detail: 'Identified via IP — consider outreach' });
    }
  });

  // Multi-visit alert (same company 3+ visits in 48h)
  const { data: multiVisits } = await supabase
    .from('abm_visits')
    .select('company')
    .gte('visited_at', new Date(now - 48 * 3600000).toISOString());

  const visitCounts: Record<string, number> = {};
  (multiVisits || []).forEach((v: any) => { if (v.company) visitCounts[v.company] = (visitCounts[v.company] || 0) + 1; });
  Object.entries(visitCounts).forEach(([co, count]) => {
    if (count >= 3) {
      focus.push({ type: 'multi_visit', priority: 1, label: `Account surge: ${co}`, detail: `${count} visits in 48h — high interest signal` });
    }
  });

  // Due LinkedIn actions
  (scheduledActions.data || []).forEach((a: any) => {
    focus.push({ type: 'linkedin', priority: 1, label: `LinkedIn: ${a.metadata?.name || 'Unknown'}`, detail: `Connect request due now` });
  });

  // Unread inbox
  if ((unreadContacts.count || 0) > 0) {
    focus.push({ type: 'inbox', priority: 1, label: `${unreadContacts.count} unread message${(unreadContacts.count || 0) > 1 ? 's' : ''}`, detail: 'Check your inbox' });
  }

  focus.sort((a, b) => a.priority - b.priority);

  return NextResponse.json({
    companies: companies.count || 0,
    contacts: contacts.count || 0,
    sent,
    opened,
    clicked,
    replied,
    pageViews: pageViews.count || 0,
    recentOutreach: logs,
    inboxReplies: threads.data || [],
    focus: focus.slice(0, 8),
  });
}
