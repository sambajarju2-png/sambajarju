import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/* eslint-disable @typescript-eslint/no-explicit-any */

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function aiParseCompanyName(domain: string, rawName: string): Promise<{ displayName: string; industry?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { displayName: rawName };

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: `Given this company domain "${domain}" and raw name "${rawName}", return:
1. A clean display name suitable for email greetings (e.g. "KLM" not "KLM Royal Dutch Airlines", "Shell" not "Shell plc", "Cleanprofs" not "Cleanprofs B.V.")
2. The industry in 2-3 words

Respond ONLY in JSON: {"displayName": "...", "industry": "..."}`
        }],
      }),
    });

    if (!res.ok) return { displayName: rawName };
    const data = await res.json();
    const text = (data.content?.[0]?.text || '').trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return { displayName: rawName };
    return JSON.parse(match[0]);
  } catch {
    return { displayName: rawName };
  }
}

// Enrich a single company
async function enrichCompany(companyId: string) {
  const { data: company } = await supabase.from('companies').select('*').eq('id', companyId).single();
  if (!company) return null;

  const { displayName, industry } = await aiParseCompanyName(company.domain, company.name || company.domain);

  const update: Record<string, any> = {
    display_name: displayName,
    enriched_at: new Date().toISOString(),
  };
  if (industry) update.industry = industry;

  await supabase.from('companies').update(update).eq('id', companyId);
  return { ...company, display_name: displayName, industry };
}

// POST: Enrich all companies or a specific one
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const companyId = body.companyId;

  if (companyId) {
    const result = await enrichCompany(companyId);
    return NextResponse.json({ enriched: result ? 1 : 0, result });
  }

  // Enrich all companies without display names
  const { data: companies } = await supabase
    .from('companies')
    .select('id, domain, name, display_name')
    .or('display_name.is.null,enriched_at.is.null');

  if (!companies?.length) return NextResponse.json({ enriched: 0, message: 'All companies already enriched' });

  const results = [];
  for (const co of companies) {
    const result = await enrichCompany(co.id);
    if (result) results.push({ id: co.id, domain: co.domain, raw: co.name, display: result.display_name, industry: result.industry });
  }

  return NextResponse.json({ enriched: results.length, results });
}
