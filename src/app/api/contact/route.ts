import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Naam, email en bericht zijn verplicht.' }, { status: 400 });
    }

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({ name, email, subject: subject || 'Geen onderwerp', message });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      // If table doesn't exist yet, still try to send notification
    }

    // Send notification email via Mailgun
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'sambajarju.com';

    if (MAILGUN_API_KEY) {
      const formData = new URLSearchParams();
      formData.append('from', `Portfolio Contact <noreply@${MAILGUN_DOMAIN}>`);
      formData.append('to', 'samba@sambajarju.nl');
      formData.append('subject', `[Portfolio Contact] ${subject || 'Nieuw bericht'} — van ${name}`);
      formData.append('html', `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #023047; padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color: #ffffff; margin: 0;">Nieuw contactbericht</h2>
          </div>
          <div style="background: #f8fafb; padding: 24px; border-radius: 0 0 12px 12px;">
            <p><strong>Naam:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Onderwerp:</strong> ${subject || 'Geen'}</p>
            <hr style="border: 1px solid #e5e7eb; margin: 16px 0;" />
            <p><strong>Bericht:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `);
      formData.append('h:Reply-To', email);

      await fetch(`https://api.eu.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: { Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}` },
        body: formData,
      }).catch((e) => console.error('Mailgun send error:', e));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
