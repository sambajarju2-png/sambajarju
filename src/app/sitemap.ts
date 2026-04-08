import type { MetadataRoute } from 'next';
import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ncaxnx1f',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const BASE = 'https://sambajarju.com';

interface SanitySlug {
  slug: { current: string };
  _updatedAt?: string;
  publishedAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic content from Sanity
  const [projects, blogPosts] = await Promise.all([
    sanity.fetch<SanitySlug[]>(
      `*[_type == "project" && defined(slug.current)]{slug, _updatedAt}`
    ).catch(() => []),
    sanity.fetch<SanitySlug[]>(
      `*[_type == "blogPost" && defined(slug.current)]{slug, publishedAt, _updatedAt}`
    ).catch(() => []),
  ]);

  const alternates = {
    languages: {
      'nl': `${BASE}`,
      'en': `${BASE}`,
      'x-default': `${BASE}`,
    },
  };

  const makeAlternates = (path: string) => ({
    languages: {
      'nl': `${BASE}${path}`,
      'en': `${BASE}${path}`,
      'x-default': `${BASE}${path}`,
    },
  });

  // Static pages with hierarchy
  const staticEntries: MetadataRoute.Sitemap = [
    // Homepage - highest priority
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates,
    },
    // Main sections - high priority
    {
      url: `${BASE}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: makeAlternates('/projects'),
    },
    {
      url: `${BASE}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: makeAlternates('/blog'),
    },
    {
      url: `${BASE}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: makeAlternates('/contact'),
    },
    // Feature pages - medium-high priority
    {
      url: `${BASE}/abm-outreach`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: makeAlternates('/abm-outreach'),
    },
    {
      url: `${BASE}/maatschappelijk`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: makeAlternates('/maatschappelijk'),
    },
    {
      url: `${BASE}/playground`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: makeAlternates('/playground'),
    },
    // ABM demo page - lower priority (personalized, not for indexing really)
    {
      url: `${BASE}/for`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
      alternates: makeAlternates('/for'),
    },
  ];

  // Dynamic project pages
  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/projects/${p.slug.current}`,
    lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    alternates: makeAlternates(`/projects/${p.slug.current}`),
  }));

  // Dynamic blog post pages
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug.current}`,
    lastModified: p._updatedAt ? new Date(p._updatedAt) : p.publishedAt ? new Date(p.publishedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: makeAlternates(`/blog/${p.slug.current}`),
  }));

  return [...staticEntries, ...projectEntries, ...blogEntries];
}
