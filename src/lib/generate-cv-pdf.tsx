export interface GenerateCVOptions {
  companyDomain?: string;
  contactName?: string;
  companyName?: string;
  primary?: string;
  secondary?: string;
  logoUrl?: string;
}

function buildCVHtml(opts: GenerateCVOptions): string {
  const {
    companyName = '',
    contactName = '',
    primary = '#2563EB',
    secondary = primary,
    logoUrl = '',
  } = opts;

  const experience = [
    { company: 'Vandebron', period: 'April 2025 - heden', role: 'Email Marketeer', bullets: ['SQL queries schrijven en documenteren', 'AMPScript voor complexe email campagnes', 'Project manager: 500k+ emails per maand', 'Monitoring en recap van alle campagnes'] },
    { company: 'Cleanprofs.nl', period: '2025 - heden', role: 'Freelance Deployteq Expert', bullets: ['Marketing automation campagnes in Deployteq', 'Geautomatiseerde email flows en segmentatie'] },
    { company: 'Cordital', period: 'Jan 2023 - Nov 2024', role: 'Freelance Marketeer', bullets: ['SEO, automations via Zoho, content creatie', 'AMP interactieve e-mails bouwen'] },
    { company: 'Guardey', period: 'Feb 2023 - Okt 2023', role: 'Content Marketing', bullets: ['Contentstrategie voor IT Partners, SEO', 'Copywriting: website, social, marketing'] },
    { company: 'Silverflow (Stage)', period: 'Feb 2022 - Okt 2022', role: 'Sales & Marketing', bullets: ['Pre-sales research B2B klanten', 'Salespipeline met Pipedrive', 'Contentmarketingplan met trendanalyse'] },
    { company: 'Kes Visum', period: 'Jan 2020 - Jan 2025', role: 'Marketing Lead', bullets: ['Team van 4 marketingmedewerkers', '4,4% conversie via social/display ads', '80+ LinkedIn leads per maand'] },
  ];

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, sans-serif; font-size: 9.5pt; color: #334155; }
  .page { width: 210mm; min-height: 297mm; position: relative; padding-bottom: 40px; }
  .top-bar { height: 5px; background: ${primary}; }
  .header { display: flex; justify-content: space-between; padding: 20px 32px 16px; }
  .name-bold { font-size: 26pt; font-weight: 800; color: #1e293b; }
  .name-light { font-size: 26pt; font-weight: 300; color: #1e293b; }
  .subtitle { font-size: 12pt; color: #94a3b8; margin-top: 2px; }
  .linkedin-row { display: flex; align-items: center; gap: 5px; margin-top: 8px; }
  .linkedin-badge { background: ${primary}; color: #fff; font-size: 7pt; font-weight: 700; padding: 1px 4px; border-radius: 2px; }
  .linkedin-text { color: ${primary}; font-size: 9pt; text-decoration: none; }
  .right-block { text-align: right; }
  .company-badge { display: inline-flex; align-items: center; gap: 8px; background: ${primary}10; border-radius: 6px; padding: 5px 10px; margin-bottom: 4px; }
  .company-badge img { width: 22px; height: 22px; object-fit: contain; }
  .company-label { font-size: 7pt; color: ${primary}; font-weight: 600; }
  .company-name { font-size: 10pt; color: ${primary}; font-weight: 700; }
  .contact-block { font-size: 9pt; color: #64748b; }
  .contact-block .label { font-weight: 700; color: #334155; }
  .contact-block a { color: ${primary}; text-decoration: none; }
  .greeting-box { margin: 0 32px 12px; padding: 8px 12px; background: ${primary}08; border-left: 3px solid ${primary}; border-radius: 4px; }
  .greeting-bold { font-weight: 700; color: ${primary}; }
  .greeting-text { font-size: 9pt; color: #475569; line-height: 1.6; }
  .body { display: flex; padding: 0 32px; gap: 20px; }
  .sidebar { width: 150px; flex-shrink: 0; }
  .main { flex: 1; }
  .section-title { font-size: 10pt; font-weight: 700; color: ${primary}; margin-bottom: 6px; margin-top: 14px; padding-bottom: 3px; border-bottom: 0.5px solid #f1f5f9; }
  .section-title.first { margin-top: 0; }
  .cat-label { font-size: 7pt; font-weight: 700; color: ${secondary}; margin-top: 8px; margin-bottom: 2px; text-transform: uppercase; }
  .skill-item { font-size: 8.5pt; color: #64748b; margin-bottom: 1.5px; }
  .pills { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 3px; }
  .pill { font-size: 7.5pt; color: ${primary}; background: ${primary}12; border-radius: 99px; padding: 2px 7px; font-weight: 600; }
  .exp-block { margin-bottom: 10px; }
  .exp-header { display: flex; justify-content: space-between; align-items: center; }
  .exp-company { font-size: 11pt; font-weight: 700; color: #1e293b; }
  .exp-date { font-size: 8pt; color: ${primary}; font-weight: 600; }
  .exp-role { font-size: 9pt; font-weight: 600; color: #64748b; font-style: italic; margin: 1px 0 3px; }
  .bullet { font-size: 8.5pt; color: #475569; margin-bottom: 1px; padding-left: 8px; }
  .big-section { font-size: 16pt; font-weight: 300; color: #94a3b8; border-bottom: none; }
  .edu-row { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
  .edu-title { font-size: 11pt; font-weight: 700; color: #1e293b; }
  .edu-sub { font-size: 9pt; color: #64748b; font-style: italic; margin-top: 1px; }
  .edu-date { font-size: 8pt; color: ${primary}; font-weight: 600; }
  .footer { position: absolute; bottom: 14px; left: 32px; right: 32px; display: flex; justify-content: space-between; font-size: 7pt; color: #cbd5e1; border-top: 0.5px solid #f1f5f9; padding-top: 6px; }
</style>
</head>
<body>
<div class="page">
  <div class="top-bar"></div>
  <div class="header">
    <div>
      <div><span class="name-bold">Samba</span><span class="name-light"> Jarju</span></div>
      <div class="subtitle">Marketing | Economie</div>
      <div class="linkedin-row">
        <span class="linkedin-badge">in</span>
        <a href="https://linkedin.com/in/sambajarju" class="linkedin-text">linkedin.com/in/sambajarju</a>
      </div>
    </div>
    <div class="right-block">
      ${companyName ? `
      <div class="company-badge">
        ${logoUrl ? `<img src="${logoUrl}" />` : ''}
        <div>
          <div class="company-label">SPECIAAL VOOR</div>
          <div class="company-name">${companyName}</div>
        </div>
      </div>` : ''}
      <div class="contact-block">
        <div class="label">Locatie</div>
        <div>Rotterdam</div>
        <div style="margin-top:6px"></div>
        <a href="https://sambajarju.com">sambajarju.com</a>
        <div>sambajarju2@gmail.com</div>
      </div>
    </div>
  </div>

  ${contactName ? `
  <div class="greeting-box">
    <div class="greeting-text">
      <span class="greeting-bold">Hey ${contactName}, </span>
      hierbij mijn CV. Naast mijn werk bij Vandebron werk ik als freelancer bij Cleanprofs.nl, waar ik Deployteq gebruik voor geautomatiseerde email campagnes.
    </div>
  </div>` : ''}

  <div class="body">
    <div class="sidebar">
      <div class="section-title first">Skills</div>
      ${['(Sales) Research','Sales Automation','Email Marketing','Data Analytics','(Technische) SEO','Marketing Automation','CRO','SQL/AMPScript'].map(s => `<div class="skill-item">• ${s}</div>`).join('')}

      <div class="section-title">Tools & Tech</div>
      <div class="cat-label">SALES</div>
      ${['LinkedIn Sales Navigator','HubSpot / Pipedrive','Apollo','Salesforce'].map(s => `<div class="skill-item">• ${s}</div>`).join('')}
      <div class="cat-label">MARKETING</div>
      ${['Google Analytics','SEMRush','Marketing Cloud','Zapier / Make'].map(s => `<div class="skill-item">• ${s}</div>`).join('')}
      <div class="cat-label">DEVELOPMENT</div>
      ${['Next.js / React','TypeScript','Supabase','Tailwind CSS'].map(s => `<div class="skill-item">• ${s}</div>`).join('')}

      <div class="section-title">Talen</div>
      <div class="skill-item">• Nederlands</div>
      <div class="skill-item">• Engels</div>

      <div class="section-title">Soft Skills</div>
      <div class="pills">
        ${['Ambitieus','Hands-on','Proactief','Empathisch','Teamspeler','Ondernemend'].map(s => `<span class="pill">${s}</span>`).join('')}
      </div>
    </div>

    <div class="main">
      <div class="section-title first big-section">Ervaring</div>
      ${experience.map(exp => `
      <div class="exp-block">
        <div class="exp-header">
          <span class="exp-company">${exp.company}</span>
          <span class="exp-date">${exp.period}</span>
        </div>
        <div class="exp-role">${exp.role}</div>
        ${exp.bullets.map(b => `<div class="bullet">• ${b}</div>`).join('')}
      </div>`).join('')}

      <div class="section-title big-section" style="margin-top:12px">Educatie</div>
      <div class="edu-row">
        <div>
          <div class="edu-title">Hogeschool Rotterdam</div>
          <div class="edu-sub">Entrepreneurship - Bachelor of Arts</div>
        </div>
        <span class="edu-date">2021 - 2025</span>
      </div>
      <div class="bullet" style="margin-top:4px">• Start-up prijs van het jaar (Fashionbot)</div>
      <div class="bullet">• Workshops gegeven aan medestudenten</div>
    </div>
  </div>

  <div class="footer">
    <span>Samba Jarju · KvK 83474889 · Rotterdam</span>
    <span>sambajarju.com</span>
  </div>
</div>
</body>
</html>`;
}

export async function generateCVBuffer(opts: GenerateCVOptions): Promise<Buffer> {
  const html = buildCVHtml(opts);

  const apiKey = process.env.YAKPDF_API_KEY;
  if (!apiKey) {
    throw new Error('YAKPDF_API_KEY not configured');
  }

  const response = await fetch('https://yakpdf.p.rapidapi.com/pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'yakpdf.p.rapidapi.com',
    },
    body: JSON.stringify({
      pdf: {
        format: 'A4',
        printBackground: true,
        scale: 1,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      },
      source: { html },
      wait: { for: 'navigation', timeout: 2500, waitUntil: 'networkidle0' },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`YakPDF error ${response.status}: ${text}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
