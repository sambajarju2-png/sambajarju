import { getMaatschappelijk } from '@/lib/sanity-queries';
import { MaatschappelijkContent } from './content';

export default async function MaatschappelijkPage() {
  const data = await getMaatschappelijk().catch(() => null);
  return <MaatschappelijkContent sanityData={data} />;
}
