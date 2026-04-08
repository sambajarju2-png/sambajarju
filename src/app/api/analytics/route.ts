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
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  if (!key) return NextResponse.json({ error: 'POSTHOG_PERSONAL_API_KEY not set' }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get('days') || '30');
  const interval = `interval ${days} day`;

  try {
    const [
      overview,
      dailyTraffic,
      topPages,
      referrers,
      countries,
      browsers,
      devices,
      osData,
      entryPages,
      exitPages,
      utmSources,
      abmVisitors,
      recentSessions,
      hourlyHeatmap,
      pageFlows,
    ] = await Promise.all([
      phQuery(`
        SELECT
          count() as total_pageviews,
          count(DISTINCT person_id) as unique_visitors,
          count(DISTINCT properties.$session_id) as total_sessions
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval}
      `),
      phQuery(`
        SELECT
          toDate(timestamp) as day,
          count() as pageviews,
          count(DISTINCT person_id) as visitors
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval}
        GROUP BY day ORDER BY day
      `),
      phQuery(`
        SELECT
          replaceRegexpAll(properties.$pathname, '\\\\?.*', '') as page,
          count() as views,
          count(DISTINCT person_id) as unique_views
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval}
        GROUP BY page ORDER BY views DESC LIMIT 20
      `),
      phQuery(`
        SELECT
          if(properties.$referrer = '' OR properties.$referrer IS NULL, '(direct)', domain(properties.$referrer)) as referrer,
          count() as visits,
          count(DISTINCT person_id) as unique_visits
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval}
        GROUP BY referrer ORDER BY visits DESC LIMIT 15
      `),
      phQuery(`
        SELECT
          properties.$geoip_country_code as country,
          properties.$geoip_country_name as country_name,
          count(DISTINCT person_id) as visitors
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.$geoip_country_code IS NOT NULL
        GROUP BY country, country_name ORDER BY visitors DESC LIMIT 15
      `),
      phQuery(`
        SELECT
          properties.$browser as browser,
          count(DISTINCT person_id) as users
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.$browser IS NOT NULL
        GROUP BY browser ORDER BY users DESC LIMIT 10
      `),
      phQuery(`
        SELECT
          properties.$device_type as device,
          count(DISTINCT person_id) as users
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.$device_type IS NOT NULL
        GROUP BY device ORDER BY users DESC
      `),
      phQuery(`
        SELECT
          properties.$os as os,
          count(DISTINCT person_id) as users
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.$os IS NOT NULL
        GROUP BY os ORDER BY users DESC LIMIT 10
      `),
      phQuery(`
        SELECT page, count() as entries FROM (
          SELECT
            properties.$session_id as sid,
            first_value(replaceRegexpAll(properties.$pathname, '\\\\?.*', '')) as page
          FROM events
          WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.$session_id IS NOT NULL
          GROUP BY sid
        ) GROUP BY page ORDER BY entries DESC LIMIT 10
      `),
      phQuery(`
        SELECT page, count() as exits FROM (
          SELECT
            properties.$session_id as sid,
            last_value(replaceRegexpAll(properties.$pathname, '\\\\?.*', '')) as page
          FROM events
          WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.$session_id IS NOT NULL
          GROUP BY sid
        ) GROUP BY page ORDER BY exits DESC LIMIT 10
      `),
      phQuery(`
        SELECT
          properties.utm_source as source,
          properties.utm_medium as medium,
          properties.utm_campaign as campaign,
          count(DISTINCT person_id) as visitors
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.utm_source IS NOT NULL
        GROUP BY source, medium, campaign ORDER BY visitors DESC LIMIT 15
      `),
      phQuery(`
        SELECT
          properties.company as company,
          properties.contact_name as contact,
          replaceRegexpAll(properties.$current_url, '\\\\?.*', '') as page,
          properties.$referrer as referrer,
          properties.$geoip_country_code as country,
          properties.$device_type as device,
          timestamp
        FROM events
        WHERE event = '$pageview' AND properties.company IS NOT NULL AND timestamp > now() - ${interval}
        ORDER BY timestamp DESC LIMIT 100
      `),
      phQuery(`
        SELECT
          distinct_id,
          properties.$session_id as session_id,
          min(timestamp) as started,
          max(timestamp) as ended,
          count() as pages,
          first_value(properties.$referrer) as referrer,
          first_value(properties.$geoip_country_code) as country,
          first_value(properties.$browser) as browser,
          first_value(properties.$device_type) as device,
          first_value(replaceRegexpAll(properties.$pathname, '\\\\?.*', '')) as entry_page,
          last_value(replaceRegexpAll(properties.$pathname, '\\\\?.*', '')) as exit_page
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - interval 7 day AND properties.$session_id IS NOT NULL
        GROUP BY distinct_id, session_id
        ORDER BY ended DESC LIMIT 50
      `),
      phQuery(`
        SELECT
          toDayOfWeek(timestamp) as dow,
          toHour(timestamp) as hour,
          count() as views
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval}
        GROUP BY dow, hour ORDER BY dow, hour
      `),
      phQuery(`
        SELECT from_page, to_page, count() as transitions FROM (
          SELECT
            replaceRegexpAll(properties.$pathname, '\\\\?.*', '') as to_page,
            lagInFrame(replaceRegexpAll(properties.$pathname, '\\\\?.*', '')) OVER (PARTITION BY properties.$session_id ORDER BY timestamp) as from_page
          FROM events
          WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.$session_id IS NOT NULL
        )
        WHERE from_page IS NOT NULL AND from_page != to_page
        GROUP BY from_page, to_page ORDER BY transitions DESC LIMIT 20
      `),
    ]);

    // Bounce rate + avg duration
    const bounceQuery = await phQuery(`
      SELECT
        countIf(pages = 1) as bounced,
        count() as total,
        avg(duration) as avg_duration
      FROM (
        SELECT
          properties.$session_id as sid,
          count() as pages,
          dateDiff('second', min(timestamp), max(timestamp)) as duration
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval} AND properties.$session_id IS NOT NULL
        GROUP BY sid
      )
    `);

    const bd = bounceQuery?.results?.[0] || [0, 1, 0];
    const totalPV = overview?.results?.[0]?.[0] || 0;

    return NextResponse.json({
      overview: {
        totalPageviews: totalPV,
        uniqueVisitors: overview?.results?.[0]?.[1] || 0,
        totalSessions: overview?.results?.[0]?.[2] || 0,
        bounceRate: bd[1] > 0 ? parseFloat(((bd[0] / bd[1]) * 100).toFixed(1)) : 0,
        avgDuration: Math.round(bd[2] || 0),
        pagesPerSession: bd[1] > 0 ? parseFloat((totalPV / bd[1]).toFixed(1)) : 0,
      },
      dailyTraffic: dailyTraffic?.results || [],
      topPages: topPages?.results || [],
      referrers: referrers?.results || [],
      countries: countries?.results || [],
      browsers: browsers?.results || [],
      devices: devices?.results || [],
      os: osData?.results || [],
      entryPages: entryPages?.results || [],
      exitPages: exitPages?.results || [],
      utmSources: utmSources?.results || [],
      abmVisitors: abmVisitors?.results || [],
      recentSessions: recentSessions?.results || [],
      hourlyHeatmap: hourlyHeatmap?.results || [],
      pageFlows: pageFlows?.results || [],
      days,
    });
  } catch (err) {
    console.error('PostHog analytics error:', err);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
