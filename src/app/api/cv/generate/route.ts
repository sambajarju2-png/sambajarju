import { NextRequest, NextResponse } from 'next/server';
import { generateCVBuffer } from '@/lib/generate-cv-pdf';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const company = url.searchParams.get('company') || '';
    const contactName = url.searchParams.get('contactname') || '';

    let companyName = '';
    let primary = '#2563EB';
    let secondary = '#3B82F6';
    let logoUrl = '';

    if (company) {
      try {
        const res = await fetch(`${url.origin}/api/personalize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company }),
        });
        if (res.ok) {
          const data = await res.json();
          companyName = data.companyName || company;
          primary = data.primaryColor || primary;
          secondary = data.secondaryColor || secondary;
          logoUrl = data.logo || '';
        }
      } catch {
        companyName = company.split('.')[0];
      }
    }

    const pdfBuffer = await generateCVBuffer({
      companyDomain: company,
      contactName,
      companyName,
      primary,
      secondary,
      logoUrl,
    });

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="CV_Samba_Jarju${companyName ? `_${companyName}` : ''}.pdf"`,
      },
    });
  } catch (err) {
    console.error('CV generation error:', err);
    return NextResponse.json({ error: 'Failed to generate CV', details: String(err) }, { status: 500 });
  }
}
