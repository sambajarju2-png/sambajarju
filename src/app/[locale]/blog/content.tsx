'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, Clock, Tag } from 'lucide-react';
import { useLocale } from 'next-intl';
import { urlFor } from '@/lib/sanity';

interface BlogPost {
  title_nl?: string;
  title_en?: string;
  slug: { current: string };
  excerpt_nl?: string;
  excerpt_en?: string;
  coverImage?: { asset?: { _id: string; url: string } };
  category?: string;
  tags?: string[];
  publishedAt?: string;
  featured?: boolean;
}

const categoryLabels: Record<string, string> = {
  'email-marketing': 'Email Marketing',
  'marketing-automation': 'Marketing Automation',
  'data-analytics': 'Data & Analytics',
  'cro': 'CRO',
  'seo': 'SEO',
  'tools': 'Tools & Reviews',
  'case-study': 'Case Study',
  'personal': 'Personal',
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  }),
};

export function BlogContent({ posts }: { posts: BlogPost[] | null }) {
  const locale = useLocale();
  const allPosts = posts || [];

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
            Blog
          </motion.p>
          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {locale === 'nl' ? <>Artikelen & <span style={{ color: '#EF476F' }}>inzichten</span></> : <>Articles & <span style={{ color: '#EF476F' }}>insights</span></>}
          </motion.h1>
          <motion.p className="text-lg max-w-2xl leading-relaxed" style={{ color: '#A7DADC' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            {locale === 'nl' ? 'Over email marketing, marketing automation, data en alles wat ik onderweg leer.' : 'About email marketing, marketing automation, data and everything I learn along the way.'}
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-background-alt">
        <div className="max-w-6xl mx-auto px-6">
          {allPosts.length === 0 ? (
            <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-accent/10">
                <Tag className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                {locale === 'nl' ? 'Binnenkort beschikbaar' : 'Coming soon'}
              </h2>
              <p className="text-foreground-muted max-w-md mx-auto">
                {locale === 'nl' ? 'Ik werk aan mijn eerste artikelen. Kom snel terug!' : 'Working on my first articles. Check back soon!'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allPosts.map((post, i) => (
                <motion.div key={post.slug.current} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Link href={`/blog/${post.slug.current}`} className="group block no-underline">
                    <div className="rounded-2xl overflow-hidden bg-surface border border-border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                      {post.coverImage?.asset?.url && (
                        <div className="relative h-48 overflow-hidden">
                          <Image src={urlFor(post.coverImage.asset).width(600).height(340).url()} alt={post.title_nl || ''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="p-5">
                        {post.category && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-accent">{categoryLabels[post.category] || post.category}</span>
                        )}
                        <h3 className="text-lg font-bold text-foreground mt-1 mb-2 group-hover:text-accent transition-colors">
                          {locale === 'en' ? (post.title_en || post.title_nl) : (post.title_nl || post.title_en)}
                        </h3>
                        <p className="text-sm text-foreground-muted leading-relaxed line-clamp-3">
                          {locale === 'en' ? (post.excerpt_en || post.excerpt_nl) : (post.excerpt_nl || post.excerpt_en)}
                        </p>
                        {post.publishedAt && (
                          <div className="flex items-center gap-1.5 mt-4 text-xs text-foreground-subtle">
                            <Clock className="w-3 h-3" />
                            {new Date(post.publishedAt).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
