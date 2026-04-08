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
    focus: focus.slice(0, 5),
  });
}
