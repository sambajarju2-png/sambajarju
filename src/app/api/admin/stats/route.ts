import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createAdminClient();

  const [companies, contacts, outreach, pageViews, threads] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('outreach_logs').select('*, contacts(first_name, last_name), companies(domain, name)').order('sent_at', { ascending: false }).limit(20),
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('email_threads').select('*').eq('direction', 'inbound').order('received_at', { ascending: false }).limit(20),
  ]);

  const logs = outreach.data || [];
  const allLogs = await supabase.from('outreach_logs').select('opened_at, clicked_at, status');
  const allL = allLogs.data || [];
  const sent = allL.length;
  const opened = allL.filter(l => l.opened_at).length;
  const clicked = allL.filter(l => l.clicked_at).length;
  const replied = allL.filter(l => l.status === 'replied').length;

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
  });
}
