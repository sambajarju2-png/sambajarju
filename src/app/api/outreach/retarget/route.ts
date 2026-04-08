import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { visitId, email, company, contactName, template } = await req.json();

    if (!email || !company) {
      return NextResponse.json({ error: 'Missing email or company' }, { status: 400 });
    }

    const firstName = contactName?.split(' ')[0] || 'Hi';
    const subject = template === 'follow_up'
      ? `${firstName}, noticed you checked out my portfolio`
      : `${firstName}, let's connect about ${company}`;

    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #023047;">
        <p>Hi ${firstName},</p>
        <p>I noticed you visited my portfolio — thanks for taking a look! I'd love to chat about how I can help ${company} with email marketing and marketing automation.</p>
        <p>Some things I could help with:</p>
        <ul style="color: #4A6B7F;">
          <li>Email marketing strategy & execution (500k+ emails/month experience)</li>
          <li>Marketing automation flows (Salesforce MC, Deployteq, HubSpot)</li>
          <li>SQL-driven segmentation & personalization</li>
          <li>CRO and analytics setup</li>
        </ul>
        <p>Would you be open to a quick 15-minute call this week?</p>
        <p style="margin-top: 24px;">
          <a href="https://sambajarju.com/contact" style="display: inline-block; padding: 12px 24px; background: #EF476F; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Book a call</a>
        </p>
        <p style="margin-top: 24px; color: #8BA3B5; font-size: 13px;">
          Best,<br/>
          <strong style="color: #023047;">Samba Jarju</strong><br/>
          Data Marketeer & Marketing Automation<br/>
          <a href="https://sambajarju.com" style="color: #EF476F;">sambajarju.com</a> · +31 6 87975656
        </p>
      </div>
    `;

    // Send via Mailgun
    const mailgunDomain = process.env.MAILGUN_DOMAIN!;
    const form = new URLSearchParams();
    form.append('from', `Samba Jarju <samba@${mailgunDomain}>`);
    form.append('to', email);
    form.append('subject', subject);
    form.append('html', html);
    form.append('o:tag', 'retarget');

    const mgRes = await fetch(`https://api.eu.mailgun.net/v3/${mailgunDomain}/messages`, {
      method: 'POST',
      headers: { Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}` },
      body: form,
    });

    if (!mgRes.ok) {
      const errText = await mgRes.text();
      console.error('Mailgun retarget error:', errText);
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
    }

    // Update visit record
    if (visitId) {
      await supabase.from('abm_visits').update({
        retargeted_at: new Date().toISOString(),
        retarget_status: 'sent',
      }).eq('id', visitId);
    }

    return NextResponse.json({ ok: true, subject });
  } catch (err) {
    console.error('Retarget error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
