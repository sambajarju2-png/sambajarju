'use client';

import dynamic from 'next/dynamic';

// Provider is SSR-safe (just wraps children in context), so no ssr:false
export { PostHogProvider as PostHogProviderDynamic } from '@/components/providers/posthog-provider';

// PageView uses useSearchParams which triggers CSR bailout, so ssr:false is correct here
export const PostHogPageViewDynamic = dynamic(
  () => import('@/components/providers/posthog-provider').then(m => ({ default: m.PostHogPageView })),
  { ssr: false }
);
