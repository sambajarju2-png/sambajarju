import { defineType, defineField } from 'sanity';

export const about = defineType({
  name: 'about',
  title: 'About Section',
  type: 'document',
  fields: [
    defineField({ name: 'photo1', title: 'Photo 1', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'photo2', title: 'Photo 2', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'photo3', title: 'Photo 3', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'photo4', title: 'Photo 4', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio_nl', title: 'Bio (NL)', type: 'text', rows: 8 }),
    defineField({ name: 'bio_en', title: 'Bio (EN)', type: 'text', rows: 8 }),
    defineField({ name: 'highlights', title: 'Highlight chips', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: { prepare: () => ({ title: 'About Section' }) },
});
