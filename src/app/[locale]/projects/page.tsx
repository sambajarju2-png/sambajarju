import { getProjects } from '@/lib/sanity-queries';
import { ProjectsContent } from './content';

export const metadata = {
  title: 'Projecten',
  description: 'Bekijk mijn projecten en case studies op het gebied van marketing automation, email marketing en webontwikkeling.',
  alternates: { canonical: 'https://sambajarju.com/projects' },
};

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => null);
  return <ProjectsContent sanityProjects={projects} />;
}
