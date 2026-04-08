import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Uses IPInfo Lite (free, unlimited) for ASN/org data
// Upgrade to Business tier for actual company name + domain
// Set IPINFO_TOKEN in Vercel env vars (get free at ipinfo.io)

export async function GET() {
  const token = process.env.IPINFO_TOKEN;
  if (!token) return NextResponse.json({ company: null, reason: 'IPINFO_TOKEN not set' });

  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || headersList.get('x-real-ip') || '';

  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return NextResponse.json({ company: null, ip, reason: 'localhost' });
  }

  try {
    const res = await fetch(`https://api.ipinfo.io/lite/${ip}?token=${token}`, {
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) return NextResponse.json({ company: null, ip, reason: 'ipinfo error' });

    const data = await res.json();

    // ASN data gives us organization name and domain
    const orgName = data.as_name || null;
    const orgDomain = data.as_domain || null;
    const isIsp = orgName?.toLowerCase().includes('telecom') ||
                  orgName?.toLowerCase().includes('vodafone') ||
                  orgName?.toLowerCase().includes('t-mobile') ||
                  orgName?.toLowerCase().includes('ziggo') ||
                  orgName?.toLowerCase().includes('kpn') === false; // KPN is both ISP and target

    return NextResponse.json({
      ip,
      asn: data.asn || null,
      company: orgName,
      domain: orgDomain,
      country: data.country_code || null,
      isLikelyBusiness: !isIsp && !!orgName,
    });
  } catch {
    return NextResponse.json({ company: null, ip, reason: 'fetch failed' });
  }
}
