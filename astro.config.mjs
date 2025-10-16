import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import svelte from '@astrojs/svelte';

import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(),svelte(), react(), sitemap(), tailwind(), tailwind({
    applyBaseStyles: false
  }), markdoc(),sitemap()],
  base: `/`,
  site: `https://mountmour.com`
});