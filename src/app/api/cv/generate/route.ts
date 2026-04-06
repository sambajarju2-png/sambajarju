import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer, Document, Page, Text, View, Image, Link, StyleSheet } from '@react-pdf/renderer';

const experience = [
  { company: 'Vandebron', period: 'April 2025 - heden', role: 'Email Marketeer', items: ['SQL queries schrijven en documenteren', 'AMPScript voor complexe email campagnes', 'Project manager: 500k+ emails per maand', 'Monitoring en recap van alle email campagnes'] },
  { company: 'Cleanprofs.nl', period: '2025 - heden', role: 'Freelance Deployteq Expert', items: ['Marketing automation campagnes in Deployteq', 'Geautomatiseerde email flows en segmentatie'] },
  { company: 'Cordital', period: 'Jan 2023 - Nov 2024', role: 'Freelance Marketeer', items: ['SEO, automations via Zoho, content creatie', 'AMP interactieve e-mails bouwen'] },
  { company: 'Guardey', period: 'Feb 2023 - Okt 2023', role: 'Content Marketing', items: ['Contentstrategie voor IT Partners', 'SEO optimalisatie en community building'] },
  { company: 'Silverflow (Stage)', period: 'Feb 2022 - Okt 2022', role: 'Sales & Marketing', items: ['Pre-sales research B2B klanten', 'Salespipeline met Pipedrive', 'Contentmarketingplan met trendanalyse'] },
  { company: 'Kes Visum', period: 'Jan 2020 - Jan 2025', role: 'Marketing Lead', items: ['Team van 4 marketingmedewerkers', '4,4% conversiepercentage via social/display ads', '80+ LinkedIn leads per maand voor sales'] },
];

const skillCategories = [
  { title: 'EMAIL & MARKETING', items: ['Salesforce Marketing Cloud', 'Deployteq', 'AMPScript/SQL', 'Email Automation', 'A/B Testing (VWO)'] },
  { title: 'ANALYTICS & CRO', items: ['Google Analytics', 'SEMRush', 'Hotjar', 'Conversion Optimisation'] },
  { title: 'DEVELOPMENT', items: ['Next.js / React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vercel'] },
  { title: 'AUTOMATION & CRM', items: ['HubSpot', 'Pipedrive', 'Zapier / Make', 'Zoho'] },
];

function CV({ primary, secondary, companyName, contactName, logoUrl }: { primary: string; secondary: string; companyName: string; contactName: string; logoUrl: string }) {
  const s = StyleSheet.create({
    page: { padding: 0, fontFamily: 'Helvetica', fontSize: 9.5, color: '#333' },
    // Top branded banner
    banner: { backgroundColor: primary, padding: '28 36 24 36', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    bannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    sjBadge: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#EF476F', justifyContent: 'center', alignItems: 'center' },
    sjText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    bannerName: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
    bannerRole: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 },
    bannerRight: { alignItems: 'flex-end' },
    companyBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6 12' },
    companyLogo: { width: 28, height: 28, borderRadius: 6, objectFit: 'contain', backgroundColor: '#fff' },
    companyLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    companyText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
    // Contact bar
    contactBar: { backgroundColor: `${primary}11`, padding: '10 36', flexDirection: 'row', gap: 20, borderBottom: `1px solid ${primary}22` },
    contactItem: { fontSize: 8.5, color: primary },
    // Greeting
    greetingBox: { margin: '16 36 0 36', padding: '12 16', backgroundColor: `${primary}08`, borderRadius: 6, borderLeft: `3px solid ${primary}` },
    greetingText: { fontSize: 9.5, color: '#444', lineHeight: 1.6 },
    greetingBold: { fontWeight: 'bold', color: primary },
    // Body
    body: { flexDirection: 'row', padding: '16 36 0 36', gap: 24 },
    sidebar: { width: 155 },
    main: { flex: 1 },
    // Section
    sectionTitle: { fontSize: 10, fontWeight: 'bold', color: primary, marginBottom: 8, marginTop: 14, textTransform: 'uppercase', letterSpacing: 0.8 },
    // Skills
    skillCat: { marginBottom: 10 },
    skillCatTitle: { fontSize: 7.5, fontWeight: 'bold', color: secondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    skillItem: { fontSize: 8.5, color: '#555', marginBottom: 2 },
    // Experience
    expBlock: { marginBottom: 10 },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 },
    expCompany: { fontSize: 10.5, fontWeight: 'bold', color: '#111' },
    expPeriod: { fontSize: 8, color: primary },
    expRole: { fontSize: 9, color: secondary, fontWeight: 'bold', marginBottom: 3 },
    expItem: { fontSize: 8.5, color: '#444', marginBottom: 1.5, paddingLeft: 8 },
    // Education
    eduTitle: { fontSize: 10, fontWeight: 'bold', color: '#111' },
    eduSub: { fontSize: 8.5, color: '#666', marginTop: 1 },
    // Footer
    footer: { position: 'absolute', bottom: 20, left: 36, right: 36, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7.5, color: '#bbb', borderTop: '0.5px solid #eee', paddingTop: 8 },
    link: { color: primary, textDecoration: 'none', fontSize: 8.5 },
    // Color bar
    colorBar: { height: 3, backgroundColor: secondary },
  });

  return React.createElement(Document, {},
    React.createElement(Page, { size: 'A4', style: s.page },
      // Branded banner
      React.createElement(View, { style: s.banner },
        React.createElement(View, { style: s.bannerLeft },
          React.createElement(View, { style: s.sjBadge },
            React.createElement(Text, { style: s.sjText }, 'SJ'),
          ),
          React.createElement(View, {},
            React.createElement(Text, { style: s.bannerName }, 'Samba Jarju'),
            React.createElement(Text, { style: s.bannerRole }, 'Email Marketeer & Marketing Automation Specialist'),
          ),
        ),
        companyName ? React.createElement(View, { style: s.bannerRight },
          React.createElement(View, { style: s.companyBadge },
            logoUrl ? React.createElement(Image, { src: logoUrl, style: s.companyLogo }) : null,
            React.createElement(View, {},
              React.createElement(Text, { style: s.companyLabel }, 'Speciaal voor'),
              React.createElement(Text, { style: s.companyText }, companyName),
            ),
          ),
        ) : null,
      ),
      // Accent color bar
      React.createElement(View, { style: s.colorBar }),
      // Contact bar
      React.createElement(View, { style: s.contactBar },
        React.createElement(Text, { style: s.contactItem }, 'Rotterdam'),
        React.createElement(Text, { style: s.contactItem }, 'samba@sambajarju.com'),
        React.createElement(Text, { style: s.contactItem }, '+31 6 87975656'),
        React.createElement(Text, { style: s.contactItem }, 'linkedin.com/in/sambajarju'),
        React.createElement(Text, { style: s.contactItem }, 'sambajarju.com'),
      ),
      // Greeting
      contactName ? React.createElement(View, { style: s.greetingBox },
        React.createElement(Text, { style: s.greetingText },
          React.createElement(Text, { style: s.greetingBold }, `Hey ${contactName}, `),
          `hierbij mijn CV. Naast mijn werk bij Vandebron werk ik als freelancer bij Cleanprofs.nl, waar ik Deployteq gebruik om geautomatiseerde email campagnes te bouwen.`,
        ),
      ) : null,
      // Body — two columns
      React.createElement(View, { style: s.body },
        // Sidebar
        React.createElement(View, { style: s.sidebar },
          React.createElement(Text, { style: s.sectionTitle }, 'Skills & Tools'),
          ...skillCategories.map(cat =>
            React.createElement(View, { key: cat.title, style: s.skillCat },
              React.createElement(Text, { style: s.skillCatTitle }, cat.title),
              ...cat.items.map(item =>
                React.createElement(Text, { key: item, style: s.skillItem }, `• ${item}`),
              ),
            ),
          ),
          React.createElement(Text, { style: s.sectionTitle }, 'Talen'),
          React.createElement(Text, { style: s.skillItem }, '• Nederlands (moedertaal)'),
          React.createElement(Text, { style: s.skillItem }, '• Engels (vloeiend)'),
          React.createElement(Text, { style: s.sectionTitle }, 'Educatie'),
          React.createElement(Text, { style: s.eduTitle }, 'Hogeschool Rotterdam'),
          React.createElement(Text, { style: s.eduSub }, 'Entrepreneurship BA · 2021-2025'),
          React.createElement(Text, { style: { ...s.skillItem, marginTop: 4 } }, '• Start-up prijs van het jaar'),
          React.createElement(Text, { style: s.sectionTitle }, 'Links'),
          React.createElement(Link, { src: 'https://sambajarju.com', style: s.link }, 'sambajarju.com'),
          React.createElement(Link, { src: 'https://paywatch.app', style: { ...s.link, marginTop: 2 } }, 'paywatch.app'),
          React.createElement(Link, { src: 'https://linkedin.com/in/sambajarju', style: { ...s.link, marginTop: 2 } }, 'LinkedIn'),
        ),
        // Main — experience
        React.createElement(View, { style: s.main },
          React.createElement(Text, { style: s.sectionTitle }, 'Ervaring'),
          ...experience.map(exp =>
            React.createElement(View, { key: exp.company, style: s.expBlock },
              React.createElement(View, { style: s.expHeader },
                React.createElement(Text, { style: s.expCompany }, exp.company),
                React.createElement(Text, { style: s.expPeriod }, exp.period),
              ),
              React.createElement(Text, { style: s.expRole }, exp.role),
              ...exp.items.map((item, j) =>
                React.createElement(Text, { key: j, style: s.expItem }, `• ${item}`),
              ),
            ),
          ),
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(
    React.createElement(CV, { primary, secondary, companyName, contactName, logoUrl }) as any
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="CV_Samba_Jarju${companyName ? `_${companyName}` : ''}.pdf"`,
    },
  });
}
