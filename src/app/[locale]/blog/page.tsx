import { getBlogPosts } from '@/lib/sanity-queries';
import { BlogContent } from './content';

export const metadata = {
  title: 'Blog',
  description: 'Artikelen over email marketing, marketing automation, data analytics en meer.',
  alternates: { canonical: 'https://sambajarju.com/blog' },
};

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => null);
  return <BlogContent posts={posts} />;
}
