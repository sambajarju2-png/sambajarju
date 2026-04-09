import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/* eslint-disable @typescript-eslint/no-explicit-any */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const [{ data: leads, error }, { data: actions }, { data: companyScores }] = await Promise.all([
    supabase
      .from('contacts')
      .select('id, first_name, last_name, email, role, linkedin_url, pipeline_stage, pipeline_updated_at, notes, deal_value, display_name, engagement_score, ai_next_action, ai_reasoning, ai_send_window, score_updated_at, first_contacted_at, first_opened_at, first_clicked_at, first_visited_at, first_replied_at, company_id, companies(domain, name, display_name, industry, logo_url, brand_color_primary, engagement_score, active_contacts, last_activity_at)')
      .order('pipeline_updated_at', { ascending: false }),
    supabase
      .from('scheduled_actions')
      .select('*')
      .eq('status', 'pending')
      .order('scheduled_for', { ascending: true }),
    supabase
      .from('companies')
      .select('id, domain, name, display_name, industry, engagement_score, active_contacts, last_activity_at')
      .order('engagement_score', { ascending: false }),
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch ABM visits for session replay links
  const { data: abmVisits } = await supabase
    .from('abm_visits')
    .select('company, contact_name, page, session_id, visited_at')
    .order('visited_at', { ascending: false })
    .limit(200);

  // Group visits by company domain
  const visitsByCompany: Record<string, any[]> = {};
  (abmVisits || []).forEach((v: any) => {
    const key = v.company?.toLowerCase();
    if (key) { if (!visitsByCompany[key]) visitsByCompany[key] = []; visitsByCompany[key].push(v); }
  });

  // Add Logo.dev URLs + visit history server-side
  const logoToken = process.env.LOGO_DEV_TOKEN;
  const enrichedLeads = (leads || []).map((lead: any) => {
    const domain = lead.companies?.domain?.toLowerCase().replace(/^https?:\/\//, '');
    if (domain && logoToken) {
      lead.companies = { ...lead.companies, logo_dev_url: `https://img.logo.dev/${domain}?token=${logoToken}&size=128&format=png` };
    }
    // Attach visit history
    lead.visits = visitsByCompany[domain || ''] || [];
    return lead;
  });

  const enrichedCompanies = (companyScores || []).map((co: any) => {
    const domain = co.domain?.toLowerCase().replace(/^https?:\/\//, '');
    if (domain && logoToken) co.logo_dev_url = `https://img.logo.dev/${domain}?token=${logoToken}&size=128&format=png`;
    return co;
  });

  return NextResponse.json({ leads: enrichedLeads, scheduledActions: actions || [], companyScores: enrichedCompanies });
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

  // Log activity
  if (pipeline_stage) {
    const { data: contact } = await supabase.from('contacts').select('company_id').eq('id', id).single();
    await supabase.from('lead_activity').insert({
      contact_id: id,
      company_id: contact?.company_id || null,
      event_type: 'stage_change',
      source: 'manual',
      metadata: { new_stage: pipeline_stage },
    });
  }

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
