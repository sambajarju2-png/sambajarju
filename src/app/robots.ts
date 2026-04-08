import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/studio', '/api/'],
      },
    ],
    sitemap: 'https://sambajarju.com/sitemap.xml',
  };
}
