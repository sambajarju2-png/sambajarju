import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createAdminClient();

  const [companies, contacts, outreach, pageViews] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('outreach_logs').select('*'),
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
  ]);

  const logs = outreach.data || [];
  const sent = logs.length;
  const opened = logs.filter(l => l.opened_at).length;
  const clicked = logs.filter(l => l.clicked_at).length;

  return NextResponse.json({
    companies: companies.count || 0,
    contacts: contacts.count || 0,
    sent,
    opened,
    clicked,
    pageViews: pageViews.count || 0,
    recentOutreach: logs.slice(-10).reverse(),
  });
}
