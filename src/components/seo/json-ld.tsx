export function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Samba Jarju',
    url: 'https://sambajarju.com',
    image: 'https://sambajarju.com/samba-casual.jpg',
    jobTitle: 'Email Marketeer & Marketing Automation Specialist',
    worksFor: {
      '@type': 'Organization',
      name: 'Vandebron',
      url: 'https://vandebron.nl',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Rotterdam Business School',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rotterdam',
      addressCountry: 'NL',
    },
    email: 'samba@sambajarju.nl',
    telephone: '+31687975656',
    sameAs: [
      'https://www.linkedin.com/in/sambajarju/',
    ],
    knowsAbout: [
      'Email Marketing', 'Marketing Automation', 'CRM', 'SQL', 'AMPScript',
      'Salesforce Marketing Cloud', 'HubSpot', 'Deployteq', 'SEO', 'CRO',
      'Next.js', 'React', 'TypeScript', 'Supabase', 'Sanity CMS',
    ],
    description: 'Data marketeer en marketing automation specialist uit Rotterdam. Gespecialiseerd in email marketing, CRM, SQL, en Salesforce Marketing Cloud.',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Samba Jarju Portfolio',
    url: 'https://sambajarju.com',
    description: 'Portfolio en ABM platform van Samba Jarju — email marketeer en marketing automation specialist.',
    author: { '@type': 'Person', name: 'Samba Jarju' },
    inLanguage: ['nl', 'en'],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Samba Jarju — Marketing Automation',
    url: 'https://sambajarju.com',
    provider: { '@type': 'Person', name: 'Samba Jarju' },
    areaServed: { '@type': 'Country', name: 'Netherlands' },
    serviceType: ['Email Marketing', 'Marketing Automation', 'CRM Strategy', 'Data Analytics', 'B2B Lead Generation'],
    description: 'Freelance email marketing en marketing automation diensten. Ervaring met 500k+ emails per maand, SQL-driven segmentatie, en Salesforce Marketing Cloud.',
    priceRange: '€3.800-4.500/maand',
    telephone: '+31687975656',
    email: 'samba@sambajarju.nl',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rotterdam',
      addressCountry: 'NL',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </>
  );
}
