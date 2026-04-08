import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ncaxnx1f',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const BASE = 'https://sambajarju.com';

// Revalidate every 6 hours
export const revalidate = 21600;

interface SanityContent {
  slug: string;
  updatedAt: string;
  publishedAt?: string;
  image?: string;
  title?: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry({
  loc,
  lastmod,
  changefreq,
  priority,
  image,
}: {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
  image?: { url: string; title?: string };
}): string {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
    <xhtml:link rel="alternate" hreflang="nl" href="${escapeXml(loc)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(loc)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(loc)}" />${
    image
      ? `
    <image:image>
      <image:loc>${escapeXml(image.url)}</image:loc>${image.title ? `
      <image:title>${escapeXml(image.title)}</image:title>` : ''}
    </image:image>`
      : ''
  }
  </url>`;
}

export async function GET() {
  // Fetch dynamic content from Sanity in parallel
  const [projects, blogPosts] = await Promise.all([
    sanity
      .fetch<SanityContent[]>(
        `*[_type == "project" && defined(slug.current)] | order(_updatedAt desc) {
          "slug": slug.current,
          "updatedAt": _updatedAt,
          "image": image.asset->url,
          "title": title
        }`
      )
      .catch(() => []),
    sanity
      .fetch<SanityContent[]>(
        `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
          "slug": slug.current,
          "updatedAt": _updatedAt,
          "publishedAt": publishedAt,
          "image": coverImage.asset->url,
          "title": coalesce(title_en, title_nl)
        }`
      )
      .catch(() => []),
  ]);

  const now = new Date().toISOString().split('T')[0];

  // ─── Static Pages ──────────────────────────────────────────
  const staticPages = [
    // Core pages
    { path: '',                 changefreq: 'weekly',  priority: 1.0 },
    { path: '/projects',        changefreq: 'weekly',  priority: 0.9 },
    { path: '/blog',            changefreq: 'weekly',  priority: 0.9 },
    { path: '/contact',         changefreq: 'monthly', priority: 0.8 },
    // Feature pages
    { path: '/abm-outreach',    changefreq: 'monthly', priority: 0.8 },
    { path: '/playground',      changefreq: 'monthly', priority: 0.7 },
    { path: '/maatschappelijk', changefreq: 'monthly', priority: 0.6 },
  ];

  // ─── Build XML ─────────────────────────────────────────────
  const entries: string[] = [];

  // Static pages
  for (const page of staticPages) {
    entries.push(
      urlEntry({
        loc: `${BASE}${page.path}`,
        lastmod: now,
        changefreq: page.changefreq,
        priority: page.priority,
      })
    );
  }

  // Dynamic project pages
  for (const p of projects) {
    entries.push(
      urlEntry({
        loc: `${BASE}/projects/${p.slug}`,
        lastmod: p.updatedAt?.split('T')[0] || now,
        changefreq: 'monthly',
        priority: 0.7,
        image: p.image ? { url: p.image, title: p.title } : undefined,
      })
    );
  }

  // Dynamic blog posts
  for (const p of blogPosts) {
    entries.push(
      urlEntry({
        loc: `${BASE}/blog/${p.slug}`,
        lastmod: (p.publishedAt || p.updatedAt)?.split('T')[0] || now,
        changefreq: 'weekly',
        priority: 0.8,
        image: p.image ? { url: p.image, title: p.title } : undefined,
      })
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${entries.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
}
