import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { company, contactName, path } = await request.json();
    if (!company) return NextResponse.json({ ok: true });

    const supabase = createAdminClient();

    // Find or create company
    let { data: companyData } = await supabase
      .from('companies')
      .select('id')
      .eq('domain', company)
      .single();

    let companyId = companyData?.id;

    if (!companyId) {
      const { data: newCompany } = await supabase
        .from('companies')
        .insert({ domain: company, name: company.replace(/\.(com|nl|io|app)$/i, '') })
        .select('id')
        .single();
      companyId = newCompany?.id;
    }

    // Find contact by name if provided
    let contactId = null;
    if (contactName && companyId) {
      const { data: contact } = await supabase
        .from('contacts')
        .select('id')
        .eq('company_id', companyId)
        .ilike('first_name', contactName)
        .single();
      contactId = contact?.id;
    }

    // Log page view
    await supabase.from('page_views').insert({
      company_id: companyId,
      contact_id: contactId,
      path: path || `/landing?company=${company}`,
      user_agent: request.headers.get('user-agent') || '',
      referrer: request.headers.get('referer') || '',
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Don't break the page if tracking fails
  }
}
