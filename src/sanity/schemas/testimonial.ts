import { defineType, defineField } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'company', title: 'Company', type: 'string' }),
    defineField({ name: 'quote_nl', title: 'Quote (NL)', type: 'text' }),
    defineField({ name: 'quote_en', title: 'Quote (EN)', type: 'text' }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
});
