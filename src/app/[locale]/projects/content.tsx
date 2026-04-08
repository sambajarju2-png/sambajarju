'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, ExternalLink, Lock } from 'lucide-react';
import { useLocale } from 'next-intl';
import { urlFor } from '@/lib/sanity';

interface SanityProject {
  title: string;
  slug: { current: string };
  subtitle_nl?: string;
  subtitle_en?: string;
  description_nl?: string;
  description_en?: string;
  image?: { asset?: { _id: string; url: string } };
  featured?: boolean;
  comingSoon?: boolean;
  color?: string;
  year?: string;
  role?: string;
  techStack?: string[];
  url?: string;
}

const fallbackProjects: SanityProject[] = [
  { title: 'PayWatch.app', slug: { current: 'paywatch' }, subtitle_nl: 'AI-powered bill tracker', subtitle_en: 'AI-powered bill tracker', description_nl: 'Een Next.js applicatie die huishoudens helpt hun rekeningen en schulden te beheren met AI-inzichten.', description_en: 'A Next.js app helping households manage bills and debt with AI insights.', color: '#2563eb', url: 'https://paywatch.app', techStack: ['Next.js 16', 'Supabase', 'Sanity CMS', 'Gemini AI', 'Claude Haiku'], featured: true },
  { title: 'Cleanprofs.nl', slug: { current: 'cleanprofs' }, subtitle_nl: 'Marketing automation via Deployteq', subtitle_en: 'Marketing automation via Deployteq', description_nl: 'Freelance marketing automation via Deployteq voor een professioneel schoonmaakbedrijf.', description_en: 'Freelance marketing automation via Deployteq for a professional cleaning company.', color: '#059669', url: 'https://cleanprofs.nl', techStack: ['Deployteq', 'Email Marketing', 'Automation'] },
  { title: 'Workwings.nl', slug: { current: 'workwings' }, subtitle_nl: 'Uitzendbureau website', subtitle_en: 'Staffing agency website', description_nl: 'Complete website voor een uitzendbureau, gericht op conversie en gebruiksvriendelijkheid.', description_en: 'Full website for a staffing agency, focused on conversion and usability.', color: '#0891b2', url: 'https://workwings.nl', techStack: ['WordPress', 'SEO', 'CRO'], comingSoon: true },
  { title: 'Mariama.nl', slug: { current: 'mariama' }, subtitle_nl: 'Persoonlijke verjaardagssite', subtitle_en: 'Personal birthday site', description_nl: 'Een persoonlijke verjaardagswebsite voor mijn vrouw, gebouwd met liefde en Next.js.', description_en: 'A personal birthday website for my wife, built with love and Next.js.', color: '#db2777', url: 'https://mariama.nl', techStack: ['Next.js', 'Framer Motion', 'Tailwind CSS'], comingSoon: true },
  { title: 'Baraka4Gambia', slug: { current: 'baraka4gambia' }, subtitle_nl: 'Hulpinitiatief', subtitle_en: 'Charity initiative', description_nl: 'Een hulpinitiatief dat kleding en voedselpakketten naar kansarme gezinnen in Gambia stuurt.', description_en: 'A charity initiative sending clothing and food packages to families in The Gambia.', color: '#d97706', techStack: ['Social Impact', 'Logistics'] },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  }),
};

export function ProjectsContent({ sanityProjects }: { sanityProjects: SanityProject[] | null }) {
  const locale = useLocale();
  const projects = sanityProjects && sanityProjects.length > 0 ? sanityProjects : fallbackProjects;

  const t = (p: SanityProject, field: 'subtitle' | 'description') => {
    const nl = p[`${field}_nl` as keyof SanityProject] as string;
    const en = p[`${field}_en` as keyof SanityProject] as string;
    return locale === 'en' ? (en || nl) : (nl || en);
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #023047 0%, #034067 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: '#A7DADC' }}>
              <ArrowLeft className="w-4 h-4" /> {locale === 'nl' ? 'Terug naar home' : 'Back to home'}
            </Link>
          </motion.div>
          <motion.p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#EF476F' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Portfolio
          </motion.p>
          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {locale === 'nl' ? <>Projecten & <span style={{ color: '#EF476F' }}>case studies</span></> : <>Projects & <span style={{ color: '#EF476F' }}>case studies</span></>}
          </motion.h1>
          <motion.p className="text-lg max-w-2xl leading-relaxed" style={{ color: '#A7DADC' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            {locale === 'nl' ? 'Van SaaS-applicaties tot marketing automation. Een overzicht van projecten waar ik trots op ben.' : 'From SaaS applications to marketing automation. An overview of projects I am proud of.'}
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-background-alt">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <motion.div key={project.slug.current} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="group">
                <Link href={project.comingSoon ? '#' : `/projects/${project.slug.current}`} className={`block no-underline ${project.comingSoon ? 'cursor-default' : ''}`}>
                  <div className="rounded-2xl overflow-hidden transition-all duration-300 bg-surface border border-border relative" style={{ boxShadow: project.comingSoon ? 'none' : undefined }}>
                    {project.comingSoon && (
                      <div className="absolute inset-0 z-10 backdrop-blur-[3px] bg-surface/70 flex items-center justify-center">
                        <span className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-accent/10 text-accent border border-accent/20">
                          <Lock className="w-3.5 h-3.5" /> Coming soon
                        </span>
                      </div>
                    )}
                    <div className="relative h-56 overflow-hidden bg-background-alt">
                      {project.image?.asset?.url ? (
                        <Image src={urlFor(project.image.asset).width(600).height(340).url()} alt={project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${project.color || '#023047'}15` }}>
                            <span className="text-2xl font-black" style={{ color: project.color || '#023047' }}>{project.title.charAt(0)}</span>
                          </div>
                        </div>
                      )}
                      {project.url && !project.comingSoon && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#023047' }}>
                            Live <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                          <p className="text-sm text-foreground-subtle">{t(project, 'subtitle')}</p>
                        </div>
                        {!project.comingSoon && <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-accent" />}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground-muted mb-4">{t(project, 'description')}</p>
                      {project.techStack && (
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map(tag => (
                            <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${project.color || '#023047'}15`, color: project.color || '#023047' }}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
