import { defineType, defineField } from 'sanity';

export const heroSettings = defineType({
  name: 'heroSettings',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({ name: 'photo', title: 'Hero Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'greeting_nl', title: 'Greeting (NL)', type: 'string', initialValue: 'Hey, ik ben Samba' }),
    defineField({ name: 'greeting_en', title: 'Greeting (EN)', type: 'string', initialValue: "Hey, I'm Samba" }),
    defineField({ name: 'title_nl', title: 'Title (NL)', type: 'string', initialValue: 'Creativiteit ontmoet strategie' }),
    defineField({ name: 'title_en', title: 'Title (EN)', type: 'string', initialValue: 'Creativity meets strategy' }),
    defineField({ name: 'subtitle_nl', title: 'Subtitle (NL)', type: 'text', rows: 3 }),
    defineField({ name: 'subtitle_en', title: 'Subtitle (EN)', type: 'text', rows: 3 }),
    defineField({ name: 'cta_primary_nl', title: 'CTA Primary (NL)', type: 'string', initialValue: 'Laten we praten' }),
    defineField({ name: 'cta_primary_en', title: 'CTA Primary (EN)', type: 'string', initialValue: "Let's talk" }),
    defineField({ name: 'cta_secondary_nl', title: 'CTA Secondary (NL)', type: 'string', initialValue: 'Bekijk projecten' }),
    defineField({ name: 'cta_secondary_en', title: 'CTA Secondary (EN)', type: 'string', initialValue: 'View projects' }),
    defineField({
      name: 'companies',
      title: 'Companies (marquee)',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['ESET', 'Exact', 'NPO 3', 'Vandebron', 'Visma', 'Odido', 'Mollie'],
    }),
  ],
  preview: { prepare: () => ({ title: 'Hero Settings' }) },
});
