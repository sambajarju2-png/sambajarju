import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { companyDomain, contactFirstName, contactLastName, contactEmail, contactRole } = await request.json();

    if (!companyDomain || !contactEmail || !contactFirstName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Upsert company
    let { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('domain', companyDomain)
      .single();

    if (!company) {
      // Fetch brand data
      const brandRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'https://sambajarju.com' : 'http://localhost:3000'}/api/personalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: companyDomain }),
      });
      const brandData = brandRes.ok ? await brandRes.json() : {};

      const { data: newCompany } = await supabase
        .from('companies')
        .insert({
          domain: companyDomain,
          name: brandData.companyName || companyDomain.split('.')[0],
          logo_url: brandData.logoUrl || null,
          brand_color_primary: brandData.primaryColor || '#023047',
          brand_color_secondary: brandData.secondaryColor || '#EF476F',
        })
        .select()
        .single();
      company = newCompany;
    }

    if (!company) {
      return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
    }

    // 2. Upsert contact
    let { data: contact } = await supabase
      .from('contacts')
      .select('*')
      .eq('email', contactEmail)
      .single();

    if (!contact) {
      const { data: newContact } = await supabase
        .from('contacts')
        .insert({
          company_id: company.id,
          first_name: contactFirstName,
          last_name: contactLastName || null,
          email: contactEmail,
          role: contactRole || null,
        })
        .select()
        .single();
      contact = newContact;
    }

    if (!contact) {
      return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
    }

    // 3. Build branded email HTML
    const primary = company.brand_color_primary || '#023047';
    const secondary = company.brand_color_secondary || '#EF476F';
    const landingUrl = `https://sambajarju.com/landing?company=${companyDomain}&contactname=${contactFirstName}`;

    const emailHtml = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff">
<tr><td style="background:linear-gradient(135deg,${primary},${secondary});padding:40px 32px;text-align:center">
  ${company.logo_url ? `<img src="${company.logo_url}" width="48" height="48" style="border-radius:12px;background:#fff;padding:4px;margin-bottom:16px" alt="${company.name}">` : ''}
  <p style="color:rgba(255,255,255,0.8);font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px">Speciaal voor ${company.name}</p>
  <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0;line-height:1.3">Hey ${contactFirstName},</h1>
</td></tr>
<tr><td style="padding:32px">
  <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 16px">
    Mijn naam is Samba Jarju — Email Marketeer & Marketing Automation Specialist. Bij Vandebron verstuur ik 500.000+ emails per maand met Salesforce Marketing Cloud, SQL en AMPScript.
  </p>
  <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 24px">
    Ik heb een persoonlijke pagina gemaakt over hoe ik ${company.name} kan helpen met email marketing en marketing automation. Neem gerust een kijkje:
  </p>
  <table cellpadding="0" cellspacing="0" style="margin-bottom:16px"><tr><td style="background:${primary};border-radius:9999px;padding:14px 28px">
    <a href="${landingUrl}" style="color:#ffffff;text-decoration:none;font-weight:600;font-size:14px">Bekijk mijn voorstel →</a>
  </td></tr></table>
  <p style="font-size:13px;color:#888;margin:0 0 0">
    <a href="https://sambajarju.com/api/cv/generate?company=${companyDomain}&contactname=${contactFirstName}" style="color:${primary};text-decoration:underline">Download mijn CV (PDF)</a>
  </p>
</td></tr>
<tr><td style="padding:24px 32px;border-top:1px solid #eee">
  <table cellpadding="0" cellspacing="0"><tr>
    <td style="width:40px"><div style="width:36px;height:36px;border-radius:10px;background:#EF476F;color:#fff;font-weight:700;font-size:13px;line-height:36px;text-align:center">SJ</div></td>
    <td style="padding-left:12px">
      <p style="margin:0;font-size:14px;font-weight:600;color:#023047">Samba Jarju</p>
      <p style="margin:2px 0 0;font-size:12px;color:#888">Email Marketeer & Marketing Automation Specialist</p>
      <p style="margin:2px 0 0;font-size:12px;color:#888">+31 6 87975656 · samba@sambajarju.nl</p>
    </td>
  </tr></table>
</td></tr>
</table>
</body></html>`;

    // 4. Send via Mailgun
    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunDomain = process.env.MAILGUN_DOMAIN;

    if (!mailgunApiKey || !mailgunDomain) {
      return NextResponse.json({ error: 'Mailgun not configured' }, { status: 500 });
    }

    const formData = new FormData();
    formData.append('from', `Samba Jarju <samba@${mailgunDomain}>`);
    formData.append('to', contactEmail);
    formData.append('subject', `${contactFirstName}, zo kan ik ${company.name} helpen`);
    formData.append('html', emailHtml);
    formData.append('o:tracking-clicks', 'htmlonly');
    formData.append('o:tracking-opens', 'yes');

    const mgRes = await fetch(`https://api.eu.mailgun.net/v3/${mailgunDomain}/messages`, {
      method: 'POST',
      headers: { Authorization: `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString('base64')}` },
      body: formData,
    });

    const mgData = await mgRes.json();

    if (!mgRes.ok) {
      return NextResponse.json({ error: 'Mailgun error', details: mgData }, { status: 500 });
    }

    // 5. Log outreach
    await supabase.from('outreach_logs').insert({
      contact_id: contact.id,
      company_id: company.id,
      message_id: mgData.id?.replace(/[<>]/g, '') || null,
      subject: `${contactFirstName}, zo kan ik ${company.name} helpen`,
      status: 'sent',
    });

    return NextResponse.json({ success: true, messageId: mgData.id });
  } catch (err) {
    console.error('Outreach error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
