import { getBlogPosts } from '@/lib/sanity-queries';
import { BlogContent } from './content';

export const metadata = {
  title: 'Blog | Samba Jarju',
  description: 'Artikelen over email marketing, marketing automation, data analytics en meer.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => null);
  return <BlogContent posts={posts} />;
}
