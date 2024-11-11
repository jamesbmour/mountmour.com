import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import svelte from '@astrojs/svelte';
import starlightDocSearch from '@astrojs/starlight-docsearch';

import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(),svelte(), preact(), react(), sitemap(), tailwind(), tailwind({
    applyBaseStyles: false
  }), markdoc(),sitemap(),
  starlight({
    title: 'Site with DocSearch',
    plugins: [
      starlightDocSearch({
        appId: '37J3RB86OE',
        apiKey: 'f079bd3edcd05fff46132f406ec56749',
        indexName: 'mountmour_articles',
      }),
    ],
  }),
],
  base: `/`,
  site: `https://mountmour.com`
});