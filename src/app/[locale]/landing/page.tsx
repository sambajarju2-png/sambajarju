'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone,  Briefcase, Code, BarChart3, Zap } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';

function LandingContent() {
  const params = useSearchParams();
  const t = useTranslations('landing');
  const company = params.get('company') || '';
  const contactName = params.get('contactname') || '';
  const [logoUrl, setLogoUrl] = useState('');

  const domain = company;
  const companyName = company.replace(/\.(com|nl|io|app|org|net|co|de|uk)$/i, '').replace(/^(www\.)?/, '');
  const displayName = companyName.charAt(0).toUpperCase() + companyName.slice(1);

  useEffect(() => {
    if (!company) return;
    const token = (typeof window !== 'undefined' && (window as Record<string, unknown>).__LOGO_TOKEN) || '';
    setLogoUrl(`https://img.logo.dev/${company}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN || token}&size=200&format=png`);

    // Track page view
    fetch('/api/landing/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, contactName, path: window.location.href }),
    }).catch(() => {});
  }, [company, contactName]);

  if (!company) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <p className="text-foreground-muted">Missing company parameter. Use: /landing?company=nike.com&contactname=Peter</p>
      </section>
    );
  }

  const greeting = contactName ? `Hey ${contactName},` : 'Hey there,';

  const skills = [
    { icon: Mail, title: 'Email Marketing & Automation', desc: 'Campagnes opzetten, A/B testen, flows bouwen en 500k+ emails per maand versturen. Salesforce Marketing Cloud, Deployteq, SQL/AMPScript.' },
    { icon: BarChart3, title: 'Data-driven CRO', desc: 'Google Analytics, Hotjar heatmaps, VWO A/B testing. Bij Kes Visum verhoogde ik de conversie naar 4.4% met 80+ leads per maand.' },
    { icon: Zap, title: 'Marketing Technologie', desc: 'HubSpot, Pipedrive, Zapier/Make integraties. Ik verbind systemen en automatiseer repetitieve taken.' },
    { icon: Code, title: 'Web Development', desc: 'Next.js, React, Supabase, Vercel. Ik bouw ook web-apps — PayWatch.app is mijn eigen AI-powered bill tracker.' },
  ];

  return (
    <>
      {/* Hero — same dark style as main site */}
      <section className="relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
        <div className="absolute w-72 h-72 rounded-full blur-[140px] pointer-events-none" style={{ background: 'rgba(239,71,111,0.12)', left: '10%', top: '20%' }} />
        <div className="absolute w-56 h-56 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(167,218,220,0.1)', right: '15%', bottom: '20%' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          {/* Logos */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-10">
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EF476F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>SJ</div>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 20 }}>×</span>
            {logoUrl && (
              <img
                src={logoUrl}
                alt={displayName}
                width={48} height={48}
                style={{ borderRadius: 12, background: '#fff', padding: 4, objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ color: '#A7DADC', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Persoonlijk voor {displayName}
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            <span style={{ color: '#ffffff' }}>{greeting}</span><br />
            <span style={{ color: '#A7DADC' }}>hier is hoe ik {displayName} kan helpen.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, maxWidth: 540, marginBottom: 32 }}>
            Ik ben Samba Jarju — Email Marketeer & Marketing Automation Specialist. Bij Vandebron verstuur ik 500.000+ emails per maand met Salesforce Marketing Cloud, SQL en AMPScript. Ik bouw ook web-apps als side projects.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-3">
            <a href="mailto:samba@sambajarju.nl" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 9999, background: '#EF476F', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              <Mail style={{ width: 16, height: 16 }} /> Laten we praten
            </a>
            <a href="https://www.linkedin.com/in/sambajarju/" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
              <Mail style={{ width: 16, height: 16 }} /> LinkedIn
            </a>
          </motion.div>
        </div>
      </section>

      {/* What I can do */}
      <section className="py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl sm:text-3xl font-bold text-foreground mb-10">
            Wat ik voor {displayName} kan betekenen
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-surface border border-border"
                style={{ boxShadow: 'var(--card-shadow)' }}
              >
                <div className="w-10 h-10 rounded-xl bg-background-alt flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-2">{title}</h3>
                <p className="text-foreground-muted text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--hero-gradient)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p style={{ color: '#A7DADC', fontSize: 13, marginBottom: 8 }}>Interesse?</p>
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Laten we een koffie doen</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="mailto:samba@sambajarju.nl" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 9999, background: '#EF476F', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              <Mail style={{ width: 14, height: 14 }} /> samba@sambajarju.nl
            </a>
            <a href="tel:+31687975656" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
              <Phone style={{ width: 14, height: 14 }} /> +31 6 87975656
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--hero-gradient)' }} />}>
      <LandingContent />
    </Suspense>
  );
}
