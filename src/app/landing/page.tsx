'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

interface BrandData {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  companyName: string;
}

function LandingContent() {
  const params = useSearchParams();
  const company = params.get('company') || '';
  const contactName = params.get('contactname') || '';
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) { setLoading(false); return; }

    // Fetch logo from Logo.dev
    const logoUrl = `https://img.logo.dev/${company}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN || 'pk_abc'}&size=200&format=png`;
    const name = company.replace(/\.(com|nl|io|app|org|net|co)$/i, '');
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    setBrand({
      logoUrl,
      primaryColor: '#023047',
      secondaryColor: '#EF476F',
      companyName: capitalizedName,
    });
    setLoading(false);

    // Track page view
    fetch('/api/landing/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, contactName, path: window.location.href }),
    }).catch(() => {});
  }, [company, contactName]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#023047' }}>
        <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#EF476F', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!company) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Missing company parameter. Use: /landing?company=nike.com&contactname=Peter</p>
      </div>
    );
  }

  const greeting = contactName
    ? `Hey ${contactName},`
    : `Hey there,`;

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero */}
      <section style={{
        minHeight: '70vh',
        background: brand?.primaryColor || '#023047',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 24px',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
          {/* Logos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EF476F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>SJ</div>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>×</span>
            {brand?.logoUrl && (
              <img
                src={brand.logoUrl}
                alt={brand.companyName}
                width={48}
                height={48}
                style={{ borderRadius: 12, background: '#fff', padding: 4, objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>

          <p style={{ color: '#A7DADC', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 12px' }}>Persoonlijk voor {brand?.companyName}</p>

          <h1 style={{ color: '#ffffff', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 20px' }}>
            {greeting}<br />
            <span style={{ color: '#A7DADC' }}>hier is hoe ik {brand?.companyName} kan helpen.</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, lineHeight: 1.7, maxWidth: 560, margin: '0 0 32px' }}>
            Ik ben Samba Jarju — Email Marketeer & Marketing Automation Specialist. Bij Vandebron verstuur ik 500.000+ emails per maand met Salesforce Marketing Cloud, SQL en AMPScript. Ik bouw ook web-apps als side projects.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:samba@sambajarju.nl" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 9999,
              background: '#EF476F', color: '#fff', fontWeight: 600,
              fontSize: 14, textDecoration: 'none',
            }}>
              Laten we praten
            </a>
            <a href="https://www.linkedin.com/in/sambajarju/" target="_blank" rel="noopener" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 9999,
              border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontWeight: 500,
              fontSize: 14, textDecoration: 'none',
            }}>
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* What I can do section */}
      <section style={{ padding: '80px 24px', background: '#FAFBFC' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#023047', margin: '0 0 32px' }}>
            Wat ik voor {brand?.companyName} kan betekenen
          </h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { title: 'Email Marketing & Automation', desc: 'Campagnes opzetten, A/B testen, flows bouwen en 500k+ emails per maand versturen. Salesforce Marketing Cloud, Deployteq, SQL/AMPScript.' },
              { title: 'Data-driven CRO', desc: 'Google Analytics, Hotjar heatmaps, VWO A/B testing. Bij Kes Visum verhoogde ik de conversie naar 4.4% met 80+ leads per maand.' },
              { title: 'Marketing Technologie', desc: 'HubSpot, Pipedrive, Zapier/Make integraties. Ik verbind systemen en automatiseer repetitieve taken.' },
              { title: 'Web Development', desc: 'Next.js, React, Supabase, Vercel. Ik bouw ook web-apps — PayWatch.app is mijn eigen AI-powered bill tracker.' },
            ].map(({ title, desc }) => (
              <div key={title} style={{ padding: 24, borderRadius: 12, background: '#fff', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#023047', margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#4A6B7F', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '60px 24px', background: '#023047', textAlign: 'center' }}>
        <p style={{ color: '#A7DADC', fontSize: 14, margin: '0 0 8px' }}>Interesse?</p>
        <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 20px' }}>Laten we een koffie doen ☕</h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:samba@sambajarju.nl" style={{ padding: '12px 24px', borderRadius: 9999, background: '#EF476F', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            samba@sambajarju.nl
          </a>
          <a href="tel:+31687975656" style={{ padding: '12px 24px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
            +31 6 87975656
          </a>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 32 }}>Samba Jarju · KvK 83474889 · Rotterdam</p>
      </section>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#023047' }} />}>
      <LandingContent />
    </Suspense>
  );
}
