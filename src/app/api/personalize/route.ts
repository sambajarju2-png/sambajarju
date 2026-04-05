import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { company } = await request.json();
    if (!company || typeof company !== 'string' || company.length > 100) {
      return NextResponse.json({ error: 'Invalid company' }, { status: 400 });
    }

    const domain = company.includes('.') ? company.toLowerCase().trim() : `${company.toLowerCase().trim()}.com`;

    // Step 1: Logo.dev Describe API — get logo, colors, name instantly
    const logoDevSecret = process.env.LOGO_DEV_SECRET;
    const logoDevToken = process.env.LOGO_DEV_TOKEN;

    let brandColors: { hex: string }[] = [];
    let companyName = company;
    let description = '';

    if (logoDevSecret) {
      try {
        const describeRes = await fetch(`https://api.logo.dev/describe/${domain}`, {
          headers: { Authorization: `Bearer ${logoDevSecret}` },
        });

        if (describeRes.ok) {
          const describeData = await describeRes.json();
          brandColors = describeData.colors || [];
          companyName = describeData.name || company;
          description = describeData.description || '';
        }
      } catch (e) {
        console.error('Logo.dev describe error:', e);
      }
    }

    const primaryColor = brandColors[0]?.hex || '#023047';
    const secondaryColor = brandColors[1]?.hex || brandColors[0]?.hex || '#EF476F';

    // Step 2: Claude Haiku — personalized greeting only (cheapest model)
    let greeting = `Welkom ${companyName}! Ik ben Samba Jarju, marketing automation specialist. Ik help bedrijven hun marketing te automatiseren en impact te maximaliseren.`;
    let tagline = 'Marketing automation op maat';

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
            system: 'You generate short personalized Dutch marketing text. Respond ONLY with JSON, no other text. Format: {"greeting":"1 sentence about how Samba Jarju can help this specific company with marketing automation","tagline":"max 5 words tagline"}',
            messages: [{ role: 'user', content: `Company: ${companyName}. Description: ${description || 'Unknown'}. Domain: ${domain}` }],
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const text = aiData.content?.[0]?.text || '';
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            greeting = parsed.greeting || greeting;
            tagline = parsed.tagline || tagline;
          }
        }
      } catch (e) {
        console.error('Haiku greeting error:', e);
      }
    }

    // Build logo URL with publishable token
    const logoUrl = logoDevToken
      ? `https://img.logo.dev/${domain}?token=${logoDevToken}&size=200&format=png`
      : null;

    return NextResponse.json({
      companyName,
      domain,
      primaryColor,
      secondaryColor,
      allColors: brandColors.map(c => c.hex),
      greeting,
      tagline,
      logo: logoUrl,
      description,
    });
  } catch (error) {
    console.error('Personalize error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
