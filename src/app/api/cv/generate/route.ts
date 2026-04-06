import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

// CV data
const experience = [
  { company: 'Van de Bron (Vandebron)', period: 'April 2025 - heden', role: 'Email Marketeer', items: ['SQL queries schrijven en documenteren', 'AMPScript gebruiken voor ingewikkelde email campagnes', 'Project manager voor grote projecten: 500k+ emails per maand', 'Recap en monitoring van alle email campagnes'] },
  { company: 'Cleanprofs.nl', period: '2025 - heden', role: 'Freelance Deployteq Expert', items: ['Marketing automation campagnes bouwen in Deployteq', 'Geautomatiseerde email flows en segmentatie'] },
  { company: 'Cordital', period: 'Jan 2023 - Nov 2024', role: 'Freelance Marketeer', items: ['Allround marketingactiviteiten: SEO, automations via Zoho en content creatie', 'AMP interactieve e-mails bouwen'] },
  { company: 'Guardey', period: 'Feb 2023 - Okt 2023', role: 'Freelance Content Marketing', items: ['Contentstrategie voor IT Partners, SEO optimalisatie en community building', 'Copywriting: website-inhoud, social media posts en marketingmateriaal'] },
  { company: 'Silverflow (Stage)', period: 'Feb 2022 - Okt 2022', role: 'Sales en Marketing', items: ['Herstructureerde de marketingafdeling, pre-sales research voor B2B klanten', 'Salespipeline optimalisatie met Pipedrive', 'Contentmarketingplan met trendanalyse en doelgroepidentificatie'] },
  { company: 'Kes Visum', period: 'Jan 2020 - Jan 2025', role: 'Marketing Lead', items: ['Leidde een team van 4 marketingmedewerkers', 'Social media & display ads met 4,4% conversiepercentage', 'B2B LinkedIn-outreach: 80+ leads per maand'] },
];

const skills = ['Email Marketing', 'Marketing Automation', 'SQL/AMPScript', 'Data Analytics', 'CRO', '(Technische) SEO', 'Sales Research', 'Web Development'];
const tools = ['Salesforce Marketing Cloud', 'Deployteq', 'HubSpot', 'Google Analytics', 'SEMRush', 'Zapier/Make', 'Next.js/React', 'Supabase', 'Figma', 'VWO A/B Testing', 'Hotjar', 'WordPress'];

function createStyles(primary: string, secondary: string) {
  return StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${primary}` },
    headerLeft: { flex: 1 },
    name: { fontSize: 24, fontWeight: 'bold', color: primary, marginBottom: 4 },
    subtitle: { fontSize: 11, color: '#666', marginBottom: 8 },
    contactRow: { flexDirection: 'row', gap: 16, fontSize: 9, color: '#888' },
    headerRight: { alignItems: 'flex-end', justifyContent: 'center' },
    brandBadge: { backgroundColor: primary, borderRadius: 8, padding: '8 16', marginBottom: 8 },
    brandBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    forCompany: { fontSize: 9, color: secondary, fontWeight: 'bold', textAlign: 'right' },
    twoCol: { flexDirection: 'row', gap: 24 },
    sidebar: { width: 160 },
    main: { flex: 1 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: primary, marginBottom: 8, marginTop: 16, textTransform: 'uppercase', letterSpacing: 1 },
    skillPill: { backgroundColor: `${primary}15`, borderRadius: 4, padding: '3 8', marginBottom: 4, marginRight: 4 },
    skillText: { fontSize: 8.5, color: primary },
    skillsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
    expBlock: { marginBottom: 12 },
    expCompany: { fontSize: 11, fontWeight: 'bold', color: '#111' },
    expMeta: { fontSize: 9, color: secondary, marginBottom: 4 },
    expItem: { fontSize: 9, color: '#444', marginBottom: 2, paddingLeft: 8 },
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: '#aaa', borderTop: '1px solid #eee', paddingTop: 8 },
    link: { color: primary, textDecoration: 'none' },
    greeting: { fontSize: 11, color: '#555', marginBottom: 16, lineHeight: 1.6, padding: '12 16', backgroundColor: `${primary}08`, borderRadius: 6, borderLeft: `3px solid ${primary}` },
  });
}

interface Props { primary: string; secondary: string; companyName: string; contactName: string; logoUrl: string; }

function CVDocument({ primary, secondary, companyName, contactName }: Props) {
  const s = createStyles(primary, secondary);

  return React.createElement(Document, {},
    React.createElement(Page, { size: 'A4', style: s.page },
      // Header
      React.createElement(View, { style: s.header },
        React.createElement(View, { style: s.headerLeft },
          React.createElement(Text, { style: s.name }, 'Samba Jarju'),
          React.createElement(Text, { style: s.subtitle }, 'Email Marketeer & Marketing Automation Specialist'),
          React.createElement(View, { style: s.contactRow },
            React.createElement(Text, {}, 'Rotterdam'),
            React.createElement(Text, {}, 'samba@sambajarju.nl'),
            React.createElement(Text, {}, '+31 6 87975656'),
          ),
        ),
        React.createElement(View, { style: s.headerRight },
          React.createElement(View, { style: s.brandBadge },
            React.createElement(Text, { style: s.brandBadgeText }, 'SJ'),
          ),
          companyName ? React.createElement(Text, { style: s.forCompany }, `Speciaal voor ${companyName}`) : null,
        ),
      ),
      // Greeting
      contactName ? React.createElement(View, { style: s.greeting },
        React.createElement(Text, {}, `Hey ${contactName},`),
        React.createElement(Text, { style: { marginTop: 4 } }, `Hierbij mijn CV. Naast mijn werk bij Vandebron werk ik als freelancer bij Cleanprofs.nl, waar ik Deployteq gebruik om geautomatiseerde email campagnes te bouwen. Ik denk dat ik ${companyName} kan helpen met email marketing en marketing automation.`),
      ) : null,
      // Two columns
      React.createElement(View, { style: s.twoCol },
        // Sidebar
        React.createElement(View, { style: s.sidebar },
          React.createElement(Text, { style: s.sectionTitle }, 'Skills'),
          React.createElement(View, { style: s.skillsWrap },
            ...skills.map(sk => React.createElement(View, { key: sk, style: s.skillPill },
              React.createElement(Text, { style: s.skillText }, sk),
            )),
          ),
          React.createElement(Text, { style: s.sectionTitle }, 'Tools'),
          ...tools.map(t => React.createElement(Text, { key: t, style: { fontSize: 8.5, color: '#555', marginBottom: 2 } }, `• ${t}`)),
          React.createElement(Text, { style: s.sectionTitle }, 'Talen'),
          React.createElement(Text, { style: { fontSize: 9, color: '#555' } }, 'Nederlands · Engels'),
          React.createElement(Text, { style: s.sectionTitle }, 'Educatie'),
          React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold', color: '#333' } }, 'Hogeschool Rotterdam'),
          React.createElement(Text, { style: { fontSize: 8.5, color: '#666' } }, 'Entrepreneurship BA, 2021-2025'),
          React.createElement(Text, { style: s.sectionTitle }, 'Links'),
          React.createElement(Link, { src: 'https://sambajarju.com', style: s.link }, 'sambajarju.com'),
          React.createElement(Link, { src: 'https://linkedin.com/in/sambajarju', style: { ...s.link, marginTop: 2 } }, 'LinkedIn'),
          React.createElement(Link, { src: 'https://paywatch.app', style: { ...s.link, marginTop: 2 } }, 'PayWatch.app'),
        ),
        // Main
        React.createElement(View, { style: s.main },
          React.createElement(Text, { style: s.sectionTitle }, 'Ervaring'),
          ...experience.map(exp => React.createElement(View, { key: exp.company, style: s.expBlock },
            React.createElement(Text, { style: s.expCompany }, exp.company),
            React.createElement(Text, { style: s.expMeta }, `${exp.period} · ${exp.role}`),
            ...exp.items.map((item, j) => React.createElement(Text, { key: j, style: s.expItem }, `• ${item}`)),
          )),
        ),
      ),
      // Footer
      React.createElement(View, { style: s.footer },
        React.createElement(Text, {}, 'Samba Jarju · KvK 83474889 · Rotterdam'),
        React.createElement(Text, {}, 'sambajarju.com'),
      ),
    ),
  );
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const company = url.searchParams.get('company') || '';
  const contactName = url.searchParams.get('contactname') || '';

  let companyName = '';
  let primary = '#023047';
  let secondary = '#4A6B7F';
  let logoUrl = '';

  if (company) {
    try {
      const origin = url.origin;
      const res = await fetch(`${origin}/api/personalize`, {
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

  const buffer = await renderToBuffer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.createElement(CVDocument, { primary, secondary, companyName, contactName, logoUrl }) as any
  );

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="CV_Samba_Jarju${companyName ? `_${companyName}` : ''}.pdf"`,
    },
  });
}
