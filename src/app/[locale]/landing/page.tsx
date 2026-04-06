'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Phone, Code, BarChart3, Zap, ArrowRight, Briefcase } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';

interface BrandData {
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  greeting: string;
  tagline: string;
  logoUrl: string;
}

function LandingContent() {
  const params = useSearchParams();
  const company = params.get('company') || '';
  const contactName = params.get('contactname') || '';
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) { setLoading(false); return; }

    // Use existing personalize API (Color Thief + Claude Haiku + Logo.dev)
    fetch('/api/personalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company }),
    })
      .then(r => r.json())
      .then(data => {
        setBrand({
          companyName: data.companyName || company,
          primaryColor: data.primaryColor || '#023047',
          secondaryColor: data.secondaryColor || '#EF476F',
          greeting: data.greeting || '',
          tagline: data.tagline || '',
          logoUrl: data.logoUrl || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Track page view
    fetch('/api/landing/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, contactName, path: typeof window !== 'undefined' ? window.location.href : '' }),
    }).catch(() => {});
  }, [company, contactName]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid rgba(2,48,71,0.15)', borderTopColor: '#EF476F', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!company) {
    return (
      <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-foreground-muted">Use: /landing?company=nike.com&contactname=Peter</p>
      </section>
    );
  }

  const name = brand?.companyName || company;
  const primary = brand?.primaryColor || '#023047';
  const secondary = brand?.secondaryColor || '#EF476F';
  const greeting = contactName ? `Hey ${contactName},` : 'Hey daar,';

  // Generate a gradient from brand colors
  const heroGradient = `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;

  const skills = [
    { icon: Mail, title: 'Email Marketing & Automation', desc: `Campagnes opzetten, A/B testen, flows bouwen. Bij Vandebron verstuur ik 500k+ emails per maand met Salesforce Marketing Cloud, SQL en AMPScript.` },
    { icon: BarChart3, title: 'Data-driven CRO', desc: 'Google Analytics, Hotjar heatmaps, VWO A/B testing. Bij Kes Visum verhoogde ik de conversie naar 4.4% met 80+ leads per maand.' },
    { icon: Zap, title: 'Marketing Technologie', desc: 'HubSpot, Pipedrive, Zapier/Make integraties. Ik verbind systemen en automatiseer workflows.' },
    { icon: Code, title: 'Web Development', desc: 'Next.js, React, Supabase, Vercel. PayWatch.app is mijn eigen AI-powered bill tracker.' },
  ];

  return (
    <>
      {/* Hero — branded with Color Thief colors */}
      <section className="relative overflow-hidden" style={{ background: heroGradient }}>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          {/* Logos */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
            {brand?.logoUrl && (
              <img
                src={brand.logoUrl}
                alt={name}
                width={56} height={56}
                style={{ borderRadius: 16, background: '#fff', padding: 6, objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Speciaal voor</p>
              <p style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{name}</p>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6" style={{ color: '#ffffff' }}>
            {brand?.tagline || `Automatisering voor ${name}`}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.7, maxWidth: 560, marginBottom: 32 }}>
            {brand?.greeting || `Samba Jarju helpt ${name} om de betrokkenheid van klanten te vergroten en conversies te maximaliseren door geavanceerde email marketing en marketing automation in te zetten.`}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-wrap gap-3">
            <a href="mailto:samba@sambajarju.nl" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 9999, background: '#fff', color: primary, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              <Mail style={{ width: 16, height: 16 }} /> Contact opnemen <ArrowRight style={{ width: 14, height: 14 }} />
            </a>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
              <Briefcase style={{ width: 16, height: 16 }} /> Bekijk mijn werk
            </a>
          </motion.div>

          {/* Samba badge */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', maxWidth: 'fit-content' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EF476F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>SJ</div>
            <div>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>Samba Jarju</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0 }}>Email Marketeer & Marketing Automation Specialist</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills section */}
      <section className="py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          {contactName && (
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-foreground-muted text-sm mb-2">
              {greeting}
            </motion.p>
          )}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl sm:text-3xl font-bold text-foreground mb-10">
            Wat ik voor {name} kan betekenen
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-surface border border-border"
                style={{ boxShadow: 'var(--card-shadow)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${primary}15` }}>
                  <Icon className="w-5 h-5" style={{ color: primary }} />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-2">{title}</h3>
                <p className="text-foreground-muted text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6" style={{ background: heroGradient }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Interesse? Laten we praten.</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="mailto:samba@sambajarju.nl" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 9999, background: '#fff', color: primary, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              <Mail style={{ width: 14, height: 14 }} /> samba@sambajarju.nl
            </a>
            <a href="tel:+31687975656" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
              <Phone style={{ width: 14, height: 14 }} /> +31 6 87975656
            </a>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 32 }}>Samba Jarju · KvK 83474889 · Rotterdam</p>
        </div>
      </section>
    </>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 32, height: 32, border: '3px solid rgba(2,48,71,0.15)', borderTopColor: '#EF476F', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>}>
      <LandingContent />
    </Suspense>
  );
}
