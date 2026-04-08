import { getBlogPostBySlug, getBlogPosts } from '@/lib/sanity-queries';
import { BlogPostContent } from './content';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  if (!post) return { title: 'Blog | Samba Jarju' };
  return {
    title: post.seoTitle || post.title_nl || 'Blog | Samba Jarju',
    description: post.seoDescription || post.excerpt_nl || '',
    openGraph: {
      title: post.seoTitle || post.title_nl || '',
      description: post.seoDescription || post.excerpt_nl || '',
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  return <BlogPostContent post={post} />;
}
