import { client } from '@/lib/sanity';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

export const metadata = { title: 'Pages', robots: { index: false, follow: false } };

async function getPages() {
  return client.fetch(
    `*[_type == "page"] | order(_createdAt desc) {
      title,
      "slug": slug.current,
      description,
      "blockCount": count(pageBuilder)
    }`,
    {},
    { next: { revalidate: 30 } }
  );
}

export default async function PagesIndex() {
  const pages = await getPages();

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard size={20} className="text-[#EF476F]" />
        <h1 className="text-2xl font-extrabold text-[#023047]">Pages (Builder)</h1>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-16 text-[#8BA3B5]">
          <p className="text-sm font-semibold mb-2">No pages yet</p>
          <p className="text-xs">Go to <a href="/studio" className="text-[#EF476F] underline">Sanity Studio</a> and create a Page under "Pages (Builder)"</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pages.map((page: { title: string; slug: string; description: string; blockCount: number }) => (
            <Link
              key={page.slug}
              href={`/p/${page.slug}`}
              className="flex items-center justify-between p-5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#023047] hover:shadow-md transition no-underline group"
            >
              <div>
                <h2 className="text-sm font-bold text-[#023047] group-hover:text-[#EF476F] transition">{page.title}</h2>
                {page.description && <p className="text-xs text-[#8BA3B5] mt-1">{page.description}</p>}
              </div>
              <span className="text-[10px] font-mono text-[#8BA3B5] bg-[#f4f7fa] px-2 py-1 rounded">{page.blockCount} blocks</span>
            </Link>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-[#8BA3B5] mt-12">
        <a href="/studio" className="text-[#EF476F] no-underline hover:underline">Open Studio</a> to create and edit pages
      </p>
    </div>
  );
}
