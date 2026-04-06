import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fromEmail = formData.get('sender')?.toString() || formData.get('from')?.toString() || '';
    const toEmail = formData.get('recipient')?.toString() || '';
    const subject = formData.get('subject')?.toString() || '';
    const bodyPlain = formData.get('body-plain')?.toString() || '';
    const bodyHtml = formData.get('body-html')?.toString() || '';
    const messageId = formData.get('Message-Id')?.toString() || '';
    const inReplyTo = formData.get('In-Reply-To')?.toString() || '';

    if (!fromEmail) {
      return NextResponse.json({ ok: true });
    }

    const supabase = createAdminClient();

    // Try to find the contact by email
    const { data: contact } = await supabase
      .from('contacts')
      .select('id, company_id')
      .eq('email', fromEmail)
      .single();

    // Try to find the original outreach by In-Reply-To header
    let outreachId = null;
    if (inReplyTo) {
      const cleanId = inReplyTo.replace(/[<>]/g, '');
      const { data: outreach } = await supabase
        .from('outreach_logs')
        .select('id')
        .eq('message_id', cleanId)
        .single();
      outreachId = outreach?.id;
    }

    // Store the inbound email
    await supabase.from('email_threads').insert({
      outreach_id: outreachId,
      contact_id: contact?.id || null,
      company_id: contact?.company_id || null,
      direction: 'inbound',
      from_email: fromEmail,
      to_email: toEmail,
      subject,
      body_plain: bodyPlain,
      body_html: bodyHtml,
      message_id: messageId.replace(/[<>]/g, ''),
      in_reply_to: inReplyTo.replace(/[<>]/g, ''),
    });

    // Update outreach status to "replied" if we found the original
    if (outreachId) {
      await supabase
        .from('outreach_logs')
        .update({ status: 'replied', replied_at: new Date().toISOString() })
        .eq('id', outreachId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Inbound webhook error:', err);
    return NextResponse.json({ ok: true }); // Always 200 to prevent Mailgun retries
  }
}
