'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { X, ExternalLink, Mail, BarChart3, Code2, Workflow, Palette, Database, Zap } from 'lucide-react';

interface Tool {
  name: string;
  slug: string | null; // simple-icons slug, null = use Lucide fallback
  color: string;
  category: string;
  categoryIcon: React.ComponentType<{ className?: string }>;
  description: string;
  experience: string;
  url?: string;
}

const tools: Tool[] = [
  // Email & Marketing
  { name: 'Salesforce MC', slug: null, color: '#00A1E0', category: 'Email & Marketing', categoryIcon: Mail, description: 'Primary platform at Vandebron. Building complex journeys, writing SQL queries, managing 500k+ emails/month.', experience: 'Daily use', url: 'https://www.salesforce.com/marketing-cloud/' },
  { name: 'Deployteq', slug: null, color: '#0066FF', category: 'Email & Marketing', categoryIcon: Mail, description: 'Marketing automation platform used at Cleanprofs.nl. Building email flows and customer communication.', experience: 'Daily use', url: 'https://www.deployteq.com/' },
  { name: 'HubSpot', slug: 'hubspot', color: '#FF7A59', category: 'Email & Marketing', categoryIcon: Mail, description: 'Used for CRM and marketing automation at Kes Visum. Set up lead scoring and nurture flows.', experience: '3+ years' },
  { name: 'Mailchimp', slug: 'mailchimp', color: '#FFE01B', category: 'Email & Marketing', categoryIcon: Mail, description: 'Email campaigns for smaller clients during freelance work at Cordital.', experience: '2+ years' },
  { name: 'Resend', slug: 'resend', color: '#000000', category: 'Email & Marketing', categoryIcon: Mail, description: 'Transactional email for PayWatch.app. Clean API, great developer experience.', experience: '1+ year' },

  // Analytics & CRO
  { name: 'Google Analytics', slug: 'googleanalytics', color: '#E37400', category: 'Analytics & CRO', categoryIcon: BarChart3, description: 'Tracking and analyzing marketing performance across all projects. GA4 setup and event tracking.', experience: '4+ years' },
  { name: 'Hotjar', slug: 'hotjar', color: '#FF3C00', category: 'Analytics & CRO', categoryIcon: BarChart3, description: 'Heatmaps and session recordings. Used to optimize my own portfolio and client websites.', experience: '3+ years' },
  { name: 'SEMRush', slug: 'semrush', color: '#FF642D', category: 'Analytics & CRO', categoryIcon: BarChart3, description: 'SEO research, keyword tracking, and competitor analysis. Used extensively at Guardey and Kes Visum.', experience: '3+ years' },
  { name: 'VWO', slug: null, color: '#4A90D9', category: 'Analytics & CRO', categoryIcon: BarChart3, description: 'A/B testing platform. Run experiments on landing pages and email CTAs.', experience: '2+ years' },

  // CRM & Sales
  { name: 'Salesforce', slug: null, color: '#00A1E0', category: 'CRM & Sales', categoryIcon: Database, description: 'CRM for managing the sales pipeline and customer data at Vandebron.', experience: '2+ years' },
  { name: 'Zoho', slug: 'zoho', color: '#E42527', category: 'CRM & Sales', categoryIcon: Database, description: 'Built automations and CRM flows for Cordital partners.', experience: '2+ years' },
  { name: 'Apollo.io', slug: null, color: '#6366F1', category: 'CRM & Sales', categoryIcon: Database, description: 'B2B lead enrichment and outreach. Built the B2B Gluurder WordPress plugin with their API.', experience: '2+ years' },

  // Development
  { name: 'Next.js', slug: 'nextdotjs', color: '#000000', category: 'Development', categoryIcon: Code2, description: 'My go-to framework. Built PayWatch.app, this portfolio, and Workwings.nl with it.', experience: '2+ years', url: 'https://nextjs.org' },
  { name: 'React', slug: 'react', color: '#61DAFB', category: 'Development', categoryIcon: Code2, description: 'Core UI library for all my web projects. Server components, hooks, the works.', experience: '2+ years' },
  { name: 'TypeScript', slug: 'typescript', color: '#3178C6', category: 'Development', categoryIcon: Code2, description: 'Type safety in all my projects. Makes refactoring fearless.', experience: '2+ years' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', color: '#06B6D4', category: 'Development', categoryIcon: Code2, description: 'Styling everything. Fast, consistent, and this entire portfolio is built with it.', experience: '2+ years' },
  { name: 'Supabase', slug: 'supabase', color: '#3FCF8E', category: 'Development', categoryIcon: Code2, description: 'Backend for PayWatch.app — auth, database, row-level security, real-time.', experience: '1+ year', url: 'https://supabase.com' },
  { name: 'Sanity CMS', slug: 'sanity', color: '#F03E2F', category: 'Development', categoryIcon: Code2, description: 'Headless CMS for PayWatch.app. GROQ queries, structured content.', experience: '1+ year', url: 'https://www.sanity.io' },
  { name: 'Vercel', slug: 'vercel', color: '#000000', category: 'Development', categoryIcon: Code2, description: 'Deployment platform for all my Next.js projects. Auto-deploy on git push.', experience: '2+ years', url: 'https://vercel.com' },
  { name: 'PostgreSQL', slug: 'postgresql', color: '#4169E1', category: 'Development', categoryIcon: Code2, description: 'Database via Supabase. Writing complex queries for PayWatch.', experience: '1+ year' },
  { name: 'WordPress', slug: 'wordpress', color: '#21759B', category: 'Development', categoryIcon: Code2, description: 'Built multiple client sites and the B2B Gluurder plugin.', experience: '4+ years' },

  // Automation
  { name: 'Zapier', slug: 'zapier', color: '#FF4F00', category: 'Automation', categoryIcon: Workflow, description: 'Connecting tools and automating workflows. Used across all marketing roles.', experience: '3+ years' },
  { name: 'Make', slug: 'make', color: '#6D00CC', category: 'Automation', categoryIcon: Workflow, description: 'Complex multi-step automations. More flexible than Zapier for advanced flows.', experience: '2+ years' },

  // Design & AI
  { name: 'Figma', slug: 'figma', color: '#F24E1E', category: 'Design & AI', categoryIcon: Palette, description: 'UI design and prototyping. Designed PayWatch.app mockups before building.', experience: '2+ years', url: 'https://www.figma.com' },
  { name: 'Claude AI', slug: 'anthropic', color: '#D97757', category: 'Design & AI', categoryIcon: Zap, description: 'AI pair programming and content generation. Claude Haiku powers PayWatch.app invoice extraction.', experience: '1+ year' },
  { name: 'Gemini AI', slug: 'googlegemini', color: '#8E75B2', category: 'Design & AI', categoryIcon: Zap, description: 'PDF parsing and data extraction in PayWatch.app. Multimodal capabilities.', experience: '1+ year' },
];

function ToolIcon({ tool, size = 40 }: { tool: Tool; size?: number }) {
  if (tool.slug) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${tool.slug}/${tool.color.replace('#', '')}`}
        alt={tool.name}
        width={size}
        height={size}
        className="dark:brightness-0 dark:invert dark:opacity-80"
        loading="lazy"
      />
    );
  }
  // Fallback: colored circle with initials
  const initials = tool.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  return (
    <div
      className="rounded-lg flex items-center justify-center font-bold text-white"
      style={{ width: size, height: size, backgroundColor: tool.color, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

export function ToolStackFloat() {
  const t = useTranslations('tools');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Group tools by category for the grid
  const categories = [...new Set(tools.map(t => t.category))];

  return (
    <section id="tools" className="py-24 bg-background relative overflow-hidden">
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

        {/* Floating tool cloud */}
        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-wrap gap-3 justify-center">
            {tools.map((tool, i) => (
              <motion.button
                key={tool.name}
                onClick={() => setSelectedTool(tool)}
                className="group relative flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border bg-surface hover:border-border-hover hover:shadow-md transition-all"
                animate={{ y: [0, -3 - (i % 4) * 2, 0] }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.15,
                }}
                whileHover={{ scale: 1.06, y: -5 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <ToolIcon tool={tool} size={24} />
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors whitespace-nowrap">
                  {tool.name}
                </span>
              </motion.button>
            ))}
          </div>
        </Reveal>

        {/* Category legend */}
        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {categories.map((cat) => {
              const CatIcon = tools.find(t => t.category === cat)!.categoryIcon;
              const count = tools.filter(t => t.category === cat).length;
              return (
                <span key={cat} className="flex items-center gap-1.5 text-xs text-foreground-subtle">
                  <CatIcon className="w-3 h-3" />
                  {cat} ({count})
                </span>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {selectedTool && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setSelectedTool(null)}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface border-l border-border z-50 overflow-y-auto shadow-2xl"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-background-alt border border-border flex items-center justify-center p-2">
                      <ToolIcon tool={selectedTool} size={36} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{selectedTool.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <selectedTool.categoryIcon className="w-3.5 h-3.5 text-foreground-subtle" />
                        <span className="text-sm text-foreground-subtle">{selectedTool.category}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTool(null)}
                    className="p-2 rounded-lg hover:bg-background-alt transition-colors text-foreground-subtle"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Experience badge */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
                    {selectedTool.experience}
                  </span>
                  {selectedTool.url && (
                    <a
                      href={selectedTool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-foreground-subtle hover:text-accent transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Website
                    </a>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2">How I use it</h4>
                  <p className="text-foreground-muted leading-relaxed">{selectedTool.description}</p>
                </div>

                {/* Related tools in same category */}
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-3">Also in {selectedTool.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {tools
                      .filter(t => t.category === selectedTool.category && t.name !== selectedTool.name)
                      .map((t) => (
                        <button
                          key={t.name}
                          onClick={() => setSelectedTool(t)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background-alt hover:border-border-hover transition-all text-sm"
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            <ToolIcon tool={t} size={16} />
                          </div>
                          <span className="text-foreground-muted hover:text-foreground">{t.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
