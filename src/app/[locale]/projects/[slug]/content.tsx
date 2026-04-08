'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Calendar, Tag } from 'lucide-react';
import { useLocale } from 'next-intl';
import { urlFor } from '@/lib/sanity';

interface SanityProject {
  title?: string;
  slug?: { current: string };
  subtitle_nl?: string;
  subtitle_en?: string;
  description_nl?: string;
  description_en?: string;
  image?: { asset?: { _id: string; url: string } };
  screenshots?: { caption?: string; asset?: { _id: string; url: string } }[];
  color?: string;
  year?: string;
  role?: string;
  techStack?: string[];
  url?: string;
  problem_nl?: string;
  problem_en?: string;
  solution_nl?: string;
  solution_en?: string;
  results_nl?: string[];
  results_en?: string[];
}

const fallbackData: Record<string, SanityProject> = {
  paywatch: { title: 'PayWatch.app', subtitle_nl: 'AI-powered bill tracker voor huishoudens', subtitle_en: 'AI-powered bill tracker for households', color: '#2563eb', url: 'https://paywatch.app', year: '2025', role: 'Founder & Developer', techStack: ['Next.js 16', 'Supabase', 'Sanity CMS', 'Gemini AI', 'Claude Haiku', 'Resend'], description_nl: 'PayWatch is een applicatie die Nederlandse huishoudens helpt hun rekeningen, schulden en betalingsverplichtingen te beheren. Met AI-gestuurde inzichten en automatische herinneringen voorkomt het betalingsachterstanden.', problem_nl: 'Veel huishoudens in Nederland hebben moeite om overzicht te houden over hun vaste lasten en schulden. Bestaande tools zijn te complex of niet gericht op de Nederlandse markt.', solution_nl: 'Een gebruiksvriendelijke app die automatisch rekeningen categoriseert, AI-inzichten biedt over uitgavenpatronen, en tijdig waarschuwt bij dreigende achterstanden.', results_nl: ['Volledig werkende SaaS applicatie', 'AI-gestuurde PDF extractie van rekeningen', 'Geautomatiseerde email notificaties', 'Meerdere doelgroepen: consumenten, gemeentes, hulporganisaties'] },
  cleanprofs: { title: 'Cleanprofs.nl', subtitle_nl: 'Marketing automation via Deployteq', color: '#059669', url: 'https://cleanprofs.nl', year: '2024', role: 'Freelance Marketeer', techStack: ['Deployteq', 'Email Marketing', 'Automation', 'Segmentatie'], description_nl: 'Freelance marketing automation via Deployteq voor een professioneel schoonmaakbedrijf.', problem_nl: 'Cleanprofs had behoefte aan een gestructureerde email marketing aanpak met segmentatie en automatisering.', solution_nl: 'Opzet van marketing automation flows in Deployteq met gerichte campagnes per klantsegment.', results_nl: ['Placeholder: voeg je resultaten toe'] },
  baraka4gambia: { title: 'Baraka4Gambia', subtitle_nl: 'Hulpinitiatief', color: '#d97706', year: '2024 tot nu', role: 'Initiatiefnemer', techStack: ['Social Impact', 'Logistics', 'Fundraising'], description_nl: 'Een hulpinitiatief dat kleding en voedselpakketten naar kansarme gezinnen in Gambia stuurt.', problem_nl: 'Kwetsbare gemeenschappen in Gambia hebben beperkte toegang tot basisbehoeften.', solution_nl: 'Het organiseren van inzamelingsacties in Nederland en het opzetten van een distributielijn naar Gambia.', results_nl: ['70+ dozen kleding verstuurd', '18 gezinnen voorzien van voedselpakketten', 'Groeiend netwerk van donateurs'] },
};

export function CaseStudyContent({ sanityProject, slug }: { sanityProject: SanityProject | null; slug: string }) {
  const locale = useLocale();
  const project = sanityProject || fallbackData[slug];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 text-foreground">Project niet gevonden</h1>
          <Link href="/projects" className="inline-flex items-center gap-2 text-accent">
            <ArrowLeft className="w-4 h-4" /> Terug naar projecten
          </Link>
        </div>
      </div>
    );
  }

  const tField = (nl?: string, en?: string) => locale === 'en' ? (en || nl || '') : (nl || en || '');
  const color = project.color || '#023047';

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, #023047 0%, ${color}33 100%)` }}>
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: '#A7DADC' }}>
              <ArrowLeft className="w-4 h-4" /> {locale === 'nl' ? 'Alle projecten' : 'All projects'}
            </Link>
          </motion.div>
          <div className="flex items-center gap-3 mb-4">
            {project.year && <span className="flex items-center gap-1 text-sm" style={{ color: '#A7DADC' }}><Calendar className="w-4 h-4" /> {project.year}</span>}
            {project.role && <><span className="text-sm" style={{ color: '#A7DADC' }}>&middot;</span><span className="text-sm" style={{ color: '#A7DADC' }}>{project.role}</span></>}
          </div>
          <motion.h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {project.title}
          </motion.h1>
          <motion.p className="text-xl mb-6" style={{ color: '#A7DADC' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {tField(project.subtitle_nl, project.subtitle_en)}
          </motion.p>
          {project.url && (
            <motion.a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-white transition-transform hover:scale-105" style={{ backgroundColor: color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {locale === 'nl' ? 'Bekijk live' : 'View live'} <ExternalLink className="w-4 h-4" />
            </motion.a>
          )}
        </div>
      </section>

      {/* Hero image */}
      {project.image?.asset?.url && (
        <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
          <motion.div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
            <div className="relative h-64 md:h-96">
              <Image src={urlFor(project.image.asset).width(1200).height(600).url()} alt={project.title || ''} fill className="object-cover" />
            </div>
          </motion.div>
        </div>
      )}

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-12">
              {tField(project.description_nl, project.description_en) && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">{locale === 'nl' ? 'Overzicht' : 'Overview'}</h2>
                  <p className="text-lg leading-relaxed text-foreground-muted">{tField(project.description_nl, project.description_en)}</p>
                </div>
              )}
              {tField(project.problem_nl, project.problem_en) && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">{locale === 'nl' ? 'De uitdaging' : 'The challenge'}</h2>
                  <p className="text-lg leading-relaxed text-foreground-muted">{tField(project.problem_nl, project.problem_en)}</p>
                </div>
              )}
              {tField(project.solution_nl, project.solution_en) && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">{locale === 'nl' ? 'De oplossing' : 'The solution'}</h2>
                  <p className="text-lg leading-relaxed text-foreground-muted">{tField(project.solution_nl, project.solution_en)}</p>
                </div>
              )}
              {(project.results_nl?.length || project.results_en?.length) ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">{locale === 'nl' ? 'Resultaten' : 'Results'}</h2>
                  <ul className="space-y-3">
                    {(locale === 'en' ? (project.results_en || project.results_nl) : (project.results_nl || project.results_en))?.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-lg text-foreground-muted">
                        <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <div className="space-y-8">
              {project.techStack && project.techStack.length > 0 && (
                <div className="rounded-2xl p-6 bg-background-alt">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground"><Tag className="w-4 h-4" /> Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map(t => (
                      <span key={t} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${color}15`, color }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
