import { getMaatschappelijk } from '@/lib/sanity-queries';
import { MaatschappelijkContent } from './content';

export const metadata = {
  title: 'Goed doel',
  description: 'Mijn maatschappelijke betrokkenheid. Van mantelzorg tot Baraka4Gambia.',
  alternates: { canonical: 'https://sambajarju.com/maatschappelijk' },
};

export default async function MaatschappelijkPage() {
  const data = await getMaatschappelijk().catch(() => null);
  return <MaatschappelijkContent sanityData={data} />;
}
