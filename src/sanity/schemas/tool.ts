import { defineType, defineField } from 'sanity';

export const tool = defineType({
  name: 'tool',
  title: 'Tool',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'SimpleIcons slug', type: 'string' }),
    defineField({ name: 'color', title: 'Hex color (no #)', type: 'string' }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: ['Email & Marketing', 'Analytics', 'CRM', 'Development', 'Automation', 'Design & AI'] } }),
    defineField({ name: 'description_nl', title: 'Description (NL)', type: 'text' }),
    defineField({ name: 'description_en', title: 'Description (EN)', type: 'text' }),
    defineField({ name: 'experience', title: 'Experience', type: 'string' }),
    defineField({ name: 'url', title: 'URL', type: 'url' }),
  ],
});
