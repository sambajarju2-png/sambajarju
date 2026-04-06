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
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singletons
            S.listItem()
              .title('Hero Section')
              .child(S.document().schemaType('heroSettings').documentId('heroSettings')),
            S.listItem()
              .title('About Section')
              .child(S.document().schemaType('about').documentId('about')),
            S.divider(),
            // Collections
            ...S.documentTypeListItems().filter(
              (item) => !['heroSettings', 'about'].includes(item.getId()!)
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
