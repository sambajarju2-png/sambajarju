import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('abm_visits')
    .select('*')
    .order('visited_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ visits: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ visits: data || [] });
}
