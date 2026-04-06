import { defineType, defineField } from 'sanity';

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'question_nl', title: 'Question (NL)', type: 'string' }),
    defineField({ name: 'question_en', title: 'Question (EN)', type: 'string' }),
    defineField({ name: 'answer_nl', title: 'Answer (NL)', type: 'text' }),
    defineField({ name: 'answer_en', title: 'Answer (EN)', type: 'text' }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
});
