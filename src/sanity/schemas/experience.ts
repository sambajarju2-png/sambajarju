import { defineType, defineField } from 'sanity';

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({ name: 'company', title: 'Company', type: 'string', validation: r => r.required() }),
    defineField({ name: 'role_nl', title: 'Role (NL)', type: 'string' }),
    defineField({ name: 'role_en', title: 'Role (EN)', type: 'string' }),
    defineField({ name: 'period', title: 'Period', type: 'string' }),
    defineField({ name: 'description_nl', title: 'Description (NL)', type: 'text' }),
    defineField({ name: 'description_en', title: 'Description (EN)', type: 'text' }),
    defineField({ name: 'active', title: 'Currently active?', type: 'boolean', initialValue: false }),
    defineField({ name: 'icon', title: 'Icon (lucide name)', type: 'string' }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
});
