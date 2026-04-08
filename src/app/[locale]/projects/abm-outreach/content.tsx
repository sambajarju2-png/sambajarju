'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Database, Mail, FileText, Globe, Brain, QrCode, BarChart3, Upload, Users, Zap } from 'lucide-react';
import { useLocale } from 'next-intl';
import { urlFor } from '@/lib/sanity';

interface SanityProject {
  title?: string;
  screenshots?: { caption?: string; asset?: { _id: string; url: string } }[];
  [key: string]: unknown;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  }),
};

const pipelineSteps = {
  nl: [
    { icon: Database, color: '#6366F1', title: 'Data verzamelen via Apollo.io', desc: 'Ik zoek bedrijven en contactpersonen op basis van industrie, functietitel en regio. Apollo.io levert de contactgegevens, bedrijfsinformatie en beslissers.' },
    { icon: Upload, color: '#EF476F', title: 'Import via Admin Dashboard', desc: 'Contacten worden via CSV ge-upload naar mijn admin panel op sambajarju.com/admin. Per contact stel ik de taal in (NL of EN), de functie en het bedrijfsdomein.' },
    { icon: Brain, color: '#D97757', title: 'AI Personalisatie (Claude Haiku)', desc: 'Claude Haiku genereert een persoonlijke begroeting en tagline per bedrijf. Samen met Logo.dev (bedrijfslogo) en ColorThief (merkkleur extractie) wordt elk contactpunt volledig gepersonaliseerd.' },
    { icon: FileText, color: '#2563eb', title: 'Branded CV generatie (YakPDF)', desc: 'Per bedrijf wordt een op maat gemaakt PDF CV gegenereerd met de merkkleur van het bedrijf, hun logo, een QR-code naar hun persoonlijke landingspagina, en al mijn actuele werkervaring en tools.' },
    { icon: Mail, color: '#F06B66', title: 'Email verzending via Mailgun', desc: 'Een gepersonaliseerde email wordt verstuurd via de Mailgun EU API, met het branded CV als bijlage. De email bevat een CTA naar de persoonlijke landingspagina.' },
    { icon: Globe, color: '#3FCF8E', title: 'Persoonlijke Landing Page', desc: 'Elke ontvanger krijgt een unieke landingspagina op sambajarju.com/landing?company=bedrijf.nl met hun bedrijfslogo, merkkleur en een persoonlijke boodschap.' },
    { icon: QrCode, color: '#023047', title: 'QR Code op CV', desc: 'Het PDF CV bevat een QR-code die direct linkt naar de persoonlijke landingspagina. Handig voor als het CV wordt geprint of doorgestuurd.' },
    { icon: BarChart3, color: '#FF4F00', title: 'Tracking en opvolging', desc: 'Mailgun webhooks tracken opens, clicks en replies. Inkomende replies worden opgeslagen in Supabase en zijn zichtbaar in het admin dashboard.' },
  ],
  en: [
    { icon: Database, color: '#6366F1', title: 'Data collection via Apollo.io', desc: 'I search for companies and contacts based on industry, job title and region. Apollo.io provides contact details, company info and decision makers.' },
    { icon: Upload, color: '#EF476F', title: 'Import via Admin Dashboard', desc: 'Contacts are uploaded via CSV to my admin panel at sambajarju.com/admin. Per contact I set the language (NL or EN), role and company domain.' },
    { icon: Brain, color: '#D97757', title: 'AI Personalization (Claude Haiku)', desc: 'Claude Haiku generates a personal greeting and tagline per company. Together with Logo.dev (company logo) and ColorThief (brand color extraction), every touchpoint is fully personalized.' },
    { icon: FileText, color: '#2563eb', title: 'Branded CV generation (YakPDF)', desc: 'Per company, a custom PDF CV is generated with the company brand color, their logo, a QR code to their personal landing page, and all my current experience and tools.' },
    { icon: Mail, color: '#F06B66', title: 'Email delivery via Mailgun', desc: 'A personalized email is sent via Mailgun EU API, with the branded CV attached. The email contains a CTA to the personal landing page.' },
    { icon: Globe, color: '#3FCF8E', title: 'Personal Landing Page', desc: 'Each recipient gets a unique landing page at sambajarju.com/landing?company=company.com with their company logo, brand color and a personal message.' },
    { icon: QrCode, color: '#023047', title: 'QR Code on CV', desc: 'The PDF CV contains a QR code linking directly to the personal landing page. Useful when the CV gets printed or forwarded.' },
    { icon: BarChart3, color: '#FF4F00', title: 'Tracking and follow-up', desc: 'Mailgun webhooks track opens, clicks and replies. Incoming replies are stored in Supabase and visible in the admin dashboard.' },
  ],
};

const techStack = [
  { name: 'Apollo.io', desc: 'Lead data', color: '#6366F1' },
  { name: 'Next.js', desc: 'Framework', color: '#000000' },
  { name: 'Supabase', desc: 'Database', color: '#3FCF8E' },
  { name: 'Mailgun', desc: 'Email API', color: '#F06B66' },
  { name: 'Claude AI', desc: 'Personalization', color: '#D97757' },
  { name: 'YakPDF', desc: 'PDF generation', color: '#2563eb' },
  { name: 'Logo.dev', desc: 'Company logos', color: '#000000' },
  { name: 'ColorThief', desc: 'Brand colors', color: '#EF476F' },
];

export function ABMContent({ sanityProject }: { sanityProject: SanityProject | null }) {
  const locale = useLocale();
  const isEN = locale === 'en';
  const steps = isEN ? pipelineSteps.en : pipelineSteps.nl;
  const screenshots = sanityProject?.screenshots || [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #023047 0%, #0a3d5c 50%, #EF476F22 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #EF476F 0%, transparent 40%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: '#A7DADC' }}>
              <ArrowLeft className="w-4 h-4" /> {isEN ? 'All projects' : 'Alle projecten'}
            </Link>
          </motion.div>
          <motion.p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#EF476F' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Case Study
          </motion.p>
          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            ABM <span style={{ color: '#EF476F' }}>Outreach</span> System
          </motion.h1>
          <motion.p className="text-lg md:text-xl max-w-3xl leading-relaxed" style={{ color: '#A7DADC' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            {isEN
              ? 'A fully automated Account-Based Marketing pipeline that generates personalized emails, branded CVs with QR codes, and custom landing pages per company.'
              : 'Een volledig geautomatiseerde Account-Based Marketing pipeline die gepersonaliseerde emails, branded CVs met QR-codes en op maat gemaakte landingspaginas per bedrijf genereert.'}
          </motion.p>

          <motion.div className="flex flex-wrap gap-3 mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Link href="/for" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-white transition-transform hover:scale-105" style={{ backgroundColor: '#EF476F' }}>
              {isEN ? 'Try the demo' : 'Probeer de demo'} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-transform hover:scale-105" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
              {isEN ? 'Get in touch' : 'Neem contact op'}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tech stack bar */}
      <section className="py-10 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {techStack.map((t, i) => (
              <motion.div key={t.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface border border-border">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: t.color }}>{t.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-foreground-subtle">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline steps */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-sm font-mono tracking-widest uppercase mb-3" style={{ color: '#EF476F' }}>
              {isEN ? 'How it works' : 'Hoe het werkt'}
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              {isEN ? 'The full pipeline, step by step' : 'De volledige pipeline, stap voor stap'}
            </h2>
          </motion.div>

          <div className="space-y-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex gap-5 items-start"
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${step.color}15`, color: step.color }}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {i < steps.length - 1 && <div className="w-px h-full min-h-[40px] mt-2" style={{ backgroundColor: `${step.color}30` }} />}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: `${step.color}15`, color: step.color }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-foreground-muted leading-relaxed">{step.desc}</p>

                    {/* Screenshot placeholder from Sanity */}
                    {screenshots[i] && screenshots[i].asset?.url && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-border" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <Image
                          src={urlFor(screenshots[i].asset!).width(800).height(450).url()}
                          alt={screenshots[i].caption || `Step ${i + 1}`}
                          width={800}
                          height={450}
                          className="w-full h-auto"
                        />
                        {screenshots[i].caption && (
                          <p className="text-xs text-foreground-subtle p-3 bg-background-alt">{screenshots[i].caption}</p>
                        )}
                      </div>
                    )}

                    {/* Placeholder when no Sanity screenshot */}
                    {(!screenshots[i] || !screenshots[i].asset?.url) && (
                      <div className="mt-4 rounded-xl border-2 border-dashed border-border p-8 text-center bg-background-alt/50">
                        <p className="text-xs text-foreground-subtle">
                          {isEN ? 'Screenshot placeholder. Add via Sanity Studio.' : 'Screenshot placeholder. Toevoegen via Sanity Studio.'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live demo links */}
      <section className="py-16 bg-background-alt">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            {isEN ? 'Try it yourself' : 'Probeer het zelf'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: isEN ? 'ABM Demo' : 'ABM Demo', desc: isEN ? 'Enter any company domain and see the personalized experience' : 'Voer een bedrijfsdomein in en bekijk de gepersonaliseerde ervaring', href: '/for', color: '#EF476F' },
              { icon: FileText, title: isEN ? 'Sample CV' : 'Voorbeeld CV', desc: isEN ? 'See a branded CV generated for Nike' : 'Bekijk een branded CV gegenereerd voor Nike', href: '/api/cv/generate?company=nike.com&contactname=Demo&lang=nl', color: '#2563eb' },
              { icon: Globe, title: isEN ? 'Sample Landing' : 'Voorbeeld Landing', desc: isEN ? 'See a personalized landing page for Nike' : 'Bekijk een gepersonaliseerde landingspagina voor Nike', href: '/landing?company=nike.com&contactname=Demo', color: '#3FCF8E' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Link href={item.href} className="group block rounded-2xl p-6 bg-surface border border-border transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
                    <p className="text-sm text-foreground-muted">{item.desc}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: '#023047' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {isEN ? 'Interested in this approach?' : 'Geinteresseerd in deze aanpak?'}
          </motion.h2>
          <motion.p className="text-lg mb-8" style={{ color: '#A7DADC' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {isEN ? 'I can build something similar for your company. Let\'s talk.' : 'Ik kan iets vergelijkbaars bouwen voor jouw bedrijf. Laten we praten.'}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-transform hover:scale-105" style={{ backgroundColor: '#EF476F' }}>
              {isEN ? 'Get in touch' : 'Neem contact op'} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
