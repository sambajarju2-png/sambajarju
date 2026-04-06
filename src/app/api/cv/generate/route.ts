import { NextRequest, NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

function buildHTML(companyName: string, contactName: string, primary: string, secondary: string, logoUrl: string) {
  const accent = primary || '#2563EB';
  const accentLight = `${accent}15`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', system-ui, sans-serif; color: #334155; font-size: 11px; line-height: 1.5; }
  .page { width: 210mm; min-height: 297mm; padding: 0; background: #fff; position: relative; }

  /* Branded top bar */
  .top-bar { height: 6px; background: linear-gradient(90deg, ${accent}, ${secondary || accent}); }

  .header { padding: 28px 36px 20px; display: flex; justify-content: space-between; align-items: flex-start; }
  .header-left h1 { font-size: 28px; font-weight: 300; color: #1e293b; letter-spacing: -0.5px; }
  .header-left h1 b { font-weight: 800; }
  .header-left .subtitle { font-size: 14px; color: #94a3b8; margin-top: 2px; }
  .header-left .linkedin { margin-top: 10px; display: flex; align-items: center; gap: 6px; font-size: 11px; color: ${accent}; text-decoration: none; }
  .header-left .linkedin .badge { background: ${accent}; color: #fff; padding: 2px 5px; border-radius: 3px; font-weight: 700; font-size: 9px; }

  .header-right { text-align: right; font-size: 11px; color: #64748b; }
  .header-right .loc-label { font-weight: 700; color: #334155; }
  .header-right a { color: ${accent}; text-decoration: none; }

  /* Company branding badge */
  .company-badge { position: absolute; top: 16px; right: 36px; display: flex; align-items: center; gap: 8px; background: ${accentLight}; border: 1px solid ${accent}22; border-radius: 8px; padding: 6px 14px; }
  .company-badge img { width: 24px; height: 24px; border-radius: 4px; object-fit: contain; }
  .company-badge .label { font-size: 8px; color: ${accent}; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
  .company-badge .name { font-size: 12px; font-weight: 700; color: ${accent}; }

  /* Greeting */
  .greeting { margin: 0 36px 16px; padding: 10px 14px; background: ${accentLight}; border-left: 3px solid ${accent}; border-radius: 0 6px 6px 0; font-size: 10.5px; color: #475569; line-height: 1.6; }
  .greeting b { color: ${accent}; }

  .body { display: grid; grid-template-columns: 200px 1fr; gap: 28px; padding: 0 36px 36px; }

  /* Sidebar */
  .sidebar h3 { font-size: 11px; font-weight: 700; color: ${accent}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; margin-top: 18px; padding-bottom: 4px; border-bottom: 1px solid #f1f5f9; }
  .sidebar h3:first-child { margin-top: 0; }
  .skill-cat { font-size: 8px; font-weight: 800; color: ${secondary || accent}; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 10px; margin-bottom: 3px; }
  .sidebar ul { list-style: none; }
  .sidebar li { font-size: 10px; color: #64748b; padding: 1px 0; }
  .sidebar .soft-skills { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
  .sidebar .pill { font-size: 8.5px; padding: 2px 8px; border-radius: 99px; background: ${accentLight}; color: ${accent}; font-weight: 500; }

  /* Main */
  .main h2 { font-size: 18px; font-weight: 300; color: #94a3b8; margin-bottom: 16px; }
  .exp { margin-bottom: 14px; }
  .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
  .exp-company { font-size: 13px; font-weight: 700; color: #1e293b; }
  .exp-date { font-size: 10px; color: ${accent}; font-weight: 500; }
  .exp-role { font-size: 10.5px; font-weight: 600; color: #64748b; font-style: italic; margin: 1px 0 4px; }
  .exp ul { list-style: disc; margin-left: 16px; }
  .exp li { font-size: 10px; color: #475569; padding: 1px 0; }

  .edu-title { font-size: 13px; font-weight: 700; color: #1e293b; }
  .edu-sub { font-size: 10.5px; color: #64748b; font-style: italic; }
  .edu-date { font-size: 10px; color: ${accent}; }

  .footer { position: absolute; bottom: 16px; left: 36px; right: 36px; display: flex; justify-content: space-between; font-size: 8px; color: #cbd5e1; border-top: 0.5px solid #f1f5f9; padding-top: 8px; }
</style></head>
<body><div class="page">
  <div class="top-bar"></div>

  ${companyName ? `<div class="company-badge">
    ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}">` : ''}
    <div><div class="label">Speciaal voor</div><div class="name">${companyName}</div></div>
  </div>` : ''}

  <div class="header">
    <div class="header-left">
      <h1><b>Samba</b> Jarju</h1>
      <div class="subtitle">Marketing | Economie</div>
      <a class="linkedin" href="https://linkedin.com/in/sambajarju"><span class="badge">in</span> linkedin.com/in/sambajarju</a>
    </div>
    <div class="header-right">
      <div class="loc-label">Locatie</div>
      <div>Rotterdam</div>
      <div style="margin-top:10px">
        <a href="https://sambajarju.com">sambajarju.com</a><br>
        <span>sambajarju2@gmail.com</span>
      </div>
    </div>
  </div>

  ${contactName ? `<div class="greeting"><b>Hey ${contactName},</b> hierbij mijn CV. Naast mijn werk bij Vandebron werk ik als freelancer bij Cleanprofs.nl, waar ik Deployteq gebruik om geautomatiseerde email campagnes te bouwen.</div>` : ''}

  <div class="body">
    <div class="sidebar">
      <h3>Skills</h3>
      <ul>
        <li>(Sales) Research</li><li>Sales Automation</li><li>Email Marketing</li><li>Data Analytics</li>
        <li>(Technische) SEO</li><li>Marketing Automation</li><li>CRO</li><li>Web Development</li><li>SQL/AMPScript</li>
      </ul>

      <h3>Tools & Tech</h3>
      <div class="skill-cat">Sales</div>
      <ul><li>LinkedIn Sales Navigator</li><li>HubSpot / Pipedrive</li><li>Apollo</li><li>Salesforce</li></ul>
      <div class="skill-cat">Marketing</div>
      <ul><li>Google Analytics & co</li><li>SEMRush</li><li>Marketing Cloud</li><li>Zapier / Make</li><li>Zoho</li></ul>
      <div class="skill-cat">Development</div>
      <ul><li>Next.js / React</li><li>TypeScript</li><li>Supabase</li><li>Tailwind CSS</li><li>Vercel</li></ul>
      <div class="skill-cat">Overig</div>
      <ul><li>Figma</li><li>AMP emails</li><li>A/B testing (VWO)</li><li>Hotjar</li><li>WordPress</li></ul>

      <h3>Talen</h3>
      <ul><li>Nederlands</li><li>Engels</li></ul>

      <h3>Soft Skills</h3>
      <div class="soft-skills">
        <span class="pill">Ambitieus</span><span class="pill">Hands-on</span><span class="pill">Proactief</span>
        <span class="pill">Empathisch</span><span class="pill">Teamspeler</span><span class="pill">Ondernemend</span>
      </div>
    </div>

    <div class="main">
      <h2>Ervaring</h2>

      <div class="exp"><div class="exp-header"><span class="exp-company">Vandebron</span><span class="exp-date">April 2025 - heden</span></div>
      <div class="exp-role">Email Marketeer</div>
      <ul><li>SQL queries schrijven en documenteren</li><li>AMPScript voor complexe email campagnes</li><li>Project manager: 500k+ emails per maand</li><li>Monitoring en recap van alle email campagnes</li></ul></div>

      <div class="exp"><div class="exp-header"><span class="exp-company">Cleanprofs.nl</span><span class="exp-date">2025 - heden</span></div>
      <div class="exp-role">Freelance Deployteq Expert</div>
      <ul><li>Marketing automation campagnes in Deployteq</li><li>Geautomatiseerde email flows en segmentatie</li></ul></div>

      <div class="exp"><div class="exp-header"><span class="exp-company">Cordital</span><span class="exp-date">Jan 2023 - Nov 2024</span></div>
      <div class="exp-role">Freelance Marketeer</div>
      <ul><li>SEO, automations via Zoho, content creatie</li><li>AMP interactieve e-mails bouwen</li></ul></div>

      <div class="exp"><div class="exp-header"><span class="exp-company">Guardey</span><span class="exp-date">Feb 2023 - Okt 2023</span></div>
      <div class="exp-role">Content Marketing</div>
      <ul><li>Contentstrategie voor IT Partners, SEO optimalisatie</li><li>Copywriting: website, social media, marketingmateriaal</li></ul></div>

      <div class="exp"><div class="exp-header"><span class="exp-company">Silverflow (Stage)</span><span class="exp-date">Feb 2022 - Okt 2022</span></div>
      <div class="exp-role">Sales & Marketing</div>
      <ul><li>Pre-sales research B2B klanten</li><li>Salespipeline optimalisatie met Pipedrive</li><li>Contentmarketingplan met trendanalyse</li></ul></div>

      <div class="exp"><div class="exp-header"><span class="exp-company">Kes Visum</span><span class="exp-date">Jan 2020 - Jan 2025</span></div>
      <div class="exp-role">Marketing Lead</div>
      <ul><li>Leidde team van 4 marketingmedewerkers</li><li>4,4% conversie via social/display ads</li><li>80+ LinkedIn leads per maand voor sales</li><li>B2B outreach en campagne management</li></ul></div>

      <h2 style="margin-top:18px">Educatie</h2>
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <div><div class="edu-title">Rotterdam Business School (Hogeschool Rotterdam)</div><div class="edu-sub">Entrepreneurship - Bachelor of Arts</div></div>
        <span class="edu-date">2021 - 2025</span>
      </div>
      <ul style="list-style:disc;margin-left:16px;margin-top:6px"><li>Start-up prijs van het jaar (Fashionbot)</li><li>Workshops gegeven aan medestudenten</li></ul>
    </div>
  </div>

  <div class="footer"><span>Samba Jarju · KvK 83474889 · Rotterdam</span><span>sambajarju.com</span></div>
</div></body></html>`;
}

export async function GET(request: NextRequest) {
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

  const html = buildHTML(companyName, contactName, primary, secondary, logoUrl);

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1200, height: 1697 },
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  await browser.close();

  return new NextResponse(Buffer.from(pdf) as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="CV_Samba_Jarju${companyName ? `_${companyName}` : ''}.pdf"`,
    },
  });
}
