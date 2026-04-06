import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface ContactRow {
  companyDomain: string;
  firstName: string;
  lastName?: string;
  email: string;
  role?: string;
  language?: 'nl' | 'en';
  list?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { contacts, action = 'import' } = await request.json() as { contacts: ContactRow[]; action: 'import' | 'send' };

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({ error: 'No contacts provided' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const results: { email: string; status: string; error?: string }[] = [];

    for (const row of contacts) {
      if (!row.companyDomain || !row.email || !row.firstName) {
        results.push({ email: row.email || '?', status: 'skipped', error: 'Missing required fields' });
        continue;
      }

      try {
        // Upsert company
        let { data: company } = await supabase.from('companies').select('*').eq('domain', row.companyDomain).single();
        if (!company) {
          // Try to get brand data
          let brandData: Record<string, string> = {};
          try {
            const brandRes = await fetch('https://sambajarju.com/api/personalize', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ company: row.companyDomain }),
            });
            if (brandRes.ok) brandData = await brandRes.json();
          } catch { /* ignore */ }

          const { data: newCompany } = await supabase.from('companies').insert({
            domain: row.companyDomain,
            name: brandData.companyName || row.companyDomain.split('.')[0],
            logo_url: brandData.logoUrl || null,
            brand_color_primary: brandData.primaryColor || '#023047',
            brand_color_secondary: brandData.secondaryColor || '#EF476F',
          }).select().single();
          company = newCompany;
        }

        if (!company) { results.push({ email: row.email, status: 'error', error: 'Company creation failed' }); continue; }

        // Upsert contact
        let { data: contact } = await supabase.from('contacts').select('*').eq('email', row.email).single();
        if (!contact) {
          const { data: newContact } = await supabase.from('contacts').insert({
            company_id: company.id,
            first_name: row.firstName,
            last_name: row.lastName || null,
            email: row.email,
            role: row.role || null,
          }).select().single();
          contact = newContact;
        }

        if (!contact) { results.push({ email: row.email, status: 'error', error: 'Contact creation failed' }); continue; }

        if (action === 'send') {
          // Trigger individual send
          const sendRes = await fetch('https://sambajarju.com/api/outreach/send', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              companyDomain: row.companyDomain,
              contactFirstName: row.firstName,
              contactLastName: row.lastName || '',
              contactEmail: row.email,
              contactRole: row.role || '',
              language: row.language || 'nl',
            }),
          });
          const sendData = await sendRes.json();
          results.push({ email: row.email, status: sendData.success ? 'sent' : 'error', error: sendData.error });
        } else {
          results.push({ email: row.email, status: 'imported' });
        }
      } catch (e) {
        results.push({ email: row.email, status: 'error', error: String(e) });
      }
    }

    const imported = results.filter(r => r.status === 'imported').length;
    const sent = results.filter(r => r.status === 'sent').length;
    const errors = results.filter(r => r.status === 'error').length;

    return NextResponse.json({ success: true, imported, sent, errors, results });
  } catch (err) {
    console.error('Bulk error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
