'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Mail, Zap, Target, BarChart3, Users, Database, Globe, Lightbulb, Send, Shield } from 'lucide-react';
import { useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Icon lookup for feature grid
const iconMap: Record<string, any> = { mail: Mail, zap: Zap, target: Target, 'bar-chart-3': BarChart3, users: Users, database: Database, globe: Globe, lightbulb: Lightbulb, send: Send, shield: Shield };

function t(block: any, field: string, locale: string) {
  return block[`${field}_${locale}`] || block[`${field}_nl`] || block[field] || '';
}

function imgUrl(img: any, w = 800, h = 600) {
  if (!img?.asset) return null;
  return urlFor(img).width(w).height(h).url();
}

/* ── Hero Block ── */
function HeroBlockComponent({ block }: { block: any }) {
  const locale = useLocale();
  const style = block.style || 'dark';
  const isDark = style === 'dark' || style === 'gradient';
  const bg = style === 'gradient' ? 'linear-gradient(145deg, #011627 0%, #023047 40%, #034a6e 70%, #023047 100%)' : isDark ? '#023047' : '#FAFBFC';
  const textColor = isDark ? 'text-white' : 'text-[#023047]';
  const mutedColor = isDark ? 'rgba(255,255,255,0.5)' : '#4A6B7F';
  const src = imgUrl(block.image, 600, 750);

  return (
    <section className="relative overflow-hidden" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {t(block, 'eyebrow', locale) && (
              <div className="inline-flex items-center gap-2.5 mb-5">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FCF8E] opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-[#3FCF8E]" /></span>
                <span className="text-[11px] font-mono font-medium uppercase tracking-[0.15em]" style={{ color: isDark ? 'rgba(167,218,220,0.7)' : '#8BA3B5' }}>{t(block, 'eyebrow', locale)}</span>
              </div>
            )}
            <h1 className={`text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight mb-5 ${textColor}`}>
              {t(block, 'title', locale)}
            </h1>
            <p className="text-[15px] leading-relaxed mb-8" style={{ color: mutedColor, maxWidth: 520 }}>{t(block, 'subtitle', locale)}</p>
            {block.cta_link && (
              <a href={block.cta_link} className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#EF476F] text-white text-sm font-bold no-underline hover:brightness-110 transition">
                {t(block, 'cta_text', locale) || 'Learn more'} <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            )}
          </motion.div>
          {src && (
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative aspect-[4/5] rounded-2xl overflow-hidden hidden lg:block" style={{ border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
              <Image src={src} alt="" fill className="object-cover" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Rich Text Block ── */
function RichTextBlockComponent({ block }: { block: any }) {
  const locale = useLocale();
  const widths = { narrow: 'max-w-2xl', medium: 'max-w-3xl', wide: 'max-w-4xl', full: 'max-w-7xl' };
  const w = widths[block.width as keyof typeof widths] || 'max-w-3xl';
  const body = block[`body_${locale}`] || block.body_nl || [];

  return (
    <section className="py-20 px-6">
      <div className={`${w} mx-auto`}>
        {t(block, 'label', locale) && <p className="text-xs font-mono uppercase tracking-widest text-[#EF476F] mb-3">{t(block, 'label', locale)}</p>}
        {t(block, 'title', locale) && <h2 className="text-3xl font-extrabold text-[#023047] mb-6">{t(block, 'title', locale)}</h2>}
        <div className="prose prose-lg max-w-none text-[#4A6B7F]">
          {body.map((b: any, i: number) => (
            <p key={i}>{b.children?.map((c: any) => c.text).join('') || ''}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Split Image Block ── */
function SplitImageBlockComponent({ block }: { block: any }) {
  const locale = useLocale();
  const src = imgUrl(block.image);
  const isRight = block.image_position !== 'left';

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${!isRight ? 'lg:[direction:rtl] [&>*]:lg:[direction:ltr]' : ''}`}>
          <div>
            <h2 className="text-3xl font-extrabold text-[#023047] mb-4">{t(block, 'title', locale)}</h2>
            <p className="text-[15px] text-[#4A6B7F] leading-relaxed mb-6">{t(block, 'body', locale)}</p>
            {block.cta_link && (
              <a href={block.cta_link} className="inline-flex items-center gap-2 text-[#EF476F] text-sm font-semibold no-underline hover:underline">
                {t(block, 'cta_text', locale) || 'Learn more'} <ArrowRight size={14} />
              </a>
            )}
          </div>
          {src && (
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E2E8F0]">
              <Image src={src} alt={t(block, 'title', locale)} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Stats Block ── */
function StatsBlockComponent({ block }: { block: any }) {
  const locale = useLocale();
  const bgs = { white: 'bg-white', navy: 'bg-[#023047]', gray: 'bg-[#f4f7fa]' };
  const bg = bgs[block.background as keyof typeof bgs] || 'bg-white';
  const isNavy = block.background === 'navy';

  return (
    <section className={`py-20 px-6 ${bg}`}>
      <div className="max-w-5xl mx-auto text-center">
        {t(block, 'title', locale) && <h2 className={`text-2xl font-extrabold mb-12 ${isNavy ? 'text-white' : 'text-[#023047]'}`}>{t(block, 'title', locale)}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {block.stats?.map((s: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className={`text-4xl font-extrabold mb-1 ${isNavy ? 'text-[#EF476F]' : 'text-[#023047]'}`}>{s.value}</div>
              <div className={`text-sm ${isNavy ? 'text-white/60' : 'text-[#8BA3B5]'}`}>{t(s, 'label', locale)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA Block ── */
function CTABlockComponent({ block }: { block: any }) {
  const locale = useLocale();
  const styles: Record<string, string> = { navy: 'bg-[#023047] text-white', pink: 'bg-[#EF476F] text-white', minimal: 'bg-[#f4f7fa] text-[#023047]' };
  const cls = styles[block.style] || styles.navy;

  return (
    <section className={`py-16 px-6 ${cls}`}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-extrabold mb-3">{t(block, 'title', locale)}</h2>
        {t(block, 'subtitle', locale) && <p className="mb-6 opacity-70">{t(block, 'subtitle', locale)}</p>}
        {block.button_link && (
          <a href={block.button_link} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#EF476F] text-white text-sm font-bold no-underline hover:brightness-110 transition">
            {t(block, 'button_text', locale) || 'Get started'} <ArrowRight size={16} />
          </a>
        )}
      </div>
    </section>
  );
}

/* ── Testimonial Block ── */
function TestimonialBlockComponent({ block }: { block: any }) {
  const locale = useLocale();
  return (
    <section className="py-20 px-6 bg-[#f4f7fa]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-extrabold text-[#023047] mb-10 text-center">{t(block, 'title', locale)}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {block.items?.map((item: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
              <p className="text-[14px] text-[#4A6B7F] leading-relaxed mb-4 italic">&ldquo;{item.quote}&rdquo;</p>
              <div>
                <div className="font-bold text-[#023047] text-sm">{item.name}</div>
                <div className="text-xs text-[#8BA3B5]">{item.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ Block ── */
function FAQBlockComponent({ block }: { block: any }) {
  const locale = useLocale();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-extrabold text-[#023047] mb-8 text-center">{t(block, 'title', locale)}</h2>
        <div className="flex flex-col gap-2">
          {block.items?.map((item: any, i: number) => (
            <div key={i} className="border border-[#E2E8F0] rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-[#fafbfc] transition cursor-pointer border-none">
                <span className="text-sm font-semibold text-[#023047]">{t(item, 'question', locale)}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }}><ChevronDown size={16} className="text-[#8BA3B5]" /></motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <div className="px-5 pb-4 text-sm text-[#4A6B7F] leading-relaxed">{t(item, 'answer', locale)}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Image Block ── */
function ImageBlockComponent({ block }: { block: any }) {
  const locale = useLocale();
  const src = imgUrl(block.image, 1200, 800);
  const sizes = { contained: 'max-w-3xl', wide: 'max-w-4xl', full: 'max-w-7xl' };
  const w = sizes[block.size as keyof typeof sizes] || 'max-w-4xl';

  if (!src) return null;
  return (
    <section className="py-12 px-6">
      <div className={`${w} mx-auto`}>
        <div className={`relative aspect-[16/9] overflow-hidden ${block.rounded !== false ? 'rounded-2xl' : ''}`}>
          <Image src={src} alt={block.alt || ''} fill className="object-cover" />
        </div>
        {t(block, 'caption', locale) && <p className="text-center text-xs text-[#8BA3B5] mt-3">{t(block, 'caption', locale)}</p>}
      </div>
    </section>
  );
}

/* ── Feature Grid Block ── */
function FeatureGridBlockComponent({ block }: { block: any }) {
  const locale = useLocale();
  const cols = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4' };
  const gridCls = cols[block.columns as keyof typeof cols] || 'md:grid-cols-3';

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          {t(block, 'title', locale) && <h2 className="text-2xl font-extrabold text-[#023047] mb-2">{t(block, 'title', locale)}</h2>}
          {t(block, 'subtitle', locale) && <p className="text-sm text-[#8BA3B5]">{t(block, 'subtitle', locale)}</p>}
        </div>
        <div className={`grid ${gridCls} gap-6`}>
          {block.features?.map((f: any, i: number) => {
            const Icon = iconMap[f.icon] || Zap;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:shadow-lg transition">
                <div className="w-10 h-10 rounded-xl bg-[#023047]/5 flex items-center justify-center mb-4"><Icon size={20} className="text-[#EF476F]" /></div>
                <h3 className="font-bold text-[#023047] mb-2 text-sm">{t(f, 'title', locale)}</h3>
                <p className="text-xs text-[#4A6B7F] leading-relaxed">{t(f, 'description', locale)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── COMPONENT MAP ── */
const blockComponents: Record<string, React.ComponentType<{ block: any }>> = {
  heroBlock: HeroBlockComponent,
  richTextBlock: RichTextBlockComponent,
  splitImageBlock: SplitImageBlockComponent,
  statsBlock: StatsBlockComponent,
  ctaBlock: CTABlockComponent,
  testimonialBlock: TestimonialBlockComponent,
  faqBlock: FAQBlockComponent,
  imageBlock: ImageBlockComponent,
  featureGridBlock: FeatureGridBlockComponent,
};

/* ── MAIN RENDERER ── */
export function PageBuilder({ sections }: { sections: any[] }) {
  if (!sections?.length) return (
    <div className="min-h-[50vh] flex items-center justify-center text-[#8BA3B5]">
      <p className="text-sm">No sections added yet. Go to Sanity Studio to add blocks.</p>
    </div>
  );

  return (
    <>
      {sections.map((block: any) => {
        const Component = blockComponents[block._type];
        if (!Component) return <div key={block._key} className="py-8 text-center text-xs text-red-400">Unknown block: {block._type}</div>;
        return <Component key={block._key} block={block} />;
      })}
    </>
  );
}
