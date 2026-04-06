import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createAdminClient();

  const [companies, contacts, outreach, pageViews, threads] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('outreach_logs').select('*'),
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('email_threads').select('*').eq('direction', 'inbound').order('received_at', { ascending: false }).limit(20),
  ]);

  const logs = outreach.data || [];
  const sent = logs.length;
  const opened = logs.filter(l => l.opened_at).length;
  const clicked = logs.filter(l => l.clicked_at).length;
  const replied = logs.filter(l => l.status === 'replied').length;

  return NextResponse.json({
    companies: companies.count || 0,
    contacts: contacts.count || 0,
    sent,
    opened,
    clicked,
    replied,
    pageViews: pageViews.count || 0,
    recentOutreach: logs.slice(-10).reverse(),
    inboxReplies: threads.data || [],
  });
}
