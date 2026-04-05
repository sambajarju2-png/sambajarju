'use client';

import { useTranslations } from 'next-intl';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, BarChart3, UserCheck, Code2, Workflow, Palette } from 'lucide-react';

const toolCategories = [
  {
    key: 'email',
    icon: Mail,
    gradient: 'from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20',
    borderHover: 'hover:border-pink-300 dark:hover:border-pink-700',
    tools: [
      'Salesforce Marketing Cloud', 'Deployteq', 'ActiveCampaign',
      'Mailchimp', 'Klaviyo', 'Resend',
    ],
  },
  {
    key: 'analytics',
    icon: BarChart3,
    gradient: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20',
    borderHover: 'hover:border-blue-300 dark:hover:border-blue-700',
    tools: ['Google Analytics', 'Hotjar', 'VWO', 'SEMRush', 'Leadinfo'],
  },
  {
    key: 'crm',
    icon: UserCheck,
    gradient: 'from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20',
    borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    tools: ['HubSpot', 'Pipedrive', 'Salesforce', 'Zoho', 'Apollo.io'],
  },
  {
    key: 'dev',
    icon: Code2,
    gradient: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
    borderHover: 'hover:border-violet-300 dark:hover:border-violet-700',
    tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Sanity CMS', 'PostgreSQL', 'Vercel'],
  },
  {
    key: 'automation',
    icon: Workflow,
    gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
    borderHover: 'hover:border-amber-300 dark:hover:border-amber-700',
    tools: ['Zapier', 'Make', 'SQL/AMPScript', 'Pabbly'],
  },
  {
    key: 'design',
    icon: Palette,
    gradient: 'from-teal-500/10 to-cyan-500/10 dark:from-teal-500/20 dark:to-cyan-500/20',
    borderHover: 'hover:border-teal-300 dark:hover:border-teal-700',
    tools: ['Figma', 'Canva', 'Claude AI', 'Gemini AI', 'Framer'],
  },
];

export function ToolStack() {
  const t = useTranslations('tools');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <section id="tools" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider">
            <span className="w-8 h-px bg-accent" />
            {t('label')}
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mt-4">{t('title')}</h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-foreground-muted mt-3 text-lg">{t('subtitle')}</p>
        </Reveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {toolCategories.map(({ key, icon: Icon, gradient, borderHover, tools }) => (
            <StaggerItem key={key}>
              <motion.div
                onHoverStart={() => setHoveredCategory(key)}
                onHoverEnd={() => setHoveredCategory(null)}
                className={`relative group rounded-2xl border border-border bg-surface p-6 transition-all duration-300 cursor-default ${borderHover} overflow-hidden`}
                whileHover={{ y: -4 }}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-background-alt flex items-center justify-center border border-border group-hover:border-border-hover transition-colors">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <h3 className="font-bold text-foreground">{t(`categories.${key}`)}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tools.map((tool, i) => (
                      <motion.span
                        key={tool}
                        initial={false}
                        animate={
                          hoveredCategory === key
                            ? { scale: 1.02, transition: { delay: i * 0.03 } }
                            : { scale: 1 }
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-background-alt border border-border text-foreground-muted group-hover:bg-surface group-hover:border-border-hover transition-all"
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
