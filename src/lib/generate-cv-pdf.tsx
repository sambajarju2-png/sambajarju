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
    primary = '#023047',
    secondary = '#EF476F',
    logoUrl = '',
  } = opts;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; color: #1e293b; background: #fff; }
  .page { width: 210mm; height: 297mm; position: relative; overflow: hidden; }

  /* ===== HERO HEADER ===== */
  .hero {
    background: linear-gradient(135deg, ${primary} 0%, ${primary}dd 50%, ${primary}bb 100%);
    padding: 28px 36px 24px;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%);
  }
  .hero-content { position: relative; z-index: 1; }
  .hero-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .hero-name { font-size: 32pt; font-weight: 900; color: #fff; letter-spacing: -1px; line-height: 1; }
  .hero-name span { font-weight: 300; }
  .hero-role { font-size: 11pt; color: ${secondary}; font-weight: 600; margin-top: 4px; letter-spacing: 0.5px; }
  .hero-tagline { font-size: 8.5pt; color: rgba(255,255,255,0.6); margin-top: 3px; font-weight: 400; }

  ${companyName ? `
  .company-card {
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 10px;
    padding: 10px 14px;
    display: flex; align-items: center; gap: 10px;
    max-width: 200px;
  }
  .company-card img { width: 28px; height: 28px; border-radius: 6px; background: #fff; padding: 2px; }
  .company-card-label { font-size: 6.5pt; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .company-card-name { font-size: 10pt; color: #fff; font-weight: 700; }` : ''}

  .hero-contact {
    display: flex; gap: 16px; margin-top: 14px;
    padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);
  }
  .hero-contact-item { font-size: 7.5pt; color: rgba(255,255,255,0.7); }
  .hero-contact-item a { color: ${secondary}; text-decoration: none; font-weight: 600; }
  .hero-contact-item strong { color: #fff; font-weight: 600; }

  ${contactName ? `
  .greeting-strip {
    background: ${secondary};
    padding: 8px 36px;
    font-size: 8.5pt;
    color: #fff;
    font-weight: 500;
  }
  .greeting-strip strong { font-weight: 700; }` : ''}

  /* ===== BODY ===== */
  .body { display: flex; height: calc(297mm - ${contactName ? '155px' : '130px'}); }

  /* ===== SIDEBAR ===== */
  .sidebar {
    width: 175px;
    background: #f8fafc;
    padding: 20px 18px;
    border-right: 1px solid #f1f5f9;
    flex-shrink: 0;
  }
  .side-section { margin-bottom: 14px; }
  .side-title {
    font-size: 7pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: ${primary};
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 2px solid ${secondary};
    display: inline-block;
  }
  .side-cat { font-size: 6.5pt; font-weight: 700; color: ${secondary}; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 7px; margin-bottom: 2px; }
  .side-item { font-size: 7.5pt; color: #475569; margin-bottom: 1px; padding-left: 8px; position: relative; }
  .side-item::before { content: '›'; position: absolute; left: 0; color: ${secondary}; font-weight: 700; }
  .pills { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 4px; }
  .pill {
    font-size: 6.5pt;
    color: ${primary};
    background: ${primary}0d;
    border: 1px solid ${primary}20;
    border-radius: 99px;
    padding: 2px 8px;
    font-weight: 600;
  }

  /* ===== MAIN ===== */
  .main { flex: 1; padding: 20px 24px; }
  .main-title {
    font-size: 9pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: ${primary};
    margin-bottom: 10px;
    padding-bottom: 4px;
    border-bottom: 2px solid ${secondary};
    display: inline-block;
  }

  /* Experience */
  .exp { margin-bottom: 11px; position: relative; padding-left: 14px; }
  .exp::before {
    content: '';
    position: absolute;
    left: 0; top: 6px;
    width: 6px; height: 6px;
    background: ${secondary};
    border-radius: 50%;
  }
  .exp::after {
    content: '';
    position: absolute;
    left: 2.5px; top: 14px; bottom: -4px;
    width: 1px;
    background: #e2e8f0;
  }
  .exp:last-of-type::after { display: none; }
  .exp-top { display: flex; justify-content: space-between; align-items: baseline; }
  .exp-company { font-size: 10pt; font-weight: 800; color: #0f172a; }
  .exp-date {
    font-size: 7pt;
    color: ${primary};
    font-weight: 700;
    background: ${primary}0a;
    padding: 2px 8px;
    border-radius: 99px;
    white-space: nowrap;
  }
  .exp-role { font-size: 8pt; font-weight: 600; color: ${secondary}; margin: 1px 0 3px; }
  .exp-bullet { font-size: 7.5pt; color: #475569; line-height: 1.5; }

  /* Education */
  .edu-section { margin-top: 14px; }
  .edu { padding-left: 14px; position: relative; }
  .edu::before {
    content: '';
    position: absolute;
    left: 0; top: 6px;
    width: 6px; height: 6px;
    background: ${secondary};
    border-radius: 2px;
  }
  .edu-school { font-size: 10pt; font-weight: 800; color: #0f172a; }
  .edu-degree { font-size: 8pt; color: #64748b; font-weight: 500; }
  .edu-highlights { font-size: 7.5pt; color: #475569; margin-top: 2px; }

  /* ===== FOOTER ===== */
  .footer-bar {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: ${primary};
    padding: 8px 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer-bar span { font-size: 6.5pt; color: rgba(255,255,255,0.5); }
  .footer-bar a { color: ${secondary}; text-decoration: none; font-weight: 600; font-size: 6.5pt; }
</style>
</head>
<body>
<div class="page">

  <!-- HERO -->
  <div class="hero">
    <div class="hero-content">
      <div class="hero-top">
        <div>
          <div class="hero-name">Samba <span>Jarju</span></div>
          <div class="hero-role">Email Marketeer & Marketing Automation Specialist</div>
          <div class="hero-tagline">Creativiteit ontmoet strategie — data-driven marketing die impact maakt</div>
        </div>
        ${companyName ? `
        <div class="company-card">
          ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" />` : ''}
          <div>
            <div class="company-card-label">Speciaal voor</div>
            <div class="company-card-name">${companyName}</div>
          </div>
        </div>` : ''}
      </div>
      <div class="hero-contact">
        <div class="hero-contact-item"><strong>Rotterdam</strong>, NL</div>
        <div class="hero-contact-item"><a href="https://sambajarju.com">sambajarju.com</a></div>
        <div class="hero-contact-item"><a href="https://linkedin.com/in/sambajarju">linkedin.com/in/sambajarju</a></div>
        <div class="hero-contact-item">sambajarju2@gmail.com</div>
        <div class="hero-contact-item">+31 6 87975656</div>
      </div>
    </div>
  </div>

  ${contactName ? `
  <div class="greeting-strip">
    <strong>Hey ${contactName}</strong> — hierbij mijn CV. Naast mijn werk bij Vandebron werk ik als freelancer bij Cleanprofs.nl met Deployteq voor geautomatiseerde email campagnes.
  </div>` : ''}

  <!-- BODY -->
  <div class="body">

    <!-- SIDEBAR -->
    <div class="sidebar">
      <div class="side-section">
        <div class="side-title">Skills</div>
        ${['Email Marketing','Marketing Automation','SQL / AMPScript','Data Analytics','(Technische) SEO','CRO & A/B Testing','Sales Research','Sales Automation'].map(s => `<div class="side-item">${s}</div>`).join('')}
      </div>

      <div class="side-section">
        <div class="side-title">Tools & Tech</div>
        <div class="side-cat">Email & Marketing</div>
        ${['Salesforce Marketing Cloud','Deployteq','HubSpot','Mailchimp'].map(s => `<div class="side-item">${s}</div>`).join('')}
        <div class="side-cat">Analytics & CRO</div>
        ${['Google Analytics','SEMRush','Hotjar','VWO'].map(s => `<div class="side-item">${s}</div>`).join('')}
        <div class="side-cat">CRM & Sales</div>
        ${['Salesforce','Apollo.io','Pipedrive'].map(s => `<div class="side-item">${s}</div>`).join('')}
        <div class="side-cat">Development</div>
        ${['Next.js / React','TypeScript','Supabase','Tailwind CSS','Vercel'].map(s => `<div class="side-item">${s}</div>`).join('')}
        <div class="side-cat">Automation</div>
        ${['Zapier','Make (Integromat)'].map(s => `<div class="side-item">${s}</div>`).join('')}
      </div>

      <div class="side-section">
        <div class="side-title">Talen</div>
        <div class="side-item">Nederlands (moedertaal)</div>
        <div class="side-item">Engels (vloeiend)</div>
      </div>

      <div class="side-section">
        <div class="side-title">Soft Skills</div>
        <div class="pills">
          ${['Ambitieus','Hands-on','Proactief','Empathisch','Teamspeler','Ondernemend','Data-driven'].map(s => `<span class="pill">${s}</span>`).join('')}
        </div>
      </div>
    </div>

    <!-- MAIN -->
    <div class="main">
      <div class="main-title">Werkervaring</div>

      <div class="exp">
        <div class="exp-top">
          <span class="exp-company">Vandebron</span>
          <span class="exp-date">Apr 2025 – heden</span>
        </div>
        <div class="exp-role">Email Marketeer</div>
        <div class="exp-bullet">SQL queries schrijven en documenteren voor data-driven campagnes. Complexe AMPScript email campagnes bouwen in Salesforce Marketing Cloud. Projectmanager voor 500k+ emails per maand. Monitoring, analyse en recap van alle campagnes.</div>
      </div>

      <div class="exp">
        <div class="exp-top">
          <span class="exp-company">Cleanprofs.nl</span>
          <span class="exp-date">2025 – heden</span>
        </div>
        <div class="exp-role">Freelance Deployteq Expert</div>
        <div class="exp-bullet">Marketing automation campagnes opzetten in Deployteq. Geautomatiseerde email flows, segmentatie en data-integraties bouwen.</div>
      </div>

      <div class="exp">
        <div class="exp-top">
          <span class="exp-company">Cordital</span>
          <span class="exp-date">Jan 2023 – Nov 2024</span>
        </div>
        <div class="exp-role">Freelance Marketeer</div>
        <div class="exp-bullet">SEO-strategie, marketing automations via Zoho, content creatie. AMP interactieve e-mails bouwen voor hogere engagement.</div>
      </div>

      <div class="exp">
        <div class="exp-top">
          <span class="exp-company">Guardey</span>
          <span class="exp-date">Feb 2023 – Okt 2023</span>
        </div>
        <div class="exp-role">Content Marketing</div>
        <div class="exp-bullet">Contentstrategie voor IT Partners en technische SEO. Copywriting voor website, social media en marketingcampagnes.</div>
      </div>

      <div class="exp">
        <div class="exp-top">
          <span class="exp-company">Silverflow</span>
          <span class="exp-date">Feb 2022 – Okt 2022</span>
        </div>
        <div class="exp-role">Sales & Marketing Stage</div>
        <div class="exp-bullet">Pre-sales research voor B2B klanten in de payments sector. Salespipeline opgebouwd met Pipedrive. Contentmarketingplan ontwikkeld met trendanalyse.</div>
      </div>

      <div class="exp">
        <div class="exp-top">
          <span class="exp-company">Kes Visum</span>
          <span class="exp-date">2020 – 2025</span>
        </div>
        <div class="exp-role">Marketing Lead</div>
        <div class="exp-bullet">Team van 4 marketingmedewerkers aangestuurd. 4,4% conversie gerealiseerd via social en display ads. 80+ LinkedIn leads per maand gegenereerd.</div>
      </div>

      <div class="edu-section">
        <div class="main-title">Educatie</div>
        <div class="edu">
          <div class="edu-school">Hogeschool Rotterdam</div>
          <div class="edu-degree">Entrepreneurship — Bachelor of Arts · 2021 – 2025</div>
          <div class="edu-highlights">🏆 Start-up prijs van het jaar (Fashionbot) · Workshops gegeven aan medestudenten</div>
        </div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer-bar">
    <span>Samba Jarju · KvK 83474889 · Rotterdam</span>
    <a href="https://sambajarju.com">sambajarju.com</a>
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
      wait: { for: 'navigation', timeout: 3000, waitUntil: 'networkidle0' },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`YakPDF error ${response.status}: ${text}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
