import { NextRequest, NextResponse } from 'next/server';
import { getPalette } from 'colorthief';

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

    // Step 1: Color Thief — proper MMCQ quantization from logo
    let colors: string[] = [];
    if (logoUrl) {
      try {
        const imgRes = await fetch(logoUrl);
        if (imgRes.ok) {
          const buffer = Buffer.from(await imgRes.arrayBuffer());
          const palette = await getPalette(buffer, { colorCount: 6 });
          if (palette) {
            colors = palette.map(c => c.hex());
          }
        }
      } catch (e) {
        console.error('Color extraction error:', e);
      }
    }

    const primaryColor = colors[0] || '#023047';
    const secondaryColor = colors[1] || colors[0] || '#EF476F';

    // Step 2: Claude Haiku — greeting only (cheapest, runs in parallel later)
    let greeting = `Ik help bedrijven hun marketing te automatiseren en impact te maximaliseren.`;
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
