import { getProjectBySlug } from '@/lib/sanity-queries';
import { CaseStudyContent } from './content';

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  return <CaseStudyContent sanityProject={project} slug={slug} />;
}
