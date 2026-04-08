'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { useLocale } from 'next-intl';
import { urlFor } from '@/lib/sanity';

interface Block {
  _type: string;
  _key?: string;
  style?: string;
  children?: { _type: string; text: string; marks?: string[] }[];
  markDefs?: { _key: string; _type: string; href?: string }[];
  asset?: { _id: string; url: string };
  caption?: string;
  alt?: string;
  listItem?: string;
  level?: number;
}

interface Post {
  title_nl?: string;
  title_en?: string;
  slug?: { current: string };
  excerpt_nl?: string;
  excerpt_en?: string;
  body_nl?: Block[];
  body_en?: Block[];
  coverImage?: { asset?: { _id: string; url: string } };
  category?: string;
  tags?: string[];
  publishedAt?: string;
}

function RenderBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose prose-lg max-w-none text-foreground-muted">
      {blocks.map((block, i) => {
        if (block._type === 'image' && block.asset?.url) {
          return (
            <figure key={block._key || i} className="my-8">
              <Image src={urlFor(block.asset).width(800).url()} alt={block.alt || ''} width={800} height={450} className="rounded-xl w-full h-auto" />
              {block.caption && <figcaption className="text-sm text-foreground-subtle mt-2 text-center">{block.caption}</figcaption>}
            </figure>
          );
        }
        if (block._type !== 'block') return null;

        const text = block.children?.map(child => {
          let t = child.text;
          if (child.marks?.includes('strong')) t = `<strong>${t}</strong>`;
          if (child.marks?.includes('em')) t = `<em>${t}</em>`;
          if (child.marks?.includes('code')) t = `<code class="px-1.5 py-0.5 rounded bg-background-alt text-sm">${t}</code>`;
          // Handle links
          const linkMark = child.marks?.find(m => m !== 'strong' && m !== 'em' && m !== 'code');
          if (linkMark && block.markDefs) {
            const def = block.markDefs.find(d => d._key === linkMark);
            if (def?.href) t = `<a href="${def.href}" class="text-accent hover:underline" target="_blank" rel="noopener">${t}</a>`;
          }
          return t;
        }).join('') || '';

        const Tag = block.style === 'h2' ? 'h2' : block.style === 'h3' ? 'h3' : block.style === 'h4' ? 'h4' : block.style === 'blockquote' ? 'blockquote' : 'p';
        const cls = Tag === 'h2' ? 'text-2xl font-bold text-foreground mt-10 mb-4'
          : Tag === 'h3' ? 'text-xl font-bold text-foreground mt-8 mb-3'
          : Tag === 'h4' ? 'text-lg font-semibold text-foreground mt-6 mb-2'
          : Tag === 'blockquote' ? 'border-l-4 border-accent pl-4 italic text-foreground-muted my-6'
          : 'mb-4 leading-relaxed';

        if (block.listItem === 'bullet') {
          return <li key={block._key || i} className="ml-6 list-disc mb-2 text-foreground-muted" dangerouslySetInnerHTML={{ __html: text }} />;
        }
        if (block.listItem === 'number') {
          return <li key={block._key || i} className="ml-6 list-decimal mb-2 text-foreground-muted" dangerouslySetInnerHTML={{ __html: text }} />;
        }

        return <Tag key={block._key || i} className={cls} dangerouslySetInnerHTML={{ __html: text }} />;
      })}
    </div>
  );
}

export function BlogPostContent({ post }: { post: Post | null }) {
  const locale = useLocale();

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 text-foreground">{locale === 'nl' ? 'Artikel niet gevonden' : 'Article not found'}</h1>
          <Link href="/blog" className="inline-flex items-center gap-2 text-accent"><ArrowLeft className="w-4 h-4" /> {locale === 'nl' ? 'Terug naar blog' : 'Back to blog'}</Link>
        </div>
      </div>
    );
  }

  const title = locale === 'en' ? (post.title_en || post.title_nl) : (post.title_nl || post.title_en);
  const body = locale === 'en' ? (post.body_en || post.body_nl) : (post.body_nl || post.body_en);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #023047 0%, #034067 100%)' }}>
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: '#A7DADC' }}>
              <ArrowLeft className="w-4 h-4" /> {locale === 'nl' ? 'Alle artikelen' : 'All articles'}
            </Link>
          </motion.div>
          {post.category && (
            <motion.span className="text-sm font-semibold uppercase tracking-wider mb-4 block" style={{ color: '#EF476F' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              {post.category.replace(/-/g, ' ')}
            </motion.span>
          )}
          <motion.h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {title}
          </motion.h1>
          <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5 text-sm" style={{ color: '#A7DADC' }}>
                <Clock className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(167, 218, 220, 0.2)', color: '#A7DADC' }}>{tag}</span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {post.coverImage?.asset?.url && (
        <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10">
          <motion.div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Image src={urlFor(post.coverImage.asset).width(1000).height(500).url()} alt={title || ''} width={1000} height={500} className="w-full h-auto" priority />
          </motion.div>
        </div>
      )}

      <article className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          {body && body.length > 0 ? (
            <RenderBody blocks={body} />
          ) : (
            <p className="text-foreground-muted text-lg">{locale === 'nl' ? 'Dit artikel heeft nog geen inhoud.' : 'This article has no content yet.'}</p>
          )}
        </div>
      </article>
    </div>
  );
}
