import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('contacts')
    .select('id, first_name, last_name, email, role, pipeline_stage, pipeline_updated_at, notes, deal_value, company_id, companies(domain, name, logo_url, brand_color_primary)')
    .order('pipeline_updated_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ leads: data || [] });
}

export async function PATCH(req: Request) {
  const { id, pipeline_stage, notes, deal_value } = await req.json();
  if (!id || !pipeline_stage) return NextResponse.json({ error: 'Missing id or stage' }, { status: 400 });

  const update: Record<string, unknown> = {
    pipeline_stage,
    pipeline_updated_at: new Date().toISOString(),
  };
  if (notes !== undefined) update.notes = notes;
  if (deal_value !== undefined) update.deal_value = deal_value;

  const { error } = await supabase.from('contacts').update(update).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
