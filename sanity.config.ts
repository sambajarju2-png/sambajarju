'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from '@/sanity/schemas';

export default defineConfig({
  name: 'samba-portfolio',
  title: 'Samba Jarju Portfolio',
  projectId: 'ncaxnx1f',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S: any) =>
        S.list()
          .title('Content')
          .items([
            // Singletons
            S.listItem()
              .title('🏠 Hero Section')
              .child(S.document().schemaType('heroSettings').documentId('heroSettings')),
            S.listItem()
              .title('👤 About Section')
              .child(S.document().schemaType('about').documentId('about')),
            S.divider(),
            // Pages
            S.listItem()
              .title('🤝 Maatschappelijk Betrokken')
              .schemaType('maatschappelijk')
              .child(S.documentTypeList('maatschappelijk').title('Maatschappelijk')),
            S.divider(),
            // Collections
            S.listItem()
              .title('📁 Projects')
              .schemaType('project')
              .child(S.documentTypeList('project').title('Projects')),
            S.listItem()
              .title('📝 Blog Posts')
              .schemaType('blogPost')
              .child(S.documentTypeList('blogPost').title('Blog Posts')),
            S.listItem()
              .title('💼 Experience')
              .schemaType('experience')
              .child(S.documentTypeList('experience').title('Experience')),
            S.listItem()
              .title('💬 Testimonials')
              .schemaType('testimonial')
              .child(S.documentTypeList('testimonial').title('Testimonials')),
            S.listItem()
              .title('❓ FAQ')
              .schemaType('faq')
              .child(S.documentTypeList('faq').title('FAQ')),
            S.listItem()
              .title('🔧 Tools')
              .schemaType('tool')
              .child(S.documentTypeList('tool').title('Tools')),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
