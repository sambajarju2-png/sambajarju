import { NextResponse } from 'next/server';

const POSTHOG_HOST = 'https://eu.i.posthog.com';
const POSTHOG_PROJECT_ID = '155797';
const POSTHOG_PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;

async function phQuery(query: string) {
  const res = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}` },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });
  if (!res.ok) return { results: [], columns: [] };
  return res.json();
}

export async function GET() {
  if (!POSTHOG_PERSONAL_API_KEY) {
    return NextResponse.json({ error: 'POSTHOG_PERSONAL_API_KEY not set' }, { status: 500 });
  }

  try {
    const [pageviews, topPages, visitors, abmVisitors, recentSessions] = await Promise.all([
      // Total pageviews last 30 days
      phQuery(`SELECT count() as total, toDate(timestamp) as day FROM events WHERE event = '$pageview' AND timestamp > now() - interval 30 day GROUP BY day ORDER BY day`),
      // Top pages last 30 days
      phQuery(`SELECT properties.$current_url as url, count() as views FROM events WHERE event = '$pageview' AND timestamp > now() - interval 30 day GROUP BY url ORDER BY views DESC LIMIT 20`),
      // Unique visitors last 30 days
      phQuery(`SELECT count(DISTINCT distinct_id) as unique_visitors FROM events WHERE event = '$pageview' AND timestamp > now() - interval 30 day`),
      // ABM visitors (identified with company)
      phQuery(`SELECT properties.company as company, properties.contact_name as contact, properties.$current_url as url, timestamp FROM events WHERE event = '$pageview' AND properties.company IS NOT NULL AND timestamp > now() - interval 30 day ORDER BY timestamp DESC LIMIT 50`),
      // Recent sessions with duration
      phQuery(`SELECT distinct_id, min(timestamp) as first_seen, max(timestamp) as last_seen, count() as page_count, any(properties.$referrer) as referrer FROM events WHERE event = '$pageview' AND timestamp > now() - interval 7 day GROUP BY distinct_id ORDER BY last_seen DESC LIMIT 30`),
    ]);

    return NextResponse.json({
      pageviews: pageviews?.results || [],
      pageviewColumns: pageviews?.columns || [],
      topPages: topPages?.results || [],
      topPagesColumns: topPages?.columns || [],
      uniqueVisitors: visitors?.results?.[0]?.[0] || 0,
      abmVisitors: abmVisitors?.results || [],
      abmVisitorColumns: abmVisitors?.columns || [],
      recentSessions: recentSessions?.results || [],
      recentSessionColumns: recentSessions?.columns || [],
    });
  } catch (err) {
    console.error('PostHog query error:', err);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
