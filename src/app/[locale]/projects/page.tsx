'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';

const projects = [
  {
    slug: 'paywatch',
    title: 'PayWatch.app',
    subtitle: 'AI-powered bill tracker',
    description: 'Een Next.js applicatie die huishoudens helpt hun rekeningen en schulden te beheren met AI-gestuurde inzichten.',
    tags: ['Next.js 16', 'Supabase', 'Sanity CMS', 'Gemini AI', 'Claude Haiku'],
    image: '/menu-photo-1.jpg', // placeholder
    color: '#2563eb',
    url: 'https://paywatch.app',
  },
  {
    slug: 'workwings',
    title: 'Workwings.nl',
    subtitle: 'Staffing agency website',
    description: 'Complete website voor een uitzendbureau, gericht op conversie en gebruiksvriendelijkheid.',
    tags: ['WordPress', 'SEO', 'CRO'],
    image: '/menu-photo-2.jpg', // placeholder
    color: '#059669',
    url: 'https://workwings.nl',
  },
  {
    slug: 'mariama',
    title: 'Mariama.nl',
    subtitle: 'Personal birthday site',
    description: 'Een persoonlijke verjaardagswebsite voor mijn vrouw — gebouwd met liefde en Next.js.',
    tags: ['Next.js', 'Framer Motion', 'Tailwind CSS'],
    image: '/menu-photo-3.jpg', // placeholder
    color: '#db2777',
    url: 'https://mariama.nl',
  },
  {
    slug: 'b2b-gluurder',
    title: 'B2B Gluurder',
    subtitle: 'WordPress plugin voor B2B visitor tracking',
    description: 'WordPress plugin die anonieme B2B websitebezoekers identificeert via Apollo.io en Hunter.io.',
    tags: ['WordPress', 'PHP', 'Apollo.io', 'Hunter.io'],
    image: '/menu-photo-1.jpg', // placeholder
    color: '#7c3aed',
  },
  {
    slug: 'baraka4gambia',
    title: 'Baraka4Gambia',
    subtitle: 'Charity initiative',
    description: 'Een hulpinitiatief dat kleding en voedselpakketten naar kansarme gezinnen in Gambia stuurt.',
    tags: ['Social Impact', 'Logistics', 'Fundraising'],
    image: '/samba-gambia.jpg',
    color: '#d97706',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  }),
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #023047 0%, #034067 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #EF476F 0%, transparent 50%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: '#A7DADC' }}>
              <ArrowLeft className="w-4 h-4" /> Terug naar home
            </Link>
          </motion.div>
          <motion.p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#EF476F' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Portfolio
          </motion.p>
          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            Projecten & <span style={{ color: '#EF476F' }}>case studies</span>
          </motion.h1>
          <motion.p className="text-lg max-w-2xl leading-relaxed" style={{ color: '#A7DADC' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            Van SaaS-applicaties tot marketing automation — een overzicht van projecten waar ik trots op ben.
          </motion.p>
        </div>
      </section>

      {/* Projects grid */}
      <section className="py-20" style={{ backgroundColor: '#f8fafb' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={project.slug}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/projects/${project.slug}`} className="block no-underline">
                  <div
                    className="rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1"
                    style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${project.color}33, transparent)` }} />
                      {project.url && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#023047' }}>
                            Live <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: '#023047' }}>{project.title}</h3>
                          <p className="text-sm" style={{ color: '#6b7280' }}>{project.subtitle}</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: '#EF476F' }} />
                      </div>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: '#374151' }}>{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${project.color}15`, color: project.color }}>
                            {tag}
                          </span>
                        ))}
                      </div>
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
