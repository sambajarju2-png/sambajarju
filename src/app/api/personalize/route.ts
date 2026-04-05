import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const { company } = await request.json();
    if (!company || typeof company !== 'string' || company.length > 100) {
      return NextResponse.json({ error: 'Invalid company' }, { status: 400 });
    }

    const domain = company.includes('.') ? company.toLowerCase().trim() : `${company.toLowerCase().trim()}.com`;
    const logoDevToken = process.env.LOGO_DEV_TOKEN;
    const logoUrl = logoDevToken
      ? `https://img.logo.dev/${domain}?token=${logoDevToken}&size=200&format=png`
      : null;

    // Step 1: Extract colors from logo via Sharp (free, no API)
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

          const colorMap = new Map<string, number>();
          for (let i = 0; i < data.length; i += info.channels) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (r + g + b > 700 || r + g + b < 60) continue;
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

    const primaryColor = colors[0] || '#023047';
    const secondaryColor = colors[1] || colors[0] || '#EF476F';

    // Step 2: Claude Haiku — greeting text only (cheapest)
    let greeting = `Ik help bedrijven hun marketing te automatiseren en impact te maximaliseren. Laten we kijken wat ik voor jullie kan betekenen.`;
    let tagline = 'Marketing automation op maat';
    let companyName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      try {
        const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 150,
            system: 'You generate short personalized Dutch marketing text. Respond ONLY with JSON, no markdown, no backticks. Format: {"companyName":"Official Name","greeting":"1 sentence in Dutch about how Samba Jarju (email marketeer & marketing automation specialist) can help this specific company","tagline":"max 5 words Dutch tagline"}',
            messages: [{ role: 'user', content: `Company domain: ${domain}` }],
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const text = aiData.content?.[0]?.text || '';
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            companyName = parsed.companyName || companyName;
            greeting = parsed.greeting || greeting;
            tagline = parsed.tagline || tagline;
          }
        }
      } catch (e) {
        console.error('Haiku error:', e);
      }
    }

    return NextResponse.json({
      companyName,
      domain,
      primaryColor,
      secondaryColor,
      allColors: colors,
      greeting,
      tagline,
      logo: logoUrl,
    });
  } catch (error) {
    console.error('Personalize error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
