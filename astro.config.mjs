import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), preact(), react(), sitemap(), tailwind(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  base: `/`,
  site: `https://mountmour.com`
});