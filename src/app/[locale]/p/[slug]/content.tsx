'use client';

import { PageBuilder } from '@/components/page-builder/block-renderer';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PageContent({ page }: { page: any }) {
  return (
    <div className="min-h-screen">
      <PageBuilder sections={page.pageBuilder || []} />
    </div>
  );
}
