import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import svelte from '@astrojs/svelte';
// import starlightDocSearch from '@astrojs/starlight-docsearch';
// import starlight from '@astrojs/starlight';
import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(),svelte(), preact(), react(), sitemap(), tailwind(), tailwind({
    applyBaseStyles: false
  }), markdoc(),sitemap()
],
  base: `/`,
  site: `https://mountmour.com`
});