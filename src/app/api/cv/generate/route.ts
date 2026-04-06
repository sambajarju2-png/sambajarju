import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer, Document, Page, Text, View, Image, Link, StyleSheet, Font } from '@react-pdf/renderer';

// Register a web font for better typography
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf', fontWeight: 300 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyYAZ9hjQ.ttf', fontWeight: 800 },
  ],
});

const experience = [
  { company: 'Vandebron', period: 'April 2025 - heden', role: 'Email Marketeer', bullets: ['SQL queries schrijven en documenteren', 'AMPScript voor complexe email campagnes', 'Project manager: 500k+ emails per maand', 'Monitoring en recap van alle campagnes'] },
  { company: 'Cleanprofs.nl', period: '2025 - heden', role: 'Freelance Deployteq Expert', bullets: ['Marketing automation campagnes in Deployteq', 'Geautomatiseerde email flows en segmentatie'] },
  { company: 'Cordital', period: 'Jan 2023 - Nov 2024', role: 'Freelance Marketeer', bullets: ['SEO, automations via Zoho, content creatie', 'AMP interactieve e-mails bouwen'] },
  { company: 'Guardey', period: 'Feb 2023 - Okt 2023', role: 'Content Marketing', bullets: ['Contentstrategie voor IT Partners, SEO', 'Copywriting: website, social, marketing'] },
  { company: 'Silverflow (Stage)', period: 'Feb 2022 - Okt 2022', role: 'Sales & Marketing', bullets: ['Pre-sales research B2B klanten', 'Salespipeline met Pipedrive', 'Contentmarketingplan met trendanalyse'] },
  { company: 'Kes Visum', period: 'Jan 2020 - Jan 2025', role: 'Marketing Lead', bullets: ['Team van 4 marketingmedewerkers', '4,4% conversie via social/display ads', '80+ LinkedIn leads per maand'] },
];

interface CVProps { primary: string; secondary: string; companyName: string; contactName: string; logoUrl: string; }

function CVDoc({ primary, secondary, companyName, contactName, logoUrl }: CVProps) {
  const p = primary || '#2563EB';
  const s2 = secondary || p;
  const styles = StyleSheet.create({
    page: { fontFamily: 'Inter', fontSize: 9.5, color: '#334155', padding: 0 },
    topBar: { height: 5, backgroundColor: p },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: '20 32 16 32' },
    nameBlock: {},
    name: { fontSize: 26, fontWeight: 300, color: '#1e293b' },
    nameBold: { fontSize: 26, fontWeight: 800, color: '#1e293b' },
    subtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
    linkedinRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 5 },
    linkedinBadge: { backgroundColor: p, borderRadius: 2, padding: '1 4' },
    linkedinBadgeText: { color: '#fff', fontSize: 7, fontWeight: 700 },
    linkedinText: { color: p, fontSize: 9 },
    contactBlock: { textAlign: 'right', fontSize: 9, color: '#64748b' },
    contactLabel: { fontWeight: 700, color: '#334155' },
    contactLink: { color: p, textDecoration: 'none' },
    // Company badge
    companyBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: `${p}10`, borderRadius: 6, padding: '5 10', marginBottom: 4, alignSelf: 'flex-end' },
    companyLogo: { width: 22, height: 22, objectFit: 'contain' },
    companyLabel: { fontSize: 7, color: p, fontWeight: 600 },
    companyName: { fontSize: 10, color: p, fontWeight: 700 },
    // Greeting
    greetingBox: { marginHorizontal: 32, marginBottom: 12, padding: '8 12', backgroundColor: `${p}08`, borderLeftWidth: 3, borderLeftColor: p, borderRadius: 4 },
    greetingBold: { fontWeight: 700, color: p, fontSize: 9.5 },
    greetingText: { fontSize: 9, color: '#475569', lineHeight: 1.6 },
    // Body
    body: { flexDirection: 'row', paddingHorizontal: 32, gap: 20 },
    sidebar: { width: 150 },
    main: { flex: 1 },
    // Section title
    sectionTitle: { fontSize: 10, fontWeight: 700, color: p, marginBottom: 6, marginTop: 14, paddingBottom: 3, borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9' },
    firstSection: { marginTop: 0 },
    // Skills
    catLabel: { fontSize: 7, fontWeight: 700, color: s2, marginTop: 8, marginBottom: 2 },
    skillItem: { fontSize: 8.5, color: '#64748b', marginBottom: 1.5 },
    // Pills row
    pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginTop: 3 },
    pill: { fontSize: 7.5, color: p, backgroundColor: `${p}12`, borderRadius: 99, paddingVertical: 2, paddingHorizontal: 7, fontWeight: 600 },
    // Experience
    expBlock: { marginBottom: 10 },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    expCompany: { fontSize: 11, fontWeight: 700, color: '#1e293b' },
    expDate: { fontSize: 8, color: p, fontWeight: 600 },
    expRole: { fontSize: 9, fontWeight: 600, color: '#64748b', fontStyle: 'italic', marginBottom: 3, marginTop: 1 },
    bullet: { fontSize: 8.5, color: '#475569', marginBottom: 1, paddingLeft: 8 },
    // Education
    eduRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    eduTitle: { fontSize: 11, fontWeight: 700, color: '#1e293b' },
    eduSub: { fontSize: 9, color: '#64748b', fontStyle: 'italic', marginTop: 1 },
    eduDate: { fontSize: 8, color: p, fontWeight: 600 },
    // Footer
    footer: { position: 'absolute', bottom: 14, left: 32, right: 32, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7, color: '#cbd5e1', borderTopWidth: 0.5, borderTopColor: '#f1f5f9', paddingTop: 6 },
  });

  const E = React.createElement;

  return E(Document, {},
    E(Page, { size: 'A4', style: styles.page },
      // Top color bar
      E(View, { style: styles.topBar }),
      // Header
      E(View, { style: styles.header },
        E(View, { style: styles.nameBlock },
          E(View, { style: { flexDirection: 'row' } },
            E(Text, { style: styles.nameBold }, 'Samba'),
            E(Text, { style: styles.name }, ' Jarju'),
          ),
          E(Text, { style: styles.subtitle }, 'Marketing | Economie'),
          E(View, { style: styles.linkedinRow },
            E(View, { style: styles.linkedinBadge }, E(Text, { style: styles.linkedinBadgeText }, 'in')),
            E(Link, { src: 'https://linkedin.com/in/sambajarju', style: styles.linkedinText }, 'linkedin.com/in/sambajarju'),
          ),
        ),
        E(View, { style: { alignItems: 'flex-end' } },
          companyName ? E(View, { style: styles.companyBadge },
            logoUrl ? E(Image, { src: logoUrl, style: styles.companyLogo }) : null,
            E(View, {},
              E(Text, { style: styles.companyLabel }, 'SPECIAAL VOOR'),
              E(Text, { style: styles.companyName }, companyName),
            ),
          ) : null,
          E(View, { style: styles.contactBlock },
            E(Text, { style: styles.contactLabel }, 'Locatie'),
            E(Text, {}, 'Rotterdam'),
            E(Text, { style: { marginTop: 6 } }, ''),
            E(Link, { src: 'https://sambajarju.com', style: styles.contactLink }, 'sambajarju.com'),
            E(Text, {}, 'sambajarju2@gmail.com'),
          ),
        ),
      ),
      // Greeting
      contactName ? E(View, { style: styles.greetingBox },
        E(Text, { style: styles.greetingText },
          E(Text, { style: styles.greetingBold }, `Hey ${contactName}, `),
          'hierbij mijn CV. Naast mijn werk bij Vandebron werk ik als freelancer bij Cleanprofs.nl, waar ik Deployteq gebruik voor geautomatiseerde email campagnes.',
        ),
      ) : null,
      // Body
      E(View, { style: styles.body },
        // Sidebar
        E(View, { style: styles.sidebar },
          E(Text, { style: { ...styles.sectionTitle, ...styles.firstSection } }, 'Skills'),
          ...['(Sales) Research', 'Sales Automation', 'Email Marketing', 'Data Analytics', '(Technische) SEO', 'Marketing Automation', 'CRO', 'SQL/AMPScript'].map(s =>
            E(Text, { key: s, style: styles.skillItem }, `• ${s}`)
          ),
          E(Text, { style: styles.sectionTitle }, 'Tools & Tech'),
          E(Text, { style: styles.catLabel }, 'SALES'),
          ...['LinkedIn Sales Navigator', 'HubSpot / Pipedrive', 'Apollo', 'Salesforce'].map(s => E(Text, { key: s, style: styles.skillItem }, `• ${s}`)),
          E(Text, { style: styles.catLabel }, 'MARKETING'),
          ...['Google Analytics', 'SEMRush', 'Marketing Cloud', 'Zapier / Make'].map(s => E(Text, { key: s, style: styles.skillItem }, `• ${s}`)),
          E(Text, { style: styles.catLabel }, 'DEVELOPMENT'),
          ...['Next.js / React', 'TypeScript', 'Supabase', 'Tailwind CSS'].map(s => E(Text, { key: s, style: styles.skillItem }, `• ${s}`)),
          E(Text, { style: styles.sectionTitle }, 'Talen'),
          E(Text, { style: styles.skillItem }, '• Nederlands'),
          E(Text, { style: styles.skillItem }, '• Engels'),
          E(Text, { style: styles.sectionTitle }, 'Soft Skills'),
          E(View, { style: styles.pillsRow },
            ...['Ambitieus', 'Hands-on', 'Proactief', 'Empathisch', 'Teamspeler', 'Ondernemend'].map(s =>
              E(Text, { key: s, style: styles.pill }, s)
            ),
          ),
        ),
        // Main
        E(View, { style: styles.main },
          E(Text, { style: { ...styles.sectionTitle, ...styles.firstSection, fontSize: 16, fontWeight: 300, color: '#94a3b8', borderBottomWidth: 0 } }, 'Ervaring'),
          ...experience.map(exp =>
            E(View, { key: exp.company, style: styles.expBlock },
              E(View, { style: styles.expHeader },
                E(Text, { style: styles.expCompany }, exp.company),
                E(Text, { style: styles.expDate }, exp.period),
              ),
              E(Text, { style: styles.expRole }, exp.role),
              ...exp.bullets.map((b, j) => E(Text, { key: j, style: styles.bullet }, `• ${b}`)),
            ),
          ),
          E(Text, { style: { ...styles.sectionTitle, fontSize: 16, fontWeight: 300, color: '#94a3b8', borderBottomWidth: 0, marginTop: 12 } }, 'Educatie'),
          E(View, { style: styles.eduRow },
            E(View, {},
              E(Text, { style: styles.eduTitle }, 'Hogeschool Rotterdam'),
              E(Text, { style: styles.eduSub }, 'Entrepreneurship - Bachelor of Arts'),
            ),
            E(Text, { style: styles.eduDate }, '2021 - 2025'),
          ),
          E(Text, { style: { ...styles.bullet, marginTop: 4 } }, '• Start-up prijs van het jaar (Fashionbot)'),
          E(Text, { style: styles.bullet }, '• Workshops gegeven aan medestudenten'),
        ),
      ),
      // Footer
      E(View, { style: styles.footer },
        E(Text, {}, 'Samba Jarju · KvK 83474889 · Rotterdam'),
        E(Text, {}, 'sambajarju.com'),
      ),
    ),
  );
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(
    React.createElement(CVDoc, { primary, secondary, companyName, contactName, logoUrl }) as any
  );

  return new NextResponse(Buffer.from(buffer) as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="CV_Samba_Jarju${companyName ? `_${companyName}` : ''}.pdf"`,
    },
  });
}
