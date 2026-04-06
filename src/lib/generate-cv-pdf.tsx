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

  // Lighter shade of primary for backgrounds
  const primaryLight = primary + '12';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; width: 210mm; height: 297mm; overflow: hidden; }
  .page { width: 210mm; height: 297mm; display: flex; }

  /* ===== LEFT PANEL ===== */
  .left {
    width: 72mm;
    height: 297mm;
    background: ${primary};
    color: #fff;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
  .left::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
    border-radius: 50%;
  }
  .left::after {
    content: '';
    position: absolute;
    bottom: -30px; left: -30px;
    width: 150px; height: 150px;
    background: radial-gradient(circle, ${secondary}22 0%, transparent 70%);
    border-radius: 50%;
  }

  /* Profile section */
  .profile {
    padding: 28px 22px 20px;
    text-align: center;
    position: relative;
    z-index: 1;
  }
  .avatar {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${secondary}, ${secondary}bb);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 12px;
    font-size: 28px; font-weight: 900; color: #fff;
    letter-spacing: -1px;
    border: 3px solid rgba(255,255,255,0.2);
  }
  .profile-name { font-size: 18pt; font-weight: 800; letter-spacing: -0.5px; line-height: 1.1; }
  .profile-role { font-size: 7.5pt; color: ${secondary}; font-weight: 600; margin-top: 4px; letter-spacing: 0.3px; }
  .profile-sub { font-size: 6.5pt; color: rgba(255,255,255,0.45); margin-top: 2px; }

  /* Contact strip */
  .contact-strip {
    background: rgba(0,0,0,0.15);
    padding: 10px 22px;
    position: relative; z-index: 1;
  }
  .contact-item { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
  .contact-icon {
    width: 18px; height: 18px;
    background: ${secondary};
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 8px; font-weight: 800; color: #fff; flex-shrink: 0;
  }
  .contact-text { font-size: 7pt; color: rgba(255,255,255,0.8); }
  .contact-text a { color: ${secondary}; text-decoration: none; font-weight: 600; }

  /* Left sections */
  .left-section {
    padding: 12px 22px 0;
    position: relative; z-index: 1;
  }
  .left-title {
    font-size: 7pt; font-weight: 800;
    text-transform: uppercase; letter-spacing: 2px;
    color: ${secondary};
    margin-bottom: 8px;
    display: flex; align-items: center; gap: 6px;
  }
  .left-title::after {
    content: '';
    flex: 1; height: 1px;
    background: rgba(255,255,255,0.1);
  }

  /* Skill bars */
  .skill-bar-item { margin-bottom: 6px; }
  .skill-bar-label { font-size: 7pt; color: rgba(255,255,255,0.8); margin-bottom: 2px; font-weight: 500; }
  .skill-bar-track { height: 4px; background: rgba(255,255,255,0.1); border-radius: 99px; overflow: hidden; }
  .skill-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${secondary}, ${secondary}aa); }

  /* Tool tags */
  .tool-group { margin-bottom: 8px; }
  .tool-group-label { font-size: 6pt; font-weight: 700; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
  .tool-tags { display: flex; flex-wrap: wrap; gap: 3px; }
  .tool-tag {
    font-size: 6pt; font-weight: 600;
    padding: 2px 7px;
    border-radius: 99px;
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.7);
    border: 0.5px solid rgba(255,255,255,0.1);
  }

  /* Language */
  .lang-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .lang-name { font-size: 7.5pt; color: rgba(255,255,255,0.8); }
  .lang-dots { display: flex; gap: 3px; }
  .lang-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.15); }
  .lang-dot.filled { background: ${secondary}; }

  /* Soft skills */
  .soft-pills { display: flex; flex-wrap: wrap; gap: 3px; }
  .soft-pill {
    font-size: 6.5pt; font-weight: 600;
    padding: 3px 8px; border-radius: 99px;
    background: ${secondary}20;
    color: ${secondary};
    border: 0.5px solid ${secondary}40;
  }

  /* ===== RIGHT PANEL ===== */
  .right {
    flex: 1;
    padding: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
  }

  ${companyName ? `
  /* Company banner */
  .company-banner {
    background: linear-gradient(135deg, ${primaryLight}, ${primary}08);
    padding: 12px 24px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 2px solid ${primary}15;
  }
  .company-banner-left { display: flex; align-items: center; gap: 10px; }
  .company-banner-logo {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: #fff;
    border: 1px solid ${primary}15;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .company-banner-logo img { width: 24px; height: 24px; object-fit: contain; }
  .company-banner-label { font-size: 6pt; color: ${primary}80; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .company-banner-name { font-size: 11pt; color: ${primary}; font-weight: 800; }
  .company-banner-badge {
    font-size: 6.5pt; font-weight: 700;
    padding: 4px 10px; border-radius: 99px;
    background: ${secondary}; color: #fff;
  }` : ''}

  ${contactName ? `
  .greeting {
    padding: 10px 24px;
    font-size: 8pt; color: #475569; line-height: 1.5;
    border-bottom: 1px solid #f1f5f9;
    background: #fafbfc;
  }
  .greeting strong { color: ${primary}; font-weight: 700; }` : ''}

  /* Right body */
  .right-body { padding: 16px 24px; flex: 1; }

  .right-title {
    font-size: 8pt; font-weight: 800;
    text-transform: uppercase; letter-spacing: 2px;
    color: ${primary};
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .right-title::before {
    content: '';
    width: 16px; height: 3px;
    background: ${secondary};
    border-radius: 99px;
  }

  /* Experience cards */
  .exp-card {
    padding: 10px 14px;
    margin-bottom: 8px;
    border-radius: 8px;
    border: 1px solid #f1f5f9;
    background: #fafbfc;
    position: relative;
    transition: all 0.2s;
  }
  .exp-card::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: ${secondary};
    border-radius: 3px 0 0 3px;
  }
  .exp-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .exp-company { font-size: 10pt; font-weight: 800; color: #0f172a; }
  .exp-date {
    font-size: 6.5pt; font-weight: 700;
    padding: 3px 8px; border-radius: 99px;
    background: ${primary}; color: #fff;
    white-space: nowrap;
  }
  .exp-role { font-size: 7.5pt; font-weight: 600; color: ${secondary}; margin: 2px 0 4px; }
  .exp-desc { font-size: 7pt; color: #64748b; line-height: 1.6; }
  .exp-tags { display: flex; gap: 3px; margin-top: 4px; flex-wrap: wrap; }
  .exp-tag {
    font-size: 5.5pt; font-weight: 600;
    padding: 2px 6px; border-radius: 99px;
    background: ${primary}0a; color: ${primary};
    border: 0.5px solid ${primary}20;
  }

  /* Education */
  .edu-card {
    padding: 10px 14px;
    border-radius: 8px;
    background: linear-gradient(135deg, ${primary}08, ${secondary}08);
    border: 1px solid ${primary}12;
  }
  .edu-school { font-size: 10pt; font-weight: 800; color: #0f172a; }
  .edu-degree { font-size: 7.5pt; color: #64748b; font-weight: 500; }
  .edu-highlight { font-size: 7pt; color: ${secondary}; font-weight: 600; margin-top: 3px; }

  /* Footer */
  .right-footer {
    padding: 6px 24px;
    border-top: 1px solid #f1f5f9;
    display: flex; justify-content: space-between;
    font-size: 6pt; color: #94a3b8;
  }
  .right-footer a { color: ${secondary}; text-decoration: none; font-weight: 600; }
</style>
</head>
<body>
<div class="page">

  <!-- LEFT PANEL -->
  <div class="left">
    <div class="profile">
      <div class="avatar">SJ</div>
      <div class="profile-name">Samba Jarju</div>
      <div class="profile-role">Email Marketeer</div>
      <div class="profile-sub">Marketing Automation Specialist</div>
    </div>

    <div class="contact-strip">
      <div class="contact-item">
        <div class="contact-icon">📍</div>
        <div class="contact-text">Rotterdam, Nederland</div>
      </div>
      <div class="contact-item">
        <div class="contact-icon">🌐</div>
        <div class="contact-text"><a href="https://sambajarju.com">sambajarju.com</a></div>
      </div>
      <div class="contact-item">
        <div class="contact-icon">in</div>
        <div class="contact-text"><a href="https://linkedin.com/in/sambajarju">linkedin.com/in/sambajarju</a></div>
      </div>
      <div class="contact-item">
        <div class="contact-icon">✉</div>
        <div class="contact-text">sambajarju2@gmail.com</div>
      </div>
      <div class="contact-item">
        <div class="contact-icon">📞</div>
        <div class="contact-text">+31 6 87975656</div>
      </div>
    </div>

    <div class="left-section">
      <div class="left-title">Expertise</div>
      ${[
        ['Email Marketing', 95],
        ['Marketing Automation', 90],
        ['SQL / AMPScript', 85],
        ['Data Analytics', 80],
        ['SEO & CRO', 85],
        ['Sales Automation', 75],
      ].map(([name, pct]) => `
      <div class="skill-bar-item">
        <div class="skill-bar-label">${name}</div>
        <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${pct}%"></div></div>
      </div>`).join('')}
    </div>

    <div class="left-section">
      <div class="left-title">Tools</div>
      <div class="tool-group">
        <div class="tool-group-label">Email & Marketing</div>
        <div class="tool-tags">
          ${['SFMC','Deployteq','HubSpot','Mailchimp','Resend'].map(t => `<span class="tool-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="tool-group">
        <div class="tool-group-label">Analytics & CRO</div>
        <div class="tool-tags">
          ${['GA4','SEMRush','Hotjar','VWO'].map(t => `<span class="tool-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="tool-group">
        <div class="tool-group-label">Development</div>
        <div class="tool-tags">
          ${['Next.js','React','TypeScript','Tailwind','Supabase','Vercel'].map(t => `<span class="tool-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="tool-group">
        <div class="tool-group-label">CRM & Automation</div>
        <div class="tool-tags">
          ${['Salesforce','Apollo','Pipedrive','Zapier','Make'].map(t => `<span class="tool-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>

    <div class="left-section">
      <div class="left-title">Talen</div>
      <div class="lang-item">
        <span class="lang-name">Nederlands</span>
        <div class="lang-dots">${'<div class="lang-dot filled"></div>'.repeat(5)}</div>
      </div>
      <div class="lang-item">
        <span class="lang-name">Engels</span>
        <div class="lang-dots">${'<div class="lang-dot filled"></div>'.repeat(4)}<div class="lang-dot"></div></div>
      </div>
    </div>

    <div class="left-section" style="padding-bottom: 20px;">
      <div class="left-title">Soft Skills</div>
      <div class="soft-pills">
        ${['Ambitieus','Hands-on','Proactief','Empathisch','Teamspeler','Ondernemend','Data-driven'].map(s => `<span class="soft-pill">${s}</span>`).join('')}
      </div>
    </div>
  </div>

  <!-- RIGHT PANEL -->
  <div class="right">

    ${companyName ? `
    <div class="company-banner">
      <div class="company-banner-left">
        ${logoUrl ? `<div class="company-banner-logo"><img src="${logoUrl}" alt="${companyName}" /></div>` : ''}
        <div>
          <div class="company-banner-label">Gemaakt voor</div>
          <div class="company-banner-name">${companyName}</div>
        </div>
      </div>
      <div class="company-banner-badge">Persoonlijk CV</div>
    </div>` : ''}

    ${contactName ? `
    <div class="greeting">
      <strong>Hey ${contactName}</strong> — hierbij mijn CV. Naast mijn werk bij Vandebron werk ik als freelancer bij Cleanprofs.nl, waar ik Deployteq gebruik voor geautomatiseerde email campagnes.
    </div>` : ''}

    <div class="right-body">
      <div class="right-title">Werkervaring</div>

      <div class="exp-card">
        <div class="exp-top">
          <span class="exp-company">Vandebron</span>
          <span class="exp-date">Apr 2025 – heden</span>
        </div>
        <div class="exp-role">Email Marketeer</div>
        <div class="exp-desc">SQL queries schrijven en documenteren voor data-driven campagnes. Complexe AMPScript email campagnes bouwen in Salesforce Marketing Cloud. Projectmanager voor 500.000+ emails per maand.</div>
        <div class="exp-tags"><span class="exp-tag">SQL</span><span class="exp-tag">AMPScript</span><span class="exp-tag">SFMC</span><span class="exp-tag">500k+ emails/mo</span></div>
      </div>

      <div class="exp-card">
        <div class="exp-top">
          <span class="exp-company">Cleanprofs.nl</span>
          <span class="exp-date">2025 – heden</span>
        </div>
        <div class="exp-role">Freelance Deployteq Expert</div>
        <div class="exp-desc">Marketing automation campagnes opzetten in Deployteq. Geautomatiseerde email flows, segmentatie en data-integraties.</div>
        <div class="exp-tags"><span class="exp-tag">Deployteq</span><span class="exp-tag">Automation</span><span class="exp-tag">Segmentatie</span></div>
      </div>

      <div class="exp-card">
        <div class="exp-top">
          <span class="exp-company">Cordital</span>
          <span class="exp-date">Jan 2023 – Nov 2024</span>
        </div>
        <div class="exp-role">Freelance Marketeer</div>
        <div class="exp-desc">SEO-strategie, marketing automations via Zoho en AMP interactieve e-mails voor hogere engagement.</div>
        <div class="exp-tags"><span class="exp-tag">SEO</span><span class="exp-tag">Zoho</span><span class="exp-tag">AMP Email</span></div>
      </div>

      <div class="exp-card">
        <div class="exp-top">
          <span class="exp-company">Guardey</span>
          <span class="exp-date">Feb 2023 – Okt 2023</span>
        </div>
        <div class="exp-role">Content Marketing</div>
        <div class="exp-desc">Contentstrategie voor IT Partners. Technische SEO, copywriting voor website en social media.</div>
        <div class="exp-tags"><span class="exp-tag">Content</span><span class="exp-tag">IT Security</span><span class="exp-tag">SEO</span></div>
      </div>

      <div class="exp-card">
        <div class="exp-top">
          <span class="exp-company">Silverflow</span>
          <span class="exp-date">Feb 2022 – Okt 2022</span>
        </div>
        <div class="exp-role">Sales & Marketing Stage</div>
        <div class="exp-desc">Pre-sales research B2B payments. Salespipeline met Pipedrive. Contentmarketingplan met trendanalyse.</div>
        <div class="exp-tags"><span class="exp-tag">B2B</span><span class="exp-tag">Pipedrive</span><span class="exp-tag">Payments</span></div>
      </div>

      <div class="exp-card">
        <div class="exp-top">
          <span class="exp-company">Kes Visum</span>
          <span class="exp-date">2020 – 2025</span>
        </div>
        <div class="exp-role">Marketing Lead</div>
        <div class="exp-desc">Team van 4 aangestuurd. 4,4% conversie via social/display ads. 80+ LinkedIn leads per maand.</div>
        <div class="exp-tags"><span class="exp-tag">Team Lead</span><span class="exp-tag">4.4% CVR</span><span class="exp-tag">80+ leads/mo</span></div>
      </div>

      <div style="margin-top: 14px;">
        <div class="right-title">Educatie</div>
        <div class="edu-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div class="edu-school">Hogeschool Rotterdam</div>
              <div class="edu-degree">Entrepreneurship — Bachelor of Arts · 2021 – 2025</div>
            </div>
            <span class="exp-date" style="font-size: 6pt;">2021 – 2025</span>
          </div>
          <div class="edu-highlight">🏆 Start-up prijs van het jaar (Fashionbot) · Workshops gegeven aan medestudenten</div>
        </div>
      </div>
    </div>

    <div class="right-footer">
      <span>Samba Jarju · KvK 83474889 · Rotterdam</span>
      <a href="https://sambajarju.com">sambajarju.com</a>
    </div>
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
