import { safeBrandColors } from './color-utils';

export interface GenerateCVOptions {
  companyDomain?: string;
  contactName?: string;
  companyName?: string;
  primary?: string;
  secondary?: string;
  logoUrl?: string;
  photoUrl?: string;
  language?: 'nl' | 'en';
}

const PHOTO_URL = process.env.CV_PHOTO_URL || 'https://znktohqimzhwoujxzkds.supabase.co/storage/v1/object/public/Profile%20pic/Zonder%20titel%20(400%20x%20400%20px).png';

const content = {
  nl: {
    role: 'Email Marketeer',
    roleDetail: 'Marketing Automation Specialist',
    tagline: 'Creativiteit ontmoet strategie',
    madeFor: 'Gemaakt voor',
    personalCv: 'Persoonlijk CV',
    greeting: (name: string) => `Hey ${name} — hierbij mijn CV. Naast mijn werk bij Vandebron werk ik als freelancer bij Cleanprofs.nl, waar ik Deployteq gebruik voor geautomatiseerde email campagnes.`,
    expertise: 'Expertise',
    tools: 'Tools',
    languages: 'Talen',
    softSkills: 'Soft Skills',
    experience: 'Werkervaring',
    education: 'Educatie',
    dutch: 'Nederlands',
    english: 'Engels',
    current: 'heden',
    skills: ['Email Marketing', 'Marketing Automation', 'SQL / AMPScript', 'Data Analytics', 'SEO & CRO', 'Sales Automation'],
    softSkillsList: ['Ambitieus', 'Hands-on', 'Proactief', 'Empathisch', 'Teamspeler', 'Data-driven'],
    jobs: [
      { company: 'Vandebron', date: 'Apr 2025 – heden', role: 'Email Marketeer', desc: 'SQL queries schrijven en documenteren voor data-driven campagnes. Complexe AMPScript email campagnes bouwen in Salesforce Marketing Cloud. Projectmanager voor 500.000+ emails per maand.', tags: ['SQL', 'AMPScript', 'SFMC', '500k+ emails/mo'] },
      { company: 'Cleanprofs.nl', date: '2025 – heden', role: 'Freelance Deployteq Expert', desc: 'Marketing automation campagnes opzetten in Deployteq. Geautomatiseerde email flows, segmentatie en data-integraties.', tags: ['Deployteq', 'Automation', 'Segmentatie'] },
      { company: 'Cordital', date: 'Jan 2023 – Nov 2024', role: 'Freelance Marketeer', desc: 'SEO-strategie, marketing automations via Zoho en AMP interactieve e-mails voor hogere engagement.', tags: ['SEO', 'Zoho', 'AMP Email'] },
      { company: 'Guardey', date: 'Feb 2023 – Okt 2023', role: 'Content Marketing', desc: 'Contentstrategie voor IT Partners. Technische SEO, copywriting voor website en social media.', tags: ['Content', 'IT Security', 'SEO'] },
      { company: 'Silverflow', date: 'Feb 2022 – Okt 2022', role: 'Sales & Marketing Stage', desc: 'Pre-sales research B2B payments. Salespipeline met Pipedrive. Contentmarketingplan met trendanalyse.', tags: ['B2B', 'Pipedrive', 'Payments'] },
      { company: 'Kes Visum', date: '2020 – 2025', role: 'Marketing Lead', desc: 'Team van 4 aangestuurd. 4,4% conversie via social/display ads. 80+ LinkedIn leads per maand.', tags: ['Team Lead', '4.4% CVR', '80+ leads/mo'] },
    ],
    eduSchool: 'Hogeschool Rotterdam',
    eduDegree: 'Entrepreneurship — Bachelor of Arts · 2021 – 2025',
    eduHighlight: '🏆 Start-up prijs van het jaar (Fashionbot)',
  },
  en: {
    role: 'Email Marketer',
    roleDetail: 'Marketing Automation Specialist',
    tagline: 'Where creativity meets strategy',
    madeFor: 'Made for',
    personalCv: 'Personal CV',
    greeting: (name: string) => `Hey ${name} — here's my CV. Besides my work at Vandebron, I freelance at Cleanprofs.nl where I use Deployteq for automated email campaigns.`,
    expertise: 'Expertise',
    tools: 'Tools',
    languages: 'Languages',
    softSkills: 'Soft Skills',
    experience: 'Work experience',
    education: 'Education',
    dutch: 'Dutch',
    english: 'English',
    current: 'present',
    skills: ['Email Marketing', 'Marketing Automation', 'SQL / AMPScript', 'Data Analytics', 'SEO & CRO', 'Sales Automation'],
    softSkillsList: ['Ambitious', 'Hands-on', 'Proactive', 'Empathic', 'Team player', 'Data-driven'],
    jobs: [
      { company: 'Vandebron', date: 'Apr 2025 – present', role: 'Email Marketer', desc: 'Writing and documenting SQL queries for data-driven campaigns. Building complex AMPScript email campaigns in Salesforce Marketing Cloud. Project managing 500,000+ emails per month.', tags: ['SQL', 'AMPScript', 'SFMC', '500k+ emails/mo'] },
      { company: 'Cleanprofs.nl', date: '2025 – present', role: 'Freelance Deployteq Expert', desc: 'Setting up marketing automation campaigns in Deployteq. Building automated email flows, segmentation and data integrations.', tags: ['Deployteq', 'Automation', 'Segmentation'] },
      { company: 'Cordital', date: 'Jan 2023 – Nov 2024', role: 'Freelance Marketer', desc: 'SEO strategy, marketing automations via Zoho, and AMP interactive emails for higher engagement.', tags: ['SEO', 'Zoho', 'AMP Email'] },
      { company: 'Guardey', date: 'Feb 2023 – Oct 2023', role: 'Content Marketing', desc: 'Content strategy for IT Partners. Technical SEO, copywriting for website and social media.', tags: ['Content', 'IT Security', 'SEO'] },
      { company: 'Silverflow', date: 'Feb 2022 – Oct 2022', role: 'Sales & Marketing Intern', desc: 'Pre-sales research for B2B payments clients. Built sales pipeline with Pipedrive. Developed content marketing plan with trend analysis.', tags: ['B2B', 'Pipedrive', 'Payments'] },
      { company: 'Kes Visum', date: '2020 – 2025', role: 'Marketing Lead', desc: 'Led team of 4 marketers. Achieved 4.4% conversion via social/display ads. Generated 80+ LinkedIn leads per month.', tags: ['Team Lead', '4.4% CVR', '80+ leads/mo'] },
    ],
    eduSchool: 'Rotterdam University of Applied Sciences',
    eduDegree: 'Entrepreneurship — Bachelor of Arts · 2021 – 2025',
    eduHighlight: '🏆 Startup Award of the Year (Fashionbot)',
  },
};

function buildCVHtml(opts: GenerateCVOptions): string {
  const {
    companyName = '',
    contactName = '',
    primary = '#023047',
    secondary = '#EF476F',
    logoUrl = '',
    photoUrl = PHOTO_URL,
    language = 'nl',
  } = opts;

  const t = content[language] || content.nl;
  const colors = safeBrandColors(primary, secondary);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; width: 210mm; height: 297mm; overflow: hidden; -webkit-font-smoothing: antialiased; }
  .page { width: 210mm; height: 297mm; display: flex; }

  /* LEFT PANEL */
  .left {
    width: 70mm; height: 297mm;
    background: ${colors.sidebarBg};
    color: ${colors.sidebarText};
    display: flex; flex-direction: column;
    position: relative; overflow: hidden;
  }
  .left::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
    border-radius: 50%;
  }

  .profile { padding: 24px 20px 16px; text-align: center; position: relative; z-index: 1; }
  .avatar {
    width: 68px; height: 68px; border-radius: 50%;
    margin: 0 auto 10px;
    border: 2.5px solid ${colors.accent}55;
    overflow: hidden; background: ${colors.accent}33;
    display: flex; align-items: center; justify-content: center;
  }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-initials { font-size: 24px; font-weight: 800; color: ${colors.accent}; letter-spacing: -1px; }
  .profile-name { font-size: 16pt; font-weight: 800; letter-spacing: -0.5px; line-height: 1.1; }
  .profile-role { font-size: 7pt; color: ${colors.accent}; font-weight: 600; margin-top: 3px; }
  .profile-sub { font-size: 6pt; color: rgba(255,255,255,0.4); margin-top: 1px; }

  .contact-strip { background: rgba(0,0,0,0.12); padding: 8px 20px; position: relative; z-index: 1; }
  .c-item { display: flex; align-items: center; gap: 7px; margin-bottom: 4px; }
  .c-icon { width: 16px; height: 16px; background: ${colors.accent}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 7px; color: ${colors.accentText}; flex-shrink: 0; font-weight: 700; }
  .c-text { font-size: 6.5pt; color: rgba(255,255,255,0.75); }
  .c-text a { color: ${colors.accent}; text-decoration: none; font-weight: 600; }

  .left-section { padding: 10px 20px 0; position: relative; z-index: 1; }
  .l-title {
    font-size: 6.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;
    color: ${colors.accent}; margin-bottom: 6px;
    display: flex; align-items: center; gap: 6px;
  }
  .l-title::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08); }

  .skill-row { margin-bottom: 5px; }
  .skill-name { font-size: 6.5pt; color: rgba(255,255,255,0.7); margin-bottom: 1px; font-weight: 500; }
  .skill-track { height: 3px; background: rgba(255,255,255,0.08); border-radius: 99px; }
  .skill-fill { height: 100%; border-radius: 99px; background: ${colors.accent}; }

  .tg-label { font-size: 5.5pt; font-weight: 700; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.5px; margin: 6px 0 2px; }
  .tg-wrap { display: flex; flex-wrap: wrap; gap: 2px; }
  .tg { font-size: 5.5pt; font-weight: 600; padding: 1.5px 6px; border-radius: 99px; background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.6); }

  .lang-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
  .lang-name { font-size: 7pt; color: rgba(255,255,255,0.7); }
  .lang-dots { display: flex; gap: 2px; }
  .dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.12); }
  .dot.on { background: ${colors.accent}; }

  .soft-wrap { display: flex; flex-wrap: wrap; gap: 2px; }
  .soft { font-size: 5.5pt; font-weight: 600; padding: 2px 7px; border-radius: 99px; background: ${colors.accent}18; color: ${colors.accent}; border: 0.5px solid ${colors.accent}30; }

  /* RIGHT PANEL */
  .right { flex: 1; display: flex; flex-direction: column; background: #fff; }

  .company-bar {
    background: ${colors.headerBg};
    padding: 10px 22px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(0,0,0,0.04);
  }
  .cb-left { display: flex; align-items: center; gap: 8px; }
  .cb-logo { width: 28px; height: 28px; border-radius: 7px; background: #fff; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .cb-logo img { width: 20px; height: 20px; object-fit: contain; }
  .cb-label { font-size: 5.5pt; color: ${colors.headerText}88; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .cb-name { font-size: 10pt; color: ${colors.headerText}; font-weight: 800; }
  .cb-badge { font-size: 6pt; font-weight: 700; padding: 3px 10px; border-radius: 99px; background: ${colors.accent}; color: ${colors.accentText}; }

  .greeting-bar { padding: 8px 22px; font-size: 7.5pt; color: #475569; line-height: 1.5; border-bottom: 1px solid #f1f5f9; background: #fafbfc; }
  .greeting-bar strong { color: ${colors.sidebarBg}; }

  .r-body { padding: 14px 22px; flex: 1; }
  .r-title {
    font-size: 7.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;
    color: ${colors.sidebarBg}; margin-bottom: 10px;
    display: flex; align-items: center; gap: 6px;
  }
  .r-title::before { content: ''; width: 14px; height: 2.5px; background: ${colors.accent}; border-radius: 99px; }

  /* Apple-style cards */
  .card {
    padding: 10px 12px;
    margin-bottom: 6px;
    border-radius: 10px;
    background: #fff;
    border: 1px solid #f0f0f5;
    position: relative;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .card::before {
    content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 2.5px;
    background: ${colors.accent}; border-radius: 0 2px 2px 0;
  }
  .card-top { display: flex; justify-content: space-between; align-items: flex-start; padding-left: 6px; }
  .card-company { font-size: 9.5pt; font-weight: 800; color: #0f172a; }
  .card-date { font-size: 5.5pt; font-weight: 700; padding: 2.5px 8px; border-radius: 99px; background: ${colors.dateBadgeBg}; color: ${colors.dateBadgeText}; white-space: nowrap; }
  .card-role { font-size: 7pt; font-weight: 600; color: ${colors.accent}; margin: 1px 0 3px; padding-left: 6px; }
  .card-desc { font-size: 6.5pt; color: #64748b; line-height: 1.55; padding-left: 6px; }
  .card-tags { display: flex; gap: 2px; margin-top: 4px; flex-wrap: wrap; padding-left: 6px; }
  .card-tag { font-size: 5pt; font-weight: 600; padding: 1.5px 5px; border-radius: 99px; background: ${colors.sidebarBg}08; color: ${colors.sidebarBg}; border: 0.5px solid ${colors.sidebarBg}18; }

  .edu-card {
    padding: 10px 12px; border-radius: 10px;
    background: linear-gradient(135deg, ${colors.sidebarBg}06, ${colors.accent}06);
    border: 1px solid ${colors.sidebarBg}0a;
  }
  .edu-school { font-size: 9.5pt; font-weight: 800; color: #0f172a; }
  .edu-degree { font-size: 7pt; color: #64748b; }
  .edu-hl { font-size: 6.5pt; color: ${colors.accent}; font-weight: 600; margin-top: 2px; }

  .r-footer {
    padding: 5px 22px; border-top: 1px solid #f1f5f9;
    display: flex; justify-content: space-between;
    font-size: 5.5pt; color: #94a3b8;
  }
  .r-footer a { color: ${colors.accent}; text-decoration: none; font-weight: 600; }
</style>
</head>
<body>
<div class="page">
  <div class="left">
    <div class="profile">
      <div class="avatar">
        ${photoUrl ? `<img src="${photoUrl}" alt="Samba Jarju" />` : '<span class="avatar-initials">SJ</span>'}
      </div>
      <div class="profile-name">Samba Jarju</div>
      <div class="profile-role">${t.role}</div>
      <div class="profile-sub">${t.roleDetail}</div>
    </div>

    <div class="contact-strip">
      <div class="c-item"><div class="c-icon">📍</div><div class="c-text">Rotterdam, NL</div></div>
      <div class="c-item"><div class="c-icon">🌐</div><div class="c-text"><a href="https://sambajarju.com">sambajarju.com</a></div></div>
      <div class="c-item"><div class="c-icon">in</div><div class="c-text"><a href="https://linkedin.com/in/sambajarju">linkedin.com/in/sambajarju</a></div></div>
      <div class="c-item"><div class="c-icon">✉</div><div class="c-text">sambajarju2@gmail.com</div></div>
      <div class="c-item"><div class="c-icon">📞</div><div class="c-text">+31 6 87975656</div></div>
    </div>

    <div class="left-section">
      <div class="l-title">${t.expertise}</div>
      ${t.skills.map((s, i) => `<div class="skill-row"><div class="skill-name">${s}</div><div class="skill-track"><div class="skill-fill" style="width:${[95,90,85,80,85,75][i]}%"></div></div></div>`).join('')}
    </div>

    <div class="left-section">
      <div class="l-title">${t.tools}</div>
      <div class="tg-label">EMAIL & MARKETING</div>
      <div class="tg-wrap">${['SFMC','Deployteq','HubSpot','Resend'].map(t => `<span class="tg">${t}</span>`).join('')}</div>
      <div class="tg-label">ANALYTICS</div>
      <div class="tg-wrap">${['GA4','SEMRush','Hotjar','VWO'].map(t => `<span class="tg">${t}</span>`).join('')}</div>
      <div class="tg-label">DEVELOPMENT</div>
      <div class="tg-wrap">${['Next.js','React','TypeScript','Tailwind','Supabase'].map(t => `<span class="tg">${t}</span>`).join('')}</div>
      <div class="tg-label">CRM & AUTOMATION</div>
      <div class="tg-wrap">${['Salesforce','Apollo','Pipedrive','Zapier','Make'].map(t => `<span class="tg">${t}</span>`).join('')}</div>
    </div>

    <div class="left-section">
      <div class="l-title">${t.languages}</div>
      <div class="lang-row"><span class="lang-name">${t.dutch}</span><div class="lang-dots">${'<div class="dot on"></div>'.repeat(5)}</div></div>
      <div class="lang-row"><span class="lang-name">${t.english}</span><div class="lang-dots">${'<div class="dot on"></div>'.repeat(4)}<div class="dot"></div></div></div>
    </div>

    <div class="left-section" style="padding-bottom: 16px;">
      <div class="l-title">${t.softSkills}</div>
      <div class="soft-wrap">${t.softSkillsList.map(s => `<span class="soft">${s}</span>`).join('')}</div>
    </div>
  </div>

  <div class="right">
    ${companyName ? `<div class="company-bar"><div class="cb-left">${logoUrl ? `<div class="cb-logo"><img src="${logoUrl}" /></div>` : ''}<div><div class="cb-label">${t.madeFor}</div><div class="cb-name">${companyName}</div></div></div><div class="cb-badge">${t.personalCv}</div></div>` : ''}

    ${contactName ? `<div class="greeting-bar"><strong>${contactName}</strong> — ${t.greeting(contactName).replace(`Hey ${contactName} — `, '')}</div>` : ''}

    <div class="r-body">
      <div class="r-title">${t.experience}</div>
      ${t.jobs.map(j => `<div class="card"><div class="card-top"><span class="card-company">${j.company}</span><span class="card-date">${j.date}</span></div><div class="card-role">${j.role}</div><div class="card-desc">${j.desc}</div><div class="card-tags">${j.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}</div></div>`).join('')}

      <div style="margin-top: 10px;">
        <div class="r-title">${t.education}</div>
        <div class="edu-card">
          <div class="edu-school">${t.eduSchool}</div>
          <div class="edu-degree">${t.eduDegree}</div>
          <div class="edu-hl">${t.eduHighlight}</div>
        </div>
      </div>
    </div>

    <div class="r-footer">
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
  if (!apiKey) throw new Error('YAKPDF_API_KEY not configured');

  const response = await fetch('https://yakpdf.p.rapidapi.com/pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'yakpdf.p.rapidapi.com',
    },
    body: JSON.stringify({
      pdf: { format: 'A4', printBackground: true, scale: 1, margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' } },
      source: { html },
      wait: { for: 'navigation', timeout: 3000, waitUntil: 'networkidle0' },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`YakPDF error ${response.status}: ${text}`);
  }

  return Buffer.from(await response.arrayBuffer());
}
