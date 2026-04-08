import { defineType, defineField } from 'sanity';

export const maatschappelijk = defineType({
  name: 'maatschappelijk',
  title: 'Maatschappelijk Betrokken',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'text',
    }),
    defineField({
      name: 'photos',
      title: 'Photo Carousel',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', title: 'Caption', type: 'string' },
            { name: 'alt', title: 'Alt text', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'content', title: 'Content', type: 'text' },
          ],
        },
      ],
    }),
  ],
});
