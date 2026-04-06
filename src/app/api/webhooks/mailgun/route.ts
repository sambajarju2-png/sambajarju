import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// Verify Mailgun webhook signature
function verifySignature(timestamp: string, token: string, signature: string): boolean {
  const signingKey = process.env.MAILGUN_WEBHOOK_SIGNING_KEY;
  if (!signingKey) return false;
  const hmac = crypto.createHmac('sha256', signingKey);
  hmac.update(timestamp + token);
  return hmac.digest('hex') === signature;
}

// Map Mailgun event types to our status column
function mapEventToStatus(event: string): string | null {
  const map: Record<string, string> = {
    delivered: 'delivered',
    opened: 'opened',
    clicked: 'clicked',
    complained: 'complained',
    failed: 'bounced',
  };
  return map[event] || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Mailgun sends signature in body
    const { signature, 'event-data': eventData } = body;

    // Verify signature
    if (signature) {
      const isValid = verifySignature(
        signature.timestamp,
        signature.token,
        signature.signature
      );
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    if (!eventData) {
      return NextResponse.json({ ok: true }); // Test webhook or empty event
    }

    const event = eventData.event;
    const messageId = eventData.message?.headers?.['message-id'];
    const status = mapEventToStatus(event);

    if (!messageId || !status) {
      return NextResponse.json({ ok: true }); // Unknown event, acknowledge
    }

    const supabase = createAdminClient();
    const now = new Date().toISOString();

    // Build the update payload based on event type
    const updateData: Record<string, string> = { status };
    if (status === 'delivered') updateData.delivered_at = now;
    if (status === 'opened') updateData.opened_at = now;
    if (status === 'clicked') updateData.clicked_at = now;
    if (status === 'replied') updateData.replied_at = now;

    // Update the outreach log by message_id
    const { error } = await supabase
      .from('outreach_logs')
      .update(updateData)
      .eq('message_id', messageId);

    if (error) {
      console.error('Webhook DB update failed:', error);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ ok: true }); // Always return 200 to prevent retries
  }
}
