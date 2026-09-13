import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';

function loadApiSidebar(): unknown[] {
  const sidebarPath = fileURLToPath(new URL('../api/typedoc-sidebar.json', import.meta.url));
  if (!existsSync(sidebarPath)) {
    return [];
  }
  return JSON.parse(readFileSync(sidebarPath, 'utf-8')) as unknown[];
}

const guideSidebar = [
  {
    text: 'Guide',
    items: [
      { text: 'Getting started', link: '/guide/getting-started' },
      { text: 'Topics', link: '/guide/topics' },
      { text: 'Prefix topics', link: '/guide/prefix-topics' },
      { text: 'Protobuf', link: '/guide/protobuf' },
      { text: 'Struct', link: '/guide/struct' },
      { text: 'React', link: '/guide/react' },
      { text: 'Logging', link: '/guide/logging' },
    ],
  },
  {
    text: 'Explanation',
    items: [
      { text: 'NetworkTables overview', link: '/explanation/networktables' },
      { text: 'Struct vs protobuf', link: '/explanation/struct-vs-protobuf' },
    ],
  },
];

export default defineConfig({
  title: 'ntcore-ts',
  description: 'TypeScript and React clients for WPILib NetworkTables 4.1',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' },
      {
        text: 'GitHub',
        link: 'https://github.com/cjlawson02/ntcore-ts',
      },
    ],
    sidebar: {
      '/guide/': guideSidebar,
      '/explanation/': guideSidebar,
      '/api/': [
        {
          text: 'API reference',
          items: loadApiSidebar() as { text: string; link?: string; items?: unknown[] }[],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/cjlawson02/ntcore-ts' }],
    search: {
      provider: 'local',
    },
    editLink: {
      pattern: 'https://github.com/cjlawson02/ntcore-ts/edit/main/apps/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © ntcore-ts contributors',
    },
  },
});
