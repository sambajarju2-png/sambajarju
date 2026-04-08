import { getAbmOutreach } from '@/lib/sanity-queries';
import { AbmOutreachContent } from './content';

export const metadata = {
  title: 'ABM Outreach System | Samba Jarju',
  description: 'Hoe ik een volledig geautomatiseerd Account-Based Marketing systeem heb gebouwd met Apollo.io, Mailgun, Claude AI en meer.',
};

export default async function AbmOutreachPage() {
  const data = await getAbmOutreach().catch(() => null);
  return <AbmOutreachContent sanityData={data} />;
}
