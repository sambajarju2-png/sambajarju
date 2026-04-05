import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { company } = await request.json();
    if (!company) {
      return NextResponse.json({ error: 'Company required' }, { status: 400 });
    }

    const domain = company.includes('.') ? company : `${company}.com`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: `You are a brand color and messaging expert. Given a company name/domain, respond ONLY with valid JSON in this exact format, nothing else:
{
  "primaryColor": "#hexcode",
  "secondaryColor": "#hexcode",
  "companyName": "Official Company Name",
  "greeting": "A short personalized greeting (1 sentence, Dutch) addressing this company, mentioning how Samba Jarju's marketing automation skills could help them specifically",
  "tagline": "A short tagline (max 6 words, Dutch) about what Samba could do for them"
}
Use the actual brand colors of the company. If unsure, use professional-looking colors that match their brand identity.`,
        messages: [{ role: 'user', content: `Company: ${domain}` }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'AI unavailable' }, { status: 502 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Parse error' }, { status: 500 });
    }

    const brandData = JSON.parse(jsonMatch[0]);
    brandData.logo = `https://logo.clearbit.com/${domain}`;
    brandData.domain = domain;

    return NextResponse.json(brandData);
  } catch (error) {
    console.error('Personalize error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
