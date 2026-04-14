import { defineType, defineField, defineArrayMember } from 'sanity';
import { LayoutDashboard, Type, Image, SplitSquareVertical, BarChart3, Megaphone, MessageSquareQuote, HelpCircle, Columns3, Quote, List } from 'lucide-react';

/* ── BLOCK: Hero ── */
export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  icon: LayoutDashboard,
  fields: [
    defineField({ name: 'eyebrow_nl', title: 'Eyebrow (NL)', type: 'string', initialValue: 'Beschikbaar voor projecten' }),
    defineField({ name: 'eyebrow_en', title: 'Eyebrow (EN)', type: 'string', initialValue: 'Available for projects' }),
    defineField({ name: 'title_nl', title: 'Title (NL)', type: 'text', rows: 3 }),
    defineField({ name: 'title_en', title: 'Title (EN)', type: 'text', rows: 3 }),
    defineField({ name: 'subtitle_nl', title: 'Subtitle (NL)', type: 'text', rows: 2 }),
    defineField({ name: 'subtitle_en', title: 'Subtitle (EN)', type: 'text', rows: 2 }),
    defineField({ name: 'cta_text_nl', title: 'CTA Text (NL)', type: 'string' }),
    defineField({ name: 'cta_text_en', title: 'CTA Text (EN)', type: 'string' }),
    defineField({ name: 'cta_link', title: 'CTA Link', type: 'string', initialValue: '/for' }),
    defineField({ name: 'image', title: 'Background/Side Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'style',
      title: 'Style Variant',
      type: 'string',
      options: { list: [
        { title: 'Dark (navy background)', value: 'dark' },
        { title: 'Light (white background)', value: 'light' },
        { title: 'Gradient', value: 'gradient' },
      ]},
      initialValue: 'dark',
    }),
  ],
  preview: {
    select: { title: 'title_nl', subtitle: 'subtitle_nl' },
    prepare: ({ title, subtitle }) => ({ title: title || 'Hero Block', subtitle: subtitle || 'Hero section', media: LayoutDashboard }),
  },
});

/* ── BLOCK: Rich Text ── */
export const richTextBlock = defineType({
  name: 'richTextBlock',
  title: 'Rich Text',
  type: 'object',
  icon: Type,
  fields: [
    defineField({ name: 'label_nl', title: 'Section Label (NL)', type: 'string' }),
    defineField({ name: 'label_en', title: 'Section Label (EN)', type: 'string' }),
    defineField({ name: 'title_nl', title: 'Title (NL)', type: 'string' }),
    defineField({ name: 'title_en', title: 'Title (EN)', type: 'string' }),
    defineField({ name: 'body_nl', title: 'Body (NL)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'body_en', title: 'Body (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'width',
      title: 'Content Width',
      type: 'string',
      options: { list: [{ title: 'Narrow (640px)', value: 'narrow' }, { title: 'Medium (768px)', value: 'medium' }, { title: 'Wide (1024px)', value: 'wide' }, { title: 'Full', value: 'full' }] },
      initialValue: 'medium',
    }),
  ],
  preview: {
    select: { title: 'title_nl' },
    prepare: ({ title }) => ({ title: title || 'Rich Text', subtitle: 'Text content block', media: Type }),
  },
});

/* ── BLOCK: Split Image + Text ── */
export const splitImageBlock = defineType({
  name: 'splitImageBlock',
  title: 'Split Image',
  type: 'object',
  icon: SplitSquareVertical,
  fields: [
    defineField({ name: 'title_nl', title: 'Title (NL)', type: 'string' }),
    defineField({ name: 'title_en', title: 'Title (EN)', type: 'string' }),
    defineField({ name: 'body_nl', title: 'Body (NL)', type: 'text', rows: 4 }),
    defineField({ name: 'body_en', title: 'Body (EN)', type: 'text', rows: 4 }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'image_position',
      title: 'Image Position',
      type: 'string',
      options: { list: [{ title: 'Left', value: 'left' }, { title: 'Right', value: 'right' }] },
      initialValue: 'right',
    }),
    defineField({ name: 'cta_text_nl', title: 'CTA Text (NL)', type: 'string' }),
    defineField({ name: 'cta_text_en', title: 'CTA Text (EN)', type: 'string' }),
    defineField({ name: 'cta_link', title: 'CTA Link', type: 'string' }),
  ],
  preview: {
    select: { title: 'title_nl', media: 'image' },
    prepare: ({ title, media }) => ({ title: title || 'Split Image', subtitle: 'Image + text side by side', media: media || SplitSquareVertical }),
  },
});

/* ── BLOCK: Stats Grid ── */
export const statsBlock = defineType({
  name: 'statsBlock',
  title: 'Stats',
  type: 'object',
  icon: BarChart3,
  fields: [
    defineField({ name: 'title_nl', title: 'Title (NL)', type: 'string' }),
    defineField({ name: 'title_en', title: 'Title (EN)', type: 'string' }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'value', title: 'Value', type: 'string' }),
          defineField({ name: 'label_nl', title: 'Label (NL)', type: 'string' }),
          defineField({ name: 'label_en', title: 'Label (EN)', type: 'string' }),
        ],
        preview: {
          select: { title: 'value', subtitle: 'label_nl' },
          prepare: ({ title, subtitle }) => ({ title, subtitle }),
        },
      })],
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: { list: [{ title: 'White', value: 'white' }, { title: 'Navy', value: 'navy' }, { title: 'Light gray', value: 'gray' }] },
      initialValue: 'white',
    }),
  ],
  preview: {
    select: { title: 'title_nl' },
    prepare: ({ title }) => ({ title: title || 'Stats Grid', subtitle: 'Numbers section', media: BarChart3 }),
  },
});

/* ── BLOCK: CTA Banner ── */
export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'CTA Banner',
  type: 'object',
  icon: Megaphone,
  fields: [
    defineField({ name: 'title_nl', title: 'Title (NL)', type: 'string' }),
    defineField({ name: 'title_en', title: 'Title (EN)', type: 'string' }),
    defineField({ name: 'subtitle_nl', title: 'Subtitle (NL)', type: 'string' }),
    defineField({ name: 'subtitle_en', title: 'Subtitle (EN)', type: 'string' }),
    defineField({ name: 'button_text_nl', title: 'Button Text (NL)', type: 'string' }),
    defineField({ name: 'button_text_en', title: 'Button Text (EN)', type: 'string' }),
    defineField({ name: 'button_link', title: 'Button Link', type: 'string' }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: { list: [{ title: 'Navy background', value: 'navy' }, { title: 'Pink accent', value: 'pink' }, { title: 'Minimal', value: 'minimal' }] },
      initialValue: 'navy',
    }),
  ],
  preview: {
    select: { title: 'title_nl' },
    prepare: ({ title }) => ({ title: title || 'CTA Banner', subtitle: 'Call to action', media: Megaphone }),
  },
});

/* ── BLOCK: Testimonials ── */
export const testimonialBlock = defineType({
  name: 'testimonialBlock',
  title: 'Testimonials',
  type: 'object',
  icon: MessageSquareQuote,
  fields: [
    defineField({ name: 'title_nl', title: 'Title (NL)', type: 'string', initialValue: 'Wat anderen zeggen' }),
    defineField({ name: 'title_en', title: 'Title (EN)', type: 'string', initialValue: 'What others say' }),
    defineField({
      name: 'items',
      title: 'Testimonials',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3 }),
          defineField({ name: 'name', title: 'Name', type: 'string' }),
          defineField({ name: 'role', title: 'Role', type: 'string' }),
        ],
        preview: {
          select: { title: 'name', subtitle: 'role' },
          prepare: ({ title, subtitle }) => ({ title, subtitle, media: Quote }),
        },
      })],
    }),
  ],
  preview: {
    select: { title: 'title_nl' },
    prepare: ({ title }) => ({ title: title || 'Testimonials', subtitle: 'Client quotes', media: MessageSquareQuote }),
  },
});

/* ── BLOCK: FAQ ── */
export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircle,
  fields: [
    defineField({ name: 'title_nl', title: 'Title (NL)', type: 'string', initialValue: 'Veelgestelde vragen' }),
    defineField({ name: 'title_en', title: 'Title (EN)', type: 'string', initialValue: 'FAQ' }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'question_nl', title: 'Question (NL)', type: 'string' }),
          defineField({ name: 'question_en', title: 'Question (EN)', type: 'string' }),
          defineField({ name: 'answer_nl', title: 'Answer (NL)', type: 'text', rows: 3 }),
          defineField({ name: 'answer_en', title: 'Answer (EN)', type: 'text', rows: 3 }),
        ],
        preview: {
          select: { title: 'question_nl' },
          prepare: ({ title }) => ({ title: title || 'Question', media: HelpCircle }),
        },
      })],
    }),
  ],
  preview: {
    select: { title: 'title_nl' },
    prepare: ({ title }) => ({ title: title || 'FAQ', subtitle: 'Questions section', media: HelpCircle }),
  },
});

/* ── BLOCK: Image ── */
export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  icon: Image,
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
    defineField({ name: 'caption_nl', title: 'Caption (NL)', type: 'string' }),
    defineField({ name: 'caption_en', title: 'Caption (EN)', type: 'string' }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: { list: [{ title: 'Contained (max 768px)', value: 'contained' }, { title: 'Wide (max 1024px)', value: 'wide' }, { title: 'Full width', value: 'full' }] },
      initialValue: 'wide',
    }),
    defineField({ name: 'rounded', title: 'Rounded corners', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'alt', media: 'image' },
    prepare: ({ title, media }) => ({ title: title || 'Image', subtitle: 'Image block', media: media || Image }),
  },
});

/* ── BLOCK: Feature Grid ── */
export const featureGridBlock = defineType({
  name: 'featureGridBlock',
  title: 'Feature Grid',
  type: 'object',
  icon: Columns3,
  fields: [
    defineField({ name: 'title_nl', title: 'Title (NL)', type: 'string' }),
    defineField({ name: 'title_en', title: 'Title (EN)', type: 'string' }),
    defineField({ name: 'subtitle_nl', title: 'Subtitle (NL)', type: 'string' }),
    defineField({ name: 'subtitle_en', title: 'Subtitle (EN)', type: 'string' }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'title_nl', title: 'Title (NL)', type: 'string' }),
          defineField({ name: 'title_en', title: 'Title (EN)', type: 'string' }),
          defineField({ name: 'description_nl', title: 'Description (NL)', type: 'text', rows: 2 }),
          defineField({ name: 'description_en', title: 'Description (EN)', type: 'text', rows: 2 }),
          defineField({ name: 'icon', title: 'Icon name (Lucide)', type: 'string', description: 'e.g. "mail", "zap", "target", "bar-chart-3"' }),
        ],
        preview: {
          select: { title: 'title_nl' },
          prepare: ({ title }) => ({ title: title || 'Feature', media: List }),
        },
      })],
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [2, 3, 4] },
      initialValue: 3,
    }),
  ],
  preview: {
    select: { title: 'title_nl' },
    prepare: ({ title }) => ({ title: title || 'Feature Grid', subtitle: 'Features section', media: Columns3 }),
  },
});

/* ── PAGE DOCUMENT ── */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: LayoutDashboard,
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'description', title: 'SEO Description', type: 'text', rows: 2 }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Sections',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroBlock' }),
        defineArrayMember({ type: 'richTextBlock' }),
        defineArrayMember({ type: 'splitImageBlock' }),
        defineArrayMember({ type: 'statsBlock' }),
        defineArrayMember({ type: 'ctaBlock' }),
        defineArrayMember({ type: 'testimonialBlock' }),
        defineArrayMember({ type: 'faqBlock' }),
        defineArrayMember({ type: 'imageBlock' }),
        defineArrayMember({ type: 'featureGridBlock' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `/${subtitle || ''}` }),
  },
});
