'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface BrandData {
  logo?: string;
  tagline?: string;
  brandColor?: string;
  companyName?: string;
}

export default function DynamicContent() {
  const searchParams = useSearchParams();
  const company = searchParams?.get('company') || '';
  const contactname = searchParams?.get('contactname') || '';
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!company) return;
    setLoading(true);
    fetch('/api/personalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company }),
    })
      .then(r => r.json())
      .then(d => setBrand(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [company]);

  const accentColor = brand?.brandColor || '#EF476F';

  if (!company) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, fontFamily: 'system-ui, sans-serif', background: '#FAFBFC', color: '#023047', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Dynamic Content Test</h1>
      <p style={{ color: '#8BA3B5', textAlign: 'center', maxWidth: 400 }}>
        Add <code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 }}>?company=nike.com&contactname=Peter</code> to the URL to see personalized content.
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['nike.com', 'stripe.com', 'klm.com', 'shell.com', 'kpn.com'].map(d => (
          <a key={d} href={`?company=${d}&contactname=Test`} style={{ padding: '8px 16px', borderRadius: 8, background: '#023047', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>{d}</a>
        ))}
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', background: '#FAFBFC' }}>
      <Loader2 size={24} className="animate-spin" style={{ color: '#8BA3B5' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#FAFBFC' }}>
      <div style={{ background: `linear-gradient(135deg, #023047 0%, ${accentColor}22 100%)`, padding: '80px 24px', textAlign: 'center' }}>
        {brand?.logo && (
          <img src={brand.logo} alt="" style={{ width: 64, height: 64, borderRadius: 12, marginBottom: 16, background: '#fff', padding: 8 }} />
        )}
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>
          {contactname ? `${contactname}, ` : ''}Helping {brand?.companyName || company} grow with data-driven marketing
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto' }}>
          {brand?.tagline || `Personalized marketing automation for ${company}`}
        </p>
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <a href="/contact" style={{ padding: '12px 28px', borderRadius: 8, background: accentColor, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>Book a call</a>
          <a href="/projects" style={{ padding: '12px 28px', borderRadius: 8, background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>View my work</a>
        </div>
      </div>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EDF2', padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#023047', margin: '0 0 12px' }}>What I can do for {brand?.companyName || company}</h2>
          {[
            { title: 'Email Marketing at Scale', desc: `Run 500k+ emails/month with SQL-driven segmentation tailored to ${brand?.companyName || company}'s audience.` },
            { title: 'Marketing Automation', desc: `Build customer journeys in Salesforce MC, Deployteq, or HubSpot optimized for ${brand?.companyName || company}.` },
            { title: 'Data-Driven CRO', desc: `A/B testing, analytics, and conversion optimization to maximize ${brand?.companyName || company}'s marketing ROI.` },
          ].map((item, i) => (
            <div key={i} style={{ padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #f4f7fa', marginBottom: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#023047', margin: '0 0 4px' }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: '#4A6B7F', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#8BA3B5', textAlign: 'center', marginTop: 24 }}>
          Dynamically generated for <strong style={{ color: '#023047' }}>{brand?.companyName || company}</strong>
          {' '}<a href="/test-dynamic" style={{ color: '#EF476F' }}>Try another</a>
        </p>
      </div>
    </div>
  );
}
