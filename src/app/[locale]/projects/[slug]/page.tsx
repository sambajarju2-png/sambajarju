'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Calendar, Tag } from 'lucide-react';
import { useParams } from 'next/navigation';

// Placeholder data — replace with Sanity CMS data later
const projectData: Record<string, {
  title: string;
  subtitle: string;
  heroImage: string;
  color: string;
  url?: string;
  year: string;
  role: string;
  tags: string[];
  overview: string;
  challenge: string;
  solution: string;
  results: string[];
  techStack: string[];
  screenshots: string[];
}> = {
  paywatch: {
    title: 'PayWatch.app',
    subtitle: 'AI-powered bill tracker voor huishoudens',
    heroImage: '/menu-photo-1.jpg',
    color: '#2563eb',
    url: 'https://paywatch.app',
    year: '2025',
    role: 'Founder & Developer',
    tags: ['Next.js 16', 'Supabase', 'Sanity CMS', 'Gemini AI', 'Claude Haiku', 'Resend'],
    overview: 'PayWatch is een applicatie die Nederlandse huishoudens helpt hun rekeningen, schulden en betalingsverplichtingen te beheren. Met AI-gestuurde inzichten en automatische herinneringen voorkomt het betalingsachterstanden.',
    challenge: 'Veel huishoudens in Nederland hebben moeite om overzicht te houden over hun vaste lasten en schulden. Bestaande tools zijn te complex of niet gericht op de Nederlandse markt.',
    solution: 'Een gebruiksvriendelijke app die automatisch rekeningen categoriseert, AI-inzichten biedt over uitgavenpatronen, en tijdig waarschuwt bij dreigende achterstanden.',
    results: [
      'Volledig werkende SaaS applicatie',
      'AI-gestuurde PDF extractie van rekeningen',
      'Geautomatiseerde email notificaties',
      'Meerdere doelgroepen: consumenten, gemeentes, hulporganisaties',
    ],
    techStack: ['Next.js 16', 'React 19', 'Supabase', 'Sanity CMS', 'Gemini AI', 'Claude Haiku', 'Resend', 'Vercel'],
    screenshots: [], // Add later
  },
  workwings: {
    title: 'Workwings.nl',
    subtitle: 'Staffing agency website',
    heroImage: '/menu-photo-2.jpg',
    color: '#059669',
    url: 'https://workwings.nl',
    year: '2024',
    role: 'Web Developer & SEO',
    tags: ['WordPress', 'SEO', 'CRO', 'Google Ads'],
    overview: 'Complete website redesign voor een uitzendbureau, gericht op het verbeteren van conversie en zoekmachinevriendelijkheid.',
    challenge: 'De bestaande website had een lage conversieratio en was niet geoptimaliseerd voor zoekmachines.',
    solution: 'Een nieuwe website met focus op gebruiksvriendelijkheid, snelheid en SEO-optimalisatie.',
    results: ['Placeholder — voeg je resultaten toe'],
    techStack: ['WordPress', 'PHP', 'Google Analytics', 'Google Ads'],
    screenshots: [],
  },
  mariama: {
    title: 'Mariama.nl',
    subtitle: 'Personal birthday site',
    heroImage: '/menu-photo-3.jpg',
    color: '#db2777',
    url: 'https://mariama.nl',
    year: '2024',
    role: 'Developer & Designer',
    tags: ['Next.js', 'Framer Motion', 'Tailwind CSS'],
    overview: 'Een persoonlijke verjaardagswebsite voor mijn vrouw — gebouwd met liefde, animaties en Next.js.',
    challenge: 'Iets unieks en persoonlijks creëren dat verder gaat dan een standaard verjaardagsbericht.',
    solution: 'Een interactieve, geanimeerde website met persoonlijke foto\'s, herinneringen en boodschappen.',
    results: ['Een blije vrouw'],
    techStack: ['Next.js', 'React', 'Framer Motion', 'Tailwind CSS', 'Vercel'],
    screenshots: [],
  },
  'b2b-gluurder': {
    title: 'B2B Gluurder',
    subtitle: 'WordPress plugin voor B2B visitor tracking',
    heroImage: '/menu-photo-1.jpg',
    color: '#7c3aed',
    year: '2024',
    role: 'Developer',
    tags: ['WordPress', 'PHP', 'Apollo.io', 'Hunter.io', 'REST API'],
    overview: 'Een WordPress plugin die anonieme B2B websitebezoekers identificeert door IP-adressen te koppelen aan bedrijfsinformatie via Apollo.io en Hunter.io.',
    challenge: 'B2B bedrijven weten niet welke bedrijven hun website bezoeken, waardoor potentiële leads verloren gaan.',
    solution: 'Een plugin die real-time bedrijfsinformatie toont van websitebezoekers, inclusief contactgegevens van beslissers.',
    results: ['Placeholder — voeg je resultaten toe'],
    techStack: ['WordPress', 'PHP', 'Apollo.io API', 'Hunter.io API'],
    screenshots: [],
  },
  baraka4gambia: {
    title: 'Baraka4Gambia',
    subtitle: 'Charity initiative',
    heroImage: '/samba-gambia.jpg',
    color: '#d97706',
    year: '2024–heden',
    role: 'Initiatiefnemer',
    tags: ['Social Impact', 'Logistics', 'Fundraising'],
    overview: 'Een hulpinitiatief dat kleding en voedselpakketten naar kansarme gezinnen in Gambia stuurt.',
    challenge: 'Kwetsbare gemeenschappen in Gambia hebben beperkte toegang tot basisbehoeften.',
    solution: 'Het organiseren van inzamelingsacties in Nederland en het opzetten van een distributielijn naar Gambia.',
    results: ['70+ dozen kleding verstuurd', '18 gezinnen voorzien van voedselpakketten', 'Groeiend netwerk van donateurs'],
    techStack: [],
    screenshots: [],
  },
};

export default function CaseStudyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = projectData[slug];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4" style={{ color: '#023047' }}>Project niet gevonden</h1>
          <Link href="/projects" className="inline-flex items-center gap-2" style={{ color: '#EF476F' }}>
            <ArrowLeft className="w-4 h-4" /> Terug naar projecten
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, #023047 0%, ${project.color}33 100%)` }}>
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: '#A7DADC' }}>
              <ArrowLeft className="w-4 h-4" /> Alle projecten
            </Link>
          </motion.div>

          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-1 text-sm" style={{ color: '#A7DADC' }}>
              <Calendar className="w-4 h-4" /> {project.year}
            </span>
            <span className="text-sm" style={{ color: '#A7DADC' }}>•</span>
            <span className="text-sm" style={{ color: '#A7DADC' }}>{project.role}</span>
          </div>

          <motion.h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {project.title}
          </motion.h1>
          <motion.p className="text-xl mb-6" style={{ color: '#A7DADC' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {project.subtitle}
          </motion.p>

          {project.url && (
            <motion.a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-white transition-transform hover:scale-105" style={{ backgroundColor: project.color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              Bekijk live <ExternalLink className="w-4 h-4" />
            </motion.a>
          )}
        </div>
      </section>

      {/* Hero image */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <motion.div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
          <div className="relative h-64 md:h-96">
            <Image src={project.heroImage} alt={project.title} fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${project.color}20` }}>
              <p className="text-sm font-mono px-4 py-2 rounded-lg backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.8)', color: '#023047' }}>
                📷 Screenshot placeholder — voeg je afbeeldingen toe
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="md:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#023047' }}>Overzicht</h2>
                <p className="text-lg leading-relaxed" style={{ color: '#374151' }}>{project.overview}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#023047' }}>De uitdaging</h2>
                <p className="text-lg leading-relaxed" style={{ color: '#374151' }}>{project.challenge}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#023047' }}>De oplossing</h2>
                <p className="text-lg leading-relaxed" style={{ color: '#374151' }}>{project.solution}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#023047' }}>Resultaten</h2>
                <ul className="space-y-3">
                  {project.results.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg" style={{ color: '#374151' }}>
                      <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {project.techStack.length > 0 && (
                <div className="rounded-2xl p-6" style={{ backgroundColor: '#f8fafb' }}>
                  <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#023047' }}>
                    <Tag className="w-4 h-4" /> Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((t) => (
                      <span key={t} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${project.color}15`, color: project.color }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl p-6" style={{ backgroundColor: '#f8fafb' }}>
                <h3 className="font-bold mb-4" style={{ color: '#023047' }}>Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#023047', color: '#ffffff' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
