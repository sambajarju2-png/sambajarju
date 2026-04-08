import { NextResponse } from 'next/server';

const POSTHOG_HOST = 'https://eu.i.posthog.com';
const POSTHOG_PROJECT_ID = '155797';

async function phQuery(query: string) {
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  if (!key) return { results: [], columns: [] };
  const res = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });
  if (!res.ok) {
    console.error('PostHog query failed:', res.status, await res.text().catch(() => ''));
    return { results: [], columns: [] };
  }
  return res.json();
}

export async function GET(req: Request) {
  if (!process.env.POSTHOG_PERSONAL_API_KEY) {
    return NextResponse.json({ error: 'POSTHOG_PERSONAL_API_KEY not set' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get('days') || '30');
  const interval = `interval ${days} day`;

  try {
    const [
      dailyPageviews, totalStats, topPages, entryPages, exitPages,
      referrers, countries, utmCampaigns,
      devices, browsers, os,
      abmVisitors, recentSessions, clickEvents,
    ] = await Promise.all([
      phQuery(`SELECT toDate(timestamp) as day, count() as views, count(DISTINCT distinct_id) as visitors FROM events WHERE event = '$pageview' AND timestamp > now() - ${interval} GROUP BY day ORDER BY day`),
      phQuery(`SELECT count() as total_pageviews, count(DISTINCT distinct_id) as unique_visitors, count(DISTINCT properties.$session_id) as total_sessions FROM events WHERE event = '$pageview' AND timestamp > now() - ${interval}`),
      phQuery(`SELECT replaceRegexpAll(properties.$pathname, '^/?', '/') as path, count() as views, count(DISTINCT distinct_id) as unique_views FROM events WHERE event = '$pageview' AND timestamp > now() - ${interval} GROUP BY path ORDER BY views DESC LIMIT 20`),
      phQuery(`SELECT replaceRegexpAll(properties.$pathname, '^/?', '/') as path, count(DISTINCT properties.$session_id) as sessions FROM events WHERE event = '$pageview' AND timestamp > now() - ${interval} GROUP BY path ORDER BY sessions DESC LIMIT 15`).catch(() => ({ results: [] })),
      phQuery(`SELECT replaceRegexpAll(properties.$pathname, '^/?', '/') as path, count(DISTINCT properties.$session_id) as sessions FROM events WHERE event = '$pageleave' AND timestamp > now() - ${interval} GROUP BY path ORDER BY sessions DESC LIMIT 15`).catch(() => ({ results: [] })),
      phQuery(`SELECT if(properties.$referrer = '' OR properties.$referrer IS NULL, 'Direct', domain(properties.$referrer)) as referrer, count() as visits FROM events WHERE event = '$pageview' AND timestamp > now() - ${interval} GROUP BY referrer ORDER BY visits DESC LIMIT 15`),
      phQuery(`SELECT properties.$geoip_country_code as country, count(DISTINCT distinct_id) as visitors FROM events WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.$geoip_country_code IS NOT NULL GROUP BY country ORDER BY visitors DESC LIMIT 15`),
      phQuery(`SELECT properties.utm_source as source, properties.utm_medium as medium, properties.utm_campaign as campaign, count(DISTINCT properties.$session_id) as sessions FROM events WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.utm_source IS NOT NULL GROUP BY source, medium, campaign ORDER BY sessions DESC LIMIT 15`),
      phQuery(`SELECT properties.$device_type as device, count(DISTINCT distinct_id) as visitors FROM events WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.$device_type IS NOT NULL GROUP BY device ORDER BY visitors DESC`),
      phQuery(`SELECT properties.$browser as browser, count(DISTINCT distinct_id) as visitors FROM events WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.$browser IS NOT NULL GROUP BY browser ORDER BY visitors DESC LIMIT 10`),
      phQuery(`SELECT properties.$os as os, count(DISTINCT distinct_id) as visitors FROM events WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.$os IS NOT NULL GROUP BY os ORDER BY visitors DESC LIMIT 10`),
      phQuery(`SELECT properties.company as company, properties.contact_name as contact, replaceRegexpAll(properties.$pathname, '^/?', '/') as page, properties.$referrer as referrer, timestamp FROM events WHERE event = '$pageview' AND properties.company IS NOT NULL AND timestamp > now() - ${interval} ORDER BY timestamp DESC LIMIT 50`),
      phQuery(`SELECT distinct_id, min(timestamp) as first_seen, max(timestamp) as last_seen, count() as page_count, any(properties.$referrer) as referrer, any(properties.$device_type) as device, any(properties.$browser) as browser, any(properties.$geoip_country_code) as country, any(properties.$geoip_city_name) as city FROM events WHERE event = '$pageview' AND timestamp > now() - interval 7 day GROUP BY distinct_id ORDER BY last_seen DESC LIMIT 50`),
      phQuery(`SELECT coalesce(properties.$el_text, '') as element, count() as clicks FROM events WHERE event = '$autocapture' AND timestamp > now() - ${interval} AND properties.$el_text IS NOT NULL AND properties.$el_text != '' GROUP BY element ORDER BY clicks DESC LIMIT 20`),
    ]);

    const s = totalStats?.results?.[0] || [0, 0, 0];

    return NextResponse.json({
      overview: { totalPageviews: s[0] || 0, uniqueVisitors: s[1] || 0, totalSessions: s[2] || 0, pagesPerSession: s[2] > 0 ? (s[0] / s[2]).toFixed(1) : '0' },
      dailyPageviews: dailyPageviews?.results || [],
      topPages: topPages?.results || [],
      entryPages: entryPages?.results || [],
      exitPages: exitPages?.results || [],
      referrers: referrers?.results || [],
      countries: countries?.results || [],
      utmCampaigns: utmCampaigns?.results || [],
      devices: devices?.results || [],
      browsers: browsers?.results || [],
      os: os?.results || [],
      abmVisitors: abmVisitors?.results || [],
      recentSessions: recentSessions?.results || [],
      clickEvents: clickEvents?.results || [],
      days,
    });
  } catch (err) {
    console.error('PostHog query error:', err);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
