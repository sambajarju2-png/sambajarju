import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// Method 1: Logo.dev (logo) + Brandfetch Brand API (colors)
async function method1(domain: string) {
  const start = Date.now();
  const logoDevToken = process.env.LOGO_DEV_TOKEN;
  const brandfetchKey = process.env.BRANDFETCH_API_KEY;

  const logo = logoDevToken ? `https://img.logo.dev/${domain}?token=${logoDevToken}&size=200&format=png` : null;

  let colors: string[] = [];
  let companyName = domain;

  if (brandfetchKey) {
    try {
      const res = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
        headers: { Authorization: `Bearer ${brandfetchKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        companyName = data.name || domain;
        colors = (data.colors || [])
          .flatMap((c: { formats?: { hex?: string }[] }) => c.formats?.map(f => f.hex) || [])
          .filter(Boolean)
          .slice(0, 5);
      }
    } catch (e) {
      console.error('Brandfetch error:', e);
    }
  }

  return {
    method: 'Logo.dev + Brandfetch',
    logo,
    colors,
    companyName,
    timeMs: Date.now() - start,
    source: { logo: 'Logo.dev (free)', colors: 'Brandfetch Brand API (free tier)' },
  };
}

// Method 2: Logo.dev (logo) + Color Thief (extract colors from logo image)
async function method2(domain: string) {
  const start = Date.now();
  const logoDevToken = process.env.LOGO_DEV_TOKEN;
  const logoUrl = logoDevToken ? `https://img.logo.dev/${domain}?token=${logoDevToken}&size=200&format=png` : null;

  let colors: string[] = [];

  if (logoUrl) {
    try {
      const imgRes = await fetch(logoUrl);
      if (imgRes.ok) {
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const { data, info } = await sharp(buffer)
          .resize(50, 50, { fit: 'cover' })
          .raw()
          .toBuffer({ resolveWithObject: true });

        // Simple dominant color extraction
        const colorMap = new Map<string, number>();
        for (let i = 0; i < data.length; i += info.channels) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Skip near-white and near-black
          if (r + g + b > 700 || r + g + b < 60) continue;
          // Quantize to reduce colors
          const qr = Math.round(r / 32) * 32;
          const qg = Math.round(g / 32) * 32;
          const qb = Math.round(b / 32) * 32;
          const hex = `#${qr.toString(16).padStart(2, '0')}${qg.toString(16).padStart(2, '0')}${qb.toString(16).padStart(2, '0')}`;
          colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }

        colors = [...colorMap.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([hex]) => hex);
      }
    } catch (e) {
      console.error('Color extraction error:', e);
    }
  }

  return {
    method: 'Logo.dev + Color Thief',
    logo: logoUrl,
    colors,
    companyName: domain,
    timeMs: Date.now() - start,
    source: { logo: 'Logo.dev (free)', colors: 'Sharp pixel extraction (free, no API)' },
  };
}

// Method 3: Fully Brandfetch (logo + colors)
async function method3(domain: string) {
  const start = Date.now();
  const brandfetchKey = process.env.BRANDFETCH_API_KEY;
  const brandfetchClientId = process.env.BRANDFETCH_CLIENT_ID;

  const logo = brandfetchClientId ? `https://cdn.brandfetch.io/${domain}?c=${brandfetchClientId}` : null;

  let colors: string[] = [];
  let companyName = domain;

  if (brandfetchKey) {
    try {
      const res = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
        headers: { Authorization: `Bearer ${brandfetchKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        companyName = data.name || domain;
        colors = (data.colors || [])
          .flatMap((c: { formats?: { hex?: string }[] }) => c.formats?.map(f => f.hex) || [])
          .filter(Boolean)
          .slice(0, 5);
      }
    } catch (e) {
      console.error('Brandfetch full error:', e);
    }
  }

  return {
    method: 'Fully Brandfetch',
    logo,
    colors,
    companyName,
    timeMs: Date.now() - start,
    source: { logo: 'Brandfetch Logo CDN (free)', colors: 'Brandfetch Brand API (free tier)' },
  };
}

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get('domain');
  const method = request.nextUrl.searchParams.get('method');

  if (!domain) {
    return NextResponse.json({ error: 'domain param required' }, { status: 400 });
  }

  const cleanDomain = domain.includes('.') ? domain.toLowerCase().trim() : `${domain.toLowerCase().trim()}.com`;

  try {
    if (method === '1') return NextResponse.json(await method1(cleanDomain));
    if (method === '2') return NextResponse.json(await method2(cleanDomain));
    if (method === '3') return NextResponse.json(await method3(cleanDomain));

    // Run all 3 in parallel
    const [r1, r2, r3] = await Promise.all([
      method1(cleanDomain),
      method2(cleanDomain),
      method3(cleanDomain),
    ]);

    return NextResponse.json({ results: [r1, r2, r3] });
  } catch (error) {
    console.error('Brand test error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
