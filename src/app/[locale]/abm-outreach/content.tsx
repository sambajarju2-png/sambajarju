'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Database, Mail, Brain, FileText, QrCode, Globe, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { urlFor } from '@/lib/sanity';
import { useState, useCallback, useEffect } from 'react';

interface SanityStep {
  title_nl?: string;
  title_en?: string;
  description_nl?: string;
  description_en?: string;
  tool?: string;
  screenshot?: { caption?: string; asset?: { _id: string; url: string } };
}

interface SanityData {
  title_nl?: string;
  title_en?: string;
  subtitle_nl?: string;
  subtitle_en?: string;
  steps?: SanityStep[];
  gallery?: { caption?: string; alt?: string; asset?: { _id: string; url: string } }[];
  techStack?: string[];
}

const fallbackSteps = [
  {
    icon: <Database className="w-6 h-6" />,
    title_nl: 'Data verzamelen via Apollo.io',
    title_en: 'Data collection via Apollo.io',
    description_nl: 'Ik gebruik Apollo.io om bedrijfsdata en contactgegevens van potentiele klanten te vinden. Op basis van filters zoals bedrijfsgrootte, branche en functietitel stel ik een gerichte lijst samen van decision makers.',
    description_en: 'I use Apollo.io to find company data and contact information of potential clients. Based on filters like company size, industry and job title, I compile a targeted list of decision makers.',
    tool: 'Apollo.io',
    color: '#6366F1',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title_nl: 'Import in mijn admin dashboard',
    title_en: 'Import into my admin dashboard',
    description_nl: 'De contactgegevens worden als CSV geimporteerd in mijn zelfgebouwde admin dashboard op sambajarju.com/admin. Hier beheer ik alle outreach: enkele verzendingen of bulk imports met taalvoorkeur per contact (NL/EN).',
    description_en: 'Contact data is imported as CSV into my custom-built admin dashboard at sambajarju.com/admin. Here I manage all outreach: single sends or bulk imports with language preference per contact (NL/EN).',
    tool: 'Custom Admin (Next.js + Supabase)',
    color: '#3FCF8E',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title_nl: 'AI personalisatie met Claude Haiku',
    title_en: 'AI personalization with Claude Haiku',
    description_nl: 'Voor elk bedrijf haalt mijn systeem automatisch het logo op via Logo.dev, extraheert de merkkleur met Color Thief, en gebruikt Claude Haiku om een gepersonaliseerde tagline en begroeting te genereren.',
    description_en: 'For each company, my system automatically fetches the logo via Logo.dev, extracts the brand color with Color Thief, and uses Claude Haiku to generate a personalized tagline and greeting.',
    tool: 'Claude Haiku + Logo.dev + Color Thief',
    color: '#D97757',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title_nl: 'Branded CV met QR-code',
    title_en: 'Branded CV with QR code',
    description_nl: 'Via de YakPDF API genereer ik een gepersonaliseerd CV in PDF-formaat. Het CV bevat de merkkleur en het logo van het bedrijf, een QR-code die linkt naar een gepersonaliseerde landingspagina, en al mijn actuele werkervaring en skills.',
    description_en: 'Through the YakPDF API, I generate a personalized CV in PDF format. The CV includes the brand color and logo of the company, a QR code linking to a personalized landing page, and all my current work experience and skills.',
    tool: 'YakPDF API',
    color: '#EF476F',
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title_nl: 'Email verzending via Mailgun',
    title_en: 'Email delivery via Mailgun',
    description_nl: 'De gepersonaliseerde email wordt verstuurd via de Mailgun EU API. Het CV wordt als PDF bijlage meegestuurd. De email bevat een CTA naar de gepersonaliseerde landingspagina. Alles wordt gelogd in Supabase voor tracking.',
    description_en: 'The personalized email is sent via the Mailgun EU API. The CV is attached as a PDF. The email contains a CTA to the personalized landing page. Everything is logged in Supabase for tracking.',
    tool: 'Mailgun EU API',
    color: '#F06B66',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title_nl: 'Gepersonaliseerde landingspagina',
    title_en: 'Personalized landing page',
    description_nl: 'Elke ontvanger krijgt een unieke landingspagina op sambajarju.com/landing?company=bedrijf.nl&contactname=Naam. De pagina toont het bedrijfslogo, merkkleur, een persoonlijke begroeting en mijn portfolio. Alles volledig gebranded.',
    description_en: 'Each recipient gets a unique landing page at sambajarju.com/landing?company=company.com&contactname=Name. The page shows the company logo, brand color, a personal greeting and my portfolio. Fully branded.',
    tool: 'Next.js + Personalize API',
    color: '#023047',
  },
  {
    icon: <QrCode className="w-6 h-6" />,
    title_nl: 'QR-code op het CV',
    title_en: 'QR code on the CV',
    description_nl: 'Het CV bevat een QR-code die direct linkt naar de gepersonaliseerde landingspagina. Zo kan de ontvanger ook vanuit een geprint CV direct naar mijn online profiel navigeren.',
    description_en: 'The CV contains a QR code that links directly to the personalized landing page. This way the recipient can navigate to my online profile even from a printed CV.',
    tool: 'QR Server API',
    color: '#29B5E8',
  },
];

const techStack = ['Apollo.io', 'Next.js 16', 'Supabase', 'Mailgun EU', 'Claude Haiku', 'YakPDF API', 'Logo.dev', 'Color Thief', 'QR Server API', 'Vercel'];

function Gallery({ images }: { images: { caption?: string; alt?: string; asset?: { _id: string; url: string } }[] }) {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent(c => (c + 1) % images.length), [images.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, images.length]);

  if (!images.length) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
      <div className="relative aspect-[16/9]">
        {images.map((img, i) => (
          <div key={i} className="absolute inset-0 transition-all duration-700" style={{ opacity: i === current ? 1 : 0 }}>
            {img.asset?.url && <Image src={urlFor(img.asset).width(1000).height(562).url()} alt={img.alt || img.caption || ''} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" />}
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer" style={{ backgroundColor: 'rgba(255,255,255,0.8)', color: '#023047' }}><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer" style={{ backgroundColor: 'rgba(255,255,255,0.8)', color: '#023047' }}><ChevronRight className="w-5 h-5" /></button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className="w-2 h-2 rounded-full transition-all cursor-pointer" style={{ backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.4)', transform: i === current ? 'scale(1.5)' : 'scale(1)' }} />)}
          </div>
        </>
      )}
      {images[current]?.caption && <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent"><p className="text-white text-sm">{images[current].caption}</p></div>}
    </div>
  );
}

export function AbmOutreachContent({ sanityData }: { sanityData: SanityData | null }) {
  const locale = useLocale();
  const isEN = locale === 'en';

  const steps = sanityData?.steps?.length
    ? sanityData.steps.map((s, i) => ({ ...fallbackSteps[i], ...s }))
    : fallbackSteps;

  const gallery = sanityData?.gallery || [];
  const stack = sanityData?.techStack?.length ? sanityData.techStack : techStack;

  const t = (nl?: string, en?: string) => isEN ? (en || nl || '') : (nl || en || '');

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #023047 0%, #034067 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #EF476F 0%, transparent 50%), radial-gradient(circle at 80% 30%, #3FCF8E 0%, transparent 50%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: '#A7DADC' }}>
              <ArrowLeft className="w-4 h-4" /> {isEN ? 'Back to home' : 'Terug naar home'}
            </Link>
          </motion.div>
          <motion.p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#EF476F' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {isEN ? 'Case Study' : 'Case Study'}
          </motion.p>
          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {t(sanityData?.title_nl, sanityData?.title_en) || (isEN ? <>My <span style={{ color: '#EF476F' }}>ABM Outreach</span> System</> : <>Mijn <span style={{ color: '#EF476F' }}>ABM Outreach</span> Systeem</>)}
          </motion.h1>
          <motion.p className="text-lg md:text-xl max-w-3xl leading-relaxed" style={{ color: '#A7DADC' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            {t(sanityData?.subtitle_nl, sanityData?.subtitle_en) || (isEN
              ? 'How I built a fully automated Account-Based Marketing pipeline that finds prospects, personalizes everything with AI, generates branded CVs with QR codes, and delivers personalized landing pages for every company.'
              : 'Hoe ik een volledig geautomatiseerde Account-Based Marketing pipeline heb gebouwd die prospects vindt, alles personaliseert met AI, branded CVs genereert met QR-codes, en gepersonaliseerde landingspaginas levert voor elk bedrijf.'
            )}
          </motion.p>
        </div>
      </section>

      {/* Tech stack pills */}
      <section className="py-8 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-2">
            {stack.map(t => (
              <span key={t} className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline steps */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 className="text-2xl md:text-3xl font-black mb-4 text-foreground" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {isEN ? 'The Pipeline' : 'De Pipeline'}
          </motion.h2>
          <motion.p className="text-foreground-muted mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {isEN ? 'From data to delivery in 7 automated steps.' : 'Van data tot levering in 7 geautomatiseerde stappen.'}
          </motion.p>

          <div className="space-y-8">
            {steps.map((step, i) => {
              const fb = fallbackSteps[i] || fallbackSteps[0];
              return (
                <motion.div
                  key={i}
                  className="relative pl-16 pb-8"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  {/* Connector line */}
                  {i < steps.length - 1 && <div className="absolute left-[23px] top-14 bottom-0 w-[2px] bg-border" />}

                  {/* Step number + icon */}
                  <div className="absolute left-0 top-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${fb.color}15`, color: fb.color }}>
                    {fb.icon}
                  </div>

                  {/* Content */}
                  <div className="rounded-2xl border border-border bg-surface p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-mono tracking-widest" style={{ color: '#EF476F' }}>STAP {String(i + 1).padStart(2, '0')}</span>
                      {(step.tool || fb.tool) && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-background-alt text-foreground-subtle">{step.tool || fb.tool}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {t(step.title_nl, step.title_en)}
                    </h3>
                    <p className="text-foreground-muted leading-relaxed">
                      {t(step.description_nl, step.description_en)}
                    </p>

                    {/* Screenshot placeholder */}
                    {step.screenshot?.asset?.url ? (
                      <div className="mt-4 rounded-xl overflow-hidden border border-border">
                        <Image src={urlFor(step.screenshot.asset).width(800).height(450).url()} alt={step.screenshot.caption || ''} width={800} height={450} className="w-full h-auto" />
                        {step.screenshot.caption && <p className="text-xs text-foreground-subtle p-2 text-center">{step.screenshot.caption}</p>}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border-2 border-dashed border-border bg-background-alt p-8 text-center">
                        <p className="text-xs text-foreground-subtle">{isEN ? 'Screenshot placeholder. Add via Sanity CMS.' : 'Screenshot placeholder. Voeg toe via Sanity CMS.'}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery from Sanity */}
      {gallery.length > 0 && (
        <section className="py-16 bg-background-alt">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-black mb-8 text-foreground">{isEN ? 'Examples' : 'Voorbeelden'}</h2>
            <Gallery images={gallery} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: '#023047' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {isEN ? 'Want to see it in action?' : 'Wil je het in actie zien?'}
          </motion.h2>
          <motion.p className="text-lg mb-8" style={{ color: '#A7DADC' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {isEN ? 'Test the ABM system with your own company.' : 'Test het ABM-systeem met je eigen bedrijf.'}
          </motion.p>
          <motion.div className="flex gap-4 justify-center flex-wrap" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Link href="/for" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-transform hover:scale-105" style={{ backgroundColor: '#EF476F' }}>
              {isEN ? 'Try it now' : 'Probeer het nu'} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-transform hover:scale-105" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
              {isEN ? 'Get in touch' : 'Neem contact op'}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
