import { getProjectBySlug } from '@/lib/sanity-queries';
import { ABMContent } from './content';

export const metadata = {
  title: 'ABM Outreach System | Samba Jarju',
  description: 'Een volledig geautomatiseerd Account-Based Marketing systeem met gepersonaliseerde emails, branded CVs en landing pages.',
};

export default async function ABMPage() {
  const project = await getProjectBySlug('abm-outreach').catch(() => null);
  return <ABMContent sanityProject={project} />;
}
