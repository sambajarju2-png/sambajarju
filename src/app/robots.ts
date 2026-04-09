import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/studio', '/studio/', '/api/', '/landing', '/_next/', '/test-dynamic'],
      },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
    ],
    sitemap: 'https://sambajarju.com/sitemap.xml',
    host: 'https://sambajarju.com',
  };
}
