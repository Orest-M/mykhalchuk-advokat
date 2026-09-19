// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Static generation; a single server endpoint (/api/lead) opts out via
  // `export const prerender = false` in task 8.
  output: 'static',
  // TODO(client): domain — replace with the production domain once chosen.
  site: 'https://example.com',
  adapter: cloudflare(),
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'uk',
    locales: ['uk'],
    routing: {
      // Ukrainian is served from the root (no /uk/ prefix). A second locale
      // added later gets its own prefix without touching existing routes.
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
