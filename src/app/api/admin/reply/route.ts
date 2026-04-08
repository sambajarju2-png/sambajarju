import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { submissionId, toEmail, toName, subject, message } = await req.json();

    if (!toEmail || !message) {
      return NextResponse.json({ success: false, error: 'Email and message required' }, { status: 400 });
    }

    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'sambajarju.com';

    if (!MAILGUN_API_KEY) {
      return NextResponse.json({ success: false, error: 'Mailgun not configured' }, { status: 500 });
    }

    const formData = new URLSearchParams();
    formData.append('from', `Samba Jarju <samba@${MAILGUN_DOMAIN}>`);
    formData.append('to', toEmail);
    formData.append('subject', subject || 'Re: Je bericht op sambajarju.com');
    formData.append('h:Reply-To', 'samba@sambajarju.nl');
    formData.append('html', `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="padding: 24px 0;">
          <p style="white-space: pre-wrap; color: #374151; line-height: 1.6;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          <hr style="border: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #6b7280; font-size: 14px;">Samba Jarju<br/>Email Marketeer & Marketing Automation<br/>
          <a href="https://sambajarju.com" style="color: #EF476F;">sambajarju.com</a></p>
        </div>
      </div>
    `);

    const res = await fetch(`https://api.eu.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: { Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}` },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Mailgun error:', err);
      return NextResponse.json({ success: false, error: 'Failed to send' }, { status: 500 });
    }

    // Mark as read
    if (submissionId) {
      await supabase.from('contact_submissions').update({ read: true }).eq('id', submissionId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reply API error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
