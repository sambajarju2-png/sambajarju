import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const [{ data: leads, error }, { data: actions }] = await Promise.all([
    supabase
      .from('contacts')
      .select('id, first_name, last_name, email, role, linkedin_url, pipeline_stage, pipeline_updated_at, notes, deal_value, company_id, companies(domain, name, logo_url, brand_color_primary)')
      .order('pipeline_updated_at', { ascending: false }),
    supabase
      .from('scheduled_actions')
      .select('*')
      .eq('status', 'pending')
      .order('scheduled_for', { ascending: true }),
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ leads: leads || [], scheduledActions: actions || [] });
}

export async function PATCH(req: Request) {
  const { id, pipeline_stage, notes, deal_value, linkedin_url } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const update: Record<string, unknown> = { pipeline_updated_at: new Date().toISOString() };
  if (pipeline_stage !== undefined) update.pipeline_stage = pipeline_stage;
  if (notes !== undefined) update.notes = notes;
  if (deal_value !== undefined) update.deal_value = deal_value;
  if (linkedin_url !== undefined) update.linkedin_url = linkedin_url;

  const { error } = await supabase.from('contacts').update(update).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const { contact_id, action_type, scheduled_for, metadata } = await req.json();
  if (!contact_id || !action_type || !scheduled_for) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const { data, error } = await supabase.from('scheduled_actions').insert({
    contact_id, action_type, scheduled_for, metadata: metadata || {},
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ action: data });
}
