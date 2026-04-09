import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ncaxnx1f',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const BASE = 'https://sambajarju.com';
export const revalidate = 21600;

interface SanityContent { slug: string; updatedAt: string; publishedAt?: string; image?: string; title?: string; }

function esc(s: string) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

export async function GET() {
  const [projects, blogPosts] = await Promise.all([
    sanity.fetch<SanityContent[]>(`*[_type == "project" && defined(slug.current)] | order(_updatedAt desc) { "slug": slug.current, "updatedAt": _updatedAt, "image": image.asset->url, "title": title }`).catch(() => []),
    sanity.fetch<SanityContent[]>(`*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) { "slug": slug.current, "updatedAt": _updatedAt, "publishedAt": publishedAt, "image": coverImage.asset->url, "title": coalesce(title_en, title_nl) }`).catch(() => []),
  ]);

  const urls: string[] = [];
  const add = (loc: string, lastmod: string, img?: { url: string; title?: string }) => {
    urls.push(`  <url>\n    <loc>${esc(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>${img ? `\n    <image:image>\n      <image:loc>${esc(img.url)}</image:loc>${img.title ? `\n      <image:title>${esc(img.title)}</image:title>` : ''}\n    </image:image>` : ''}\n  </url>`);
  };

  add(`${BASE}/`, '2026-04-09');
  add(`${BASE}/projects`, '2026-04-08');
  add(`${BASE}/blog`, '2026-04-08');
  add(`${BASE}/contact`, '2026-04-01');
  add(`${BASE}/abm-outreach`, '2026-04-08');
  add(`${BASE}/playground`, '2026-03-20');
  add(`${BASE}/for`, '2026-04-08');
  add(`${BASE}/maatschappelijk`, '2026-03-15');

  for (const p of projects) add(`${BASE}/projects/${p.slug}`, p.updatedAt?.split('T')[0] || '2026-04-01', p.image ? { url: p.image, title: p.title } : undefined);
  for (const p of blogPosts) add(`${BASE}/blog/${p.slug}`, (p.publishedAt || p.updatedAt)?.split('T')[0] || '2026-04-01', p.image ? { url: p.image, title: p.title } : undefined);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>`;

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600' } });
}
