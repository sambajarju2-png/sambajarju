import { defineType, defineField } from 'sanity';

export const abmOutreach = defineType({
  name: 'abmOutreach',
  title: 'ABM Outreach Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'title_nl', title: 'Title (NL)', type: 'string' }),
    defineField({ name: 'title_en', title: 'Title (EN)', type: 'string' }),
    defineField({ name: 'subtitle_nl', title: 'Subtitle (NL)', type: 'text', rows: 3 }),
    defineField({ name: 'subtitle_en', title: 'Subtitle (EN)', type: 'text', rows: 3 }),
    defineField({
      name: 'steps',
      title: 'Pipeline Steps',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title_nl', title: 'Step Title (NL)', type: 'string' },
          { name: 'title_en', title: 'Step Title (EN)', type: 'string' },
          { name: 'description_nl', title: 'Description (NL)', type: 'text' },
          { name: 'description_en', title: 'Description (EN)', type: 'text' },
          { name: 'tool', title: 'Tool/Service Used', type: 'string' },
          { name: 'screenshot', title: 'Screenshot', type: 'image', options: { hotspot: true }, fields: [{ name: 'caption', title: 'Caption', type: 'string' }] },
        ],
      }],
    }),
    defineField({
      name: 'gallery',
      title: 'Example Screenshots Gallery',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          { name: 'caption', title: 'Caption', type: 'string' },
          { name: 'alt', title: 'Alt text', type: 'string' },
        ],
      }],
    }),
    defineField({ name: 'techStack', title: 'Tech Stack', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: { select: { title: 'title_nl' } },
});
