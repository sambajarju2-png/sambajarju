import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { company, contact_name, page, referrer, country, device, browser, session_id } = body;

    if (!company || !page) {
      return NextResponse.json({ error: 'Missing company or page' }, { status: 400 });
    }

    // Look up contact email via companies + contacts join
    let contact_email = null;
    if (contact_name) {
      const { data: companyRow } = await supabase
        .from('companies')
        .select('id')
        .ilike('domain', company)
        .limit(1)
        .single();

      if (companyRow?.id) {
        const { data: contactRow } = await supabase
          .from('contacts')
          .select('email')
          .eq('company_id', companyRow.id)
          .ilike('first_name', contact_name)
          .limit(1)
          .single();
        if (contactRow?.email) contact_email = contactRow.email;
      }
    }

    await supabase.from('abm_visits').insert({
      company,
      contact_name: contact_name || null,
      contact_email,
      page,
      referrer: referrer || null,
      country: country || null,
      device: device || null,
      browser: browser || null,
      session_id: session_id || null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('ABM track error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
