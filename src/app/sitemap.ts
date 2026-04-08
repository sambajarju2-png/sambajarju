import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://sambajarju.com';

  const staticPages = [
    '', '/projects', '/blog', '/contact', '/maatschappelijk',
    '/playground', '/for',
  ];

  const entries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/projects' || path === '/blog' ? 0.8 : 0.6,
  }));

  return entries;
}
