import { defineType, defineField } from 'sanity';

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title_nl', title: 'Title (NL)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'title_en', title: 'Title (EN)', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title_nl' }, validation: r => r.required() }),
    defineField({ name: 'excerpt_nl', title: 'Excerpt (NL)', type: 'text', rows: 3 }),
    defineField({ name: 'excerpt_en', title: 'Excerpt (EN)', type: 'text', rows: 3 }),
    defineField({ name: 'body_nl', title: 'Body (NL)', type: 'array', of: [
      { type: 'block' },
      { type: 'image', options: { hotspot: true }, fields: [{ name: 'caption', title: 'Caption', type: 'string' }, { name: 'alt', title: 'Alt', type: 'string' }] },
    ] }),
    defineField({ name: 'body_en', title: 'Body (EN)', type: 'array', of: [
      { type: 'block' },
      { type: 'image', options: { hotspot: true }, fields: [{ name: 'caption', title: 'Caption', type: 'string' }, { name: 'alt', title: 'Alt', type: 'string' }] },
    ] }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: [
      { title: 'Email Marketing', value: 'email-marketing' },
      { title: 'Marketing Automation', value: 'marketing-automation' },
      { title: 'Data & Analytics', value: 'data-analytics' },
      { title: 'CRO', value: 'cro' },
      { title: 'SEO', value: 'seo' },
      { title: 'Tools & Reviews', value: 'tools' },
      { title: 'Case Study', value: 'case-study' },
      { title: 'Personal', value: 'personal' },
    ] } }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', description: 'Overrides the default title for search engines' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2 }),
    defineField({ name: 'featured', title: 'Featured?', type: 'boolean', initialValue: false }),
  ],
  orderings: [{ title: 'Published', name: 'published', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'title_nl', subtitle: 'category', media: 'coverImage' },
  },
});
