import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { generateCVBuffer } from '@/lib/generate-cv-pdf';
import { safeBrandColors } from '@/lib/color-utils';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const emailTemplates = {
  nl: (name: string, companyName: string, landingUrl: string, primary: string, accentColor: string, logoHtml: string) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff">
<tr><td style="background:${primary};padding:40px 32px;text-align:center">
  ${logoHtml}
  <p style="color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px">Speciaal voor ${companyName}</p>
  <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0">Hey ${name},</h1>
</td></tr>
<tr><td style="padding:32px">
  <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 16px">Mijn naam is Samba Jarju — Email Marketeer & Marketing Automation Specialist. Bij Vandebron verstuur ik 500.000+ emails per maand met Salesforce Marketing Cloud, SQL en AMPScript.</p>
  <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 24px">Ik heb een persoonlijke pagina gemaakt over hoe ik ${companyName} kan helpen met email marketing en marketing automation. Neem gerust een kijkje:</p>
  <table cellpadding="0" cellspacing="0" style="margin-bottom:16px"><tr><td style="background:${accentColor};border-radius:9999px;padding:14px 28px">
    <a href="${landingUrl}" style="color:#ffffff;text-decoration:none;font-weight:600;font-size:14px">Bekijk mijn voorstel →</a>
  </td></tr></table>
  <p style="font-size:13px;color:#888;margin:0">📎 Mijn CV vind je als bijlage bij deze email.</p>
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
</table></body></html>`,

  en: (name: string, companyName: string, landingUrl: string, primary: string, accentColor: string, logoHtml: string) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff">
<tr><td style="background:${primary};padding:40px 32px;text-align:center">
  ${logoHtml}
  <p style="color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px">Made for ${companyName}</p>
  <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0">Hey ${name},</h1>
</td></tr>
<tr><td style="padding:32px">
  <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 16px">My name is Samba Jarju — Email Marketer & Marketing Automation Specialist. At Vandebron, I manage 500,000+ emails per month using Salesforce Marketing Cloud, SQL, and AMPScript.</p>
  <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 24px">I've created a personal page about how I can help ${companyName} with email marketing and marketing automation. Feel free to take a look:</p>
  <table cellpadding="0" cellspacing="0" style="margin-bottom:16px"><tr><td style="background:${accentColor};border-radius:9999px;padding:14px 28px">
    <a href="${landingUrl}" style="color:#ffffff;text-decoration:none;font-weight:600;font-size:14px">View my proposal →</a>
  </td></tr></table>
  <p style="font-size:13px;color:#888;margin:0">📎 You'll find my CV attached to this email.</p>
</td></tr>
<tr><td style="padding:24px 32px;border-top:1px solid #eee">
  <table cellpadding="0" cellspacing="0"><tr>
    <td style="width:40px"><div style="width:36px;height:36px;border-radius:10px;background:#EF476F;color:#fff;font-weight:700;font-size:13px;line-height:36px;text-align:center">SJ</div></td>
    <td style="padding-left:12px">
      <p style="margin:0;font-size:14px;font-weight:600;color:#023047">Samba Jarju</p>
      <p style="margin:2px 0 0;font-size:12px;color:#888">Email Marketer & Marketing Automation Specialist</p>
      <p style="margin:2px 0 0;font-size:12px;color:#888">+31 6 87975656 · samba@sambajarju.nl</p>
    </td>
  </tr></table>
</td></tr>
</table></body></html>`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyDomain, contactFirstName, contactLastName, contactEmail, contactRole, language = 'nl' } = body;
    const lang = (language === 'en' ? 'en' : 'nl') as 'nl' | 'en';

    if (!companyDomain || !contactEmail || !contactFirstName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Upsert company
    let { data: company } = await supabase.from('companies').select('*').eq('domain', companyDomain).single();

    if (!company) {
      const brandRes = await fetch('https://sambajarju.com/api/personalize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: companyDomain }),
      });
      const brandData = brandRes.ok ? await brandRes.json() : {};
      const { data: newCompany } = await supabase.from('companies').insert({
        domain: companyDomain, name: brandData.companyName || companyDomain.split('.')[0],
        logo_url: brandData.logoUrl || null,
        brand_color_primary: brandData.primaryColor || '#023047',
        brand_color_secondary: brandData.secondaryColor || '#EF476F',
      }).select().single();
      company = newCompany;
    }
    if (!company) return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });

    // 2. Upsert contact
    let { data: contact } = await supabase.from('contacts').select('*').eq('email', contactEmail).single();
    if (!contact) {
      const { data: newContact } = await supabase.from('contacts').insert({
        company_id: company.id, first_name: contactFirstName,
        last_name: contactLastName || null, email: contactEmail, role: contactRole || null,
      }).select().single();
      contact = newContact;
    }
    if (!contact) return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });

    // 3. Build email
    const primary = company.brand_color_primary || '#023047';
    const secondary = company.brand_color_secondary || '#EF476F';
    const colors = safeBrandColors(primary, secondary);
    const landingLocale = lang === 'en' ? '/en' : '';
    const landingUrl = `https://sambajarju.com${landingLocale}/landing?company=${companyDomain}&contactname=${contactFirstName}`;
    const logoHtml = company.logo_url ? `<img src="${company.logo_url}" width="48" height="48" style="border-radius:12px;background:#fff;padding:4px;margin-bottom:16px" alt="${company.name}">` : '';
    const subject = lang === 'en'
      ? `${contactFirstName}, here's how I can help ${company.name}`
      : `${contactFirstName}, zo kan ik ${company.name} helpen`;

    const emailHtml = emailTemplates[lang](contactFirstName, company.name, landingUrl, colors.sidebarBg, colors.accent, logoHtml);

    // 4. Generate PDF
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await generateCVBuffer({
        companyDomain, contactName: contactFirstName, companyName: company.name,
        primary, secondary, logoUrl: company.logo_url || '', language: lang,
      });
    } catch (e) { console.error('CV generation error:', e); }

    // 5. Send via Mailgun
    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    if (!mailgunApiKey || !mailgunDomain) return NextResponse.json({ error: 'Mailgun not configured' }, { status: 500 });

    const formData = new FormData();
    formData.append('from', 'Samba Jarju <samba@sambajarju.com>');
    formData.append('h:Reply-To', 'samba@sambajarju.com');
    formData.append('to', contactEmail);
    formData.append('subject', subject);
    formData.append('html', emailHtml);
    formData.append('o:tracking-clicks', 'htmlonly');
    formData.append('o:tracking-opens', 'yes');

    if (pdfBuffer) {
      formData.append('attachment', new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' }), `CV_Samba_Jarju_${company.name}.pdf`);
    }

    const mgRes = await fetch(`https://api.eu.mailgun.net/v3/${mailgunDomain}/messages`, {
      method: 'POST',
      headers: { Authorization: `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString('base64')}` },
      body: formData,
    });
    const mgData = await mgRes.json();
    if (!mgRes.ok) return NextResponse.json({ error: 'Mailgun error', details: mgData }, { status: 500 });

    // 6. Log
    const cleanMsgId = mgData.id?.replace(/[<>]/g, '') || null;
    await supabase.from('outreach_logs').insert({ contact_id: contact.id, company_id: company.id, message_id: cleanMsgId, subject, status: 'sent' });
    await supabase.from('email_threads').insert({ contact_id: contact.id, company_id: company.id, direction: 'outbound', from_email: 'samba@sambajarju.com', to_email: contactEmail, subject, body_html: emailHtml, message_id: cleanMsgId });

    return NextResponse.json({ success: true, messageId: mgData.id });
  } catch (err) {
    console.error('Outreach error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
