'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Briefcase, ArrowLeft, Phone, Code, BarChart3, Zap } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface BrandData {
  companyName: string;
  domain: string;
  primaryColor: string;
  secondaryColor: string;
  allColors: string[];
  greeting: string;
  tagline: string;
  logo: string | null;
}

// Exact same loading overlay as /for page
function LoadingOverlay({ company }: { company: string }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'var(--hero-gradient)' }}
    >
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="load-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#load-grid)" />
        </svg>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white text-xl font-bold mx-auto mb-6 shadow-lg shadow-accent/30"
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          SJ
        </motion.div>
        <h1 className="text-2xl font-extrabold text-white mb-2">Samba Jarju</h1>
        <p className="text-white/50 text-sm mb-8">Email Marketeer & Marketing Automation</p>
        <div className="flex items-center gap-3 justify-center">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-accent" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
          <motion.div className="w-1.5 h-1.5 rounded-full bg-teal" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} />
          <motion.div className="w-1.5 h-1.5 rounded-full bg-white" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} />
        </div>
        <p className="text-white/30 text-xs mt-4">
          Preparing experience for <span className="text-white/60 font-medium">{company}</span>
        </p>
      </motion.div>
    </motion.div>
  );
}

function LandingContent() {
  const searchParams = useSearchParams();
  const company = searchParams.get('company') || '';
  const contactName = searchParams.get('contactname') || '';
  const locale = useLocale();
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(!!company);
  const [showLoader, setShowLoader] = useState(!!company);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (!company) return;

    fetch('/api/personalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company }),
    })
      .then(r => r.json())
      .then(data => {
        setBrandData(data);
        setLoading(false);
        setTimeout(() => setShowLoader(false), 200);
      })
      .catch(() => {
        setLoading(false);
        setShowLoader(false);
      });

    // Track page view
    fetch('/api/landing/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, contactName, path: typeof window !== 'undefined' ? window.location.href : '' }),
    }).catch(() => {});
  }, [company, contactName]);

  if (!company) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-foreground-muted text-sm">Use: /landing?company=nike.com&contactname=Peter</p>
      </div>
    );
  }

  const name = brandData?.companyName || company;
  const primary = brandData?.primaryColor || '#023047';
  const secondary = brandData?.secondaryColor || brandData?.primaryColor || '#023047';

  const skills = [
    { icon: Mail, title: 'Email Marketing & Automation', desc: 'Campagnes opzetten, A/B testen, flows bouwen. Bij Vandebron verstuur ik 500k+ emails per maand met Salesforce Marketing Cloud, SQL en AMPScript.' },
    { icon: BarChart3, title: 'Data-driven CRO', desc: 'Google Analytics, Hotjar heatmaps, VWO A/B testing. Bij Kes Visum verhoogde ik de conversie naar 4.4% met 80+ leads per maand.' },
    { icon: Zap, title: 'Marketing Technologie', desc: 'HubSpot, Pipedrive, Zapier/Make integraties. Ik verbind systemen en automatiseer workflows.' },
    { icon: Code, title: 'Web Development', desc: 'Next.js, React, Supabase, Vercel. PayWatch.app is mijn eigen AI-powered bill tracker.' },
  ];

  return (
    <>
      {/* Loading overlay — same as /for page */}
      <AnimatePresence>
        {showLoader && <LoadingOverlay company={company} />}
      </AnimatePresence>

      <div className="min-h-screen">
        {/* Branded hero — only shows after loading */}
        <AnimatePresence mode="wait">
          {brandData && !loading && (
            <motion.div
              key={brandData.domain}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${primary} 0%, ${secondary}dd 50%, ${primary}ee 100%)` }}
            >
              {/* Grid texture */}
              <div className="absolute inset-0 opacity-[0.06]">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="brand-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#brand-grid)" />
                </svg>
              </div>
              <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-[120px] opacity-30" style={{ background: secondary || 'white' }} />

              <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-16">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors mb-8">
                  <ArrowLeft className="w-4 h-4" /> sambajarju.com
                </Link>

                {/* Company logo + name */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-6">
                  {brandData.logo && !logoError ? (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white flex items-center justify-center p-2 shadow-lg">
                      <img src={brandData.logo} alt={name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" onError={() => setLogoError(true)} />
                    </div>
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-xl font-bold text-white">
                      {name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider font-medium">Speciaal voor</p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{name}</h1>
                  </div>
                </motion.div>

                {/* Tagline */}
                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-4">
                  {brandData.tagline || `Marketing automation voor ${name}`}
                </motion.h2>

                {/* Greeting — personalized with contact name */}
                <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed mb-3">
                  {contactName ? `Hey ${contactName}, ` : ''}{brandData.greeting || `Samba Jarju helpt ${name} met email marketing en marketing automation.`}
                </motion.p>

                {contactName && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="text-sm text-white/50 max-w-xl leading-relaxed mb-8">
                    Ik werk ook als freelancer bij Cleanprofs.nl waar ik Deployteq gebruik om geautomatiseerde email campagnes te bouwen.
                  </motion.p>
                )}

                {!contactName && <div className="mb-8" />}

                {/* CTAs */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-3">
                  <a href={`mailto:samba@sambajarju.com?subject=Samenwerking ${name}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-sm font-semibold transition-all hover:shadow-lg w-full sm:w-auto" style={{ color: primary }}>
                    <Mail className="w-4 h-4" /> Contact opnemen <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-all w-full sm:w-auto">
                    <Briefcase className="w-4 h-4" /> Bekijk mijn werk
                  </Link>
                </motion.div>

                {/* Samba badge */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 pt-6 border-t border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">SJ</div>
                  <div>
                    <p className="text-white text-sm font-semibold">Samba Jarju</p>
                    <p className="text-white/50 text-xs">Email Marketeer & Marketing Automation Specialist</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skills section — only shows after brand data loads */}
        {brandData && !loading && (
          <div className="py-16 sm:py-20 px-4 sm:px-6 bg-background">
            <div className="max-w-3xl mx-auto">
              {contactName && <p className="text-foreground-muted text-sm mb-2">Hey {contactName},</p>}
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-10">Wat ik voor {name} kan betekenen</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {skills.map(({ icon: Icon, title, desc }, i) => (
                  <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-5 rounded-2xl bg-surface border border-border" style={{ boxShadow: 'var(--card-shadow)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${primary}15` }}>
                      <Icon className="w-5 h-5" style={{ color: primary }} />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-2">{title}</h3>
                    <p className="text-foreground-muted text-xs leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA footer */}
        {brandData && !loading && (
          <div className="py-16 px-4 sm:px-6" style={{ background: `linear-gradient(135deg, ${primary} 0%, ${secondary}dd 100%)` }}>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-white text-xl sm:text-2xl font-bold mb-6">Interesse? Laten we praten.</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                <a href="mailto:samba@sambajarju.com" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-sm font-semibold" style={{ color: primary }}>
                  <Mail className="w-4 h-4" /> samba@sambajarju.com
                </a>
                <a href="tel:+31687975656" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/30 text-white text-sm font-medium">
                  <Phone className="w-4 h-4" /> +31 6 87975656
                </a>
              </div>
              <p className="text-white/30 text-xs mt-8">Samba Jarju · KvK 83474889 · Rotterdam</p>
            </div>
          </div>
        )}
      </div>
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
