import { client } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import type { Metadata } from 'next';
import PageContent from './content';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

async function getPage(slug: string, isDraft: boolean) {
  const c = isDraft
    ? client.withConfig({
        perspective: 'previewDrafts',
        useCdn: false,
        token: process.env.SANITY_API_TOKEN,
        stega: { enabled: true, studioUrl: '/studio' },
      })
    : client;

  return c.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      description,
      "slug": slug.current,
      pageBuilder[]{
        _type,
        _key,
        ...,
        image{ ..., asset-> }
      }
    }`,
    { slug },
    { next: { revalidate: isDraft ? 0 : 30 } }
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug, false);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description || undefined,
    robots: { index: false, follow: false },
  };
}

export default async function PageBuilderPage({ params }: Props) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const page = await getPage(slug, isEnabled);
  if (!page) notFound();

  return <PageContent page={page} />;
}
