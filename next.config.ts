import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'logistiekpersoneel.online' },
      { protocol: 'https', hostname: 'www.paywatch.app' },
    ],
  },
};

export default withNextIntl(nextConfig);
