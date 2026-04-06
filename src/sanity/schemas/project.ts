import { defineType, defineField } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'description_nl', title: 'Description (NL)', type: 'text', rows: 4 }),
    defineField({ name: 'description_en', title: 'Description (EN)', type: 'text', rows: 4 }),
    defineField({ name: 'image', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'featured', title: 'Featured?', type: 'boolean', initialValue: false }),
    defineField({ name: 'techStack', title: 'Tech Stack', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'url', title: 'URL', type: 'url' }),
    defineField({ name: 'problem_nl', title: 'Problem (NL)', type: 'text' }),
    defineField({ name: 'problem_en', title: 'Problem (EN)', type: 'text' }),
    defineField({ name: 'solution_nl', title: 'Solution (NL)', type: 'text' }),
    defineField({ name: 'solution_en', title: 'Solution (EN)', type: 'text' }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
});
