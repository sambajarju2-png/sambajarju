import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DAILY_LIMIT = 10;

function hashIP(ip: string): string {
  return createHash('sha256').update(ip + (process.env.SUPABASE_SERVICE_ROLE_KEY || '')).digest('hex').slice(0, 16);
}

export async function checkRateLimit(ip: string, tool: string): Promise<{ allowed: boolean; remaining: number }> {
  const ipHash = hashIP(ip);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from('rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('tool', tool)
    .gte('used_at', since);

  const used = count || 0;
  const allowed = used < DAILY_LIMIT;
  const remaining = Math.max(0, DAILY_LIMIT - used);

  if (allowed) {
    await supabase.from('rate_limits').insert({ ip_hash: ipHash, tool });
  }

  return { allowed, remaining };
}
