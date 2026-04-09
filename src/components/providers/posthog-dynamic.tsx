'use client';

import dynamic from 'next/dynamic';

export const PostHogProviderDynamic = dynamic(
  () => import('@/components/providers/posthog-provider').then(m => ({ default: m.PostHogProvider })),
  { ssr: false }
);

export const PostHogPageViewDynamic = dynamic(
  () => import('@/components/providers/posthog-provider').then(m => ({ default: m.PostHogPageView })),
  { ssr: false }
);
