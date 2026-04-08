import { getAbmOutreach } from '@/lib/sanity-queries';
import { AbmOutreachContent } from './content';

export const metadata = {
  title: 'ABM Outreach System',
  description: 'Een volledig geautomatiseerd Account-Based Marketing systeem met Apollo.io, Mailgun, Claude AI, branded CVs en gepersonaliseerde landingspaginas.',
  alternates: { canonical: 'https://sambajarju.com/abm-outreach' },
};

export default async function AbmOutreachPage() {
  const data = await getAbmOutreach().catch(() => null);
  return <AbmOutreachContent sanityData={data} />;
}
