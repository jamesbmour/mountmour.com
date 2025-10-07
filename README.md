# Mountmour Guest Guide

A bilingual digital guest guide for the Mountmour vacation rental, built with Astro 4 and the `@advanced-astro/astro-docs-template`. It combines markdown/MDX content with interactive components so guests can quickly find arrival details, appliance instructions, maps, and contacts for the Aspen property.

## Table of contents
- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [Installing dependencies](#installing-dependencies)
  - [Running the dev server](#running-the-dev-server)
  - [Quality checks](#quality-checks)
  - [Building for production](#building-for-production)
- [Content authoring](#content-authoring)
  - [Docs and translations](#docs-and-translations)
  - [Navigation & metadata](#navigation--metadata)
  - [Data-driven pages](#data-driven-pages)
  - [Search index](#search-index)
- [Environment variables](#environment-variables)
- [Docker workflow](#docker-workflow)
- [Deployment notes](#deployment-notes)
- [License](#license)

## Key features
- **Guest-friendly documentation experience.** Content is organised into topical sections (Guide Books, Kitchen, Living Room, etc.) and exposed through a left-hand sidebar so visitors can browse everything from Wi-Fi credentials to appliance guides in one place.
- **Bilingual support.** English and German content directories ship out of the box, with automatic language detection handled in `src/languages.ts`.
- **Rich component ecosystem.** Astro integrates React, Preact, and Svelte components alongside Markdoc and MDX content, enabling interactive UI like Algolia DocSearch modals or custom right/left sidebars.
- **Search that works online and offline.** Algolia DocSearch powers instant lookup in production, while a Lunr-based static index can be generated locally for offline builds.
- **GitHub contributor attribution.** Footer avatars use the GitHub API (optionally authenticated) to display the most recent committers for each page.

## Tech stack
- [Astro 4](https://astro.build) for static site generation.
- React, Preact, and Svelte islands for interactive UI elements.
- Tailwind CSS with custom SCSS layers for styling.
- MDX, Markdoc, and Markdown content sources.
- Algolia DocSearch & Lunr for search.

## Project structure
```
src/
  components/         Reusable UI and layout fragments (headers, sidebars, footers)
  content/docs/       Guest-facing copy organised by language (MDX/MD)
  data/               Structured data files for appliances, maps, etc.
  layouts/            Astro layout shells such as MainLayout
  pages/              Route entry points
  scripts/            Maintenance scripts (e.g. search index builder)
  styles/             Tailwind layers and SCSS customisations
```

Important configuration lives in:
- `astro.config.mjs` – Astro integrations, site URL, and Tailwind setup.
- `src/consts.ts` – Site metadata, language definitions, sidebar structure, and Algolia configuration.
- `tailwind.config.mjs` & `src/styles/` – Theme tokens and component-level styling.

## Getting started
### Installing dependencies
This project tracks a `pnpm-lock.yaml`. Install [pnpm](https://pnpm.io/) (Node 18+ is recommended) and run:
```bash
pnpm install
```

### Running the dev server
Start Astro’s dev server with hot reload on `http://localhost:4321`:
```bash
pnpm dev
```
Use `pnpm preview` to inspect a production build locally.

### Quality checks
```bash
pnpm check           # Type and Markdown validation
pnpm run prettier:check
pnpm run lint:scss   # Stylelint for Astro/SCSS files
```
Run `pnpm run format` to apply Prettier fixes automatically.

### Building for production
Generate the static site into `dist/`:
```bash
pnpm build
```
Preview the output with `pnpm preview`.

## Content authoring
### Docs and translations
Docs live under `src/content/docs/<language>/`. Each file accepts frontmatter for titles and descriptions and can mix Markdown with MDX components. Duplicate or translate entries under the language folder to add new locales.

### Navigation & metadata
Update the sidebar and site strings in `src/consts.ts`. Each section key maps to an array of links scoped per language. This is also where Algolia credentials and Open Graph defaults live.

### Data-driven pages
Supporting assets such as appliance instructions, ski maps, and Wi-Fi credentials are stored as data files in `src/data/`. Import them in Astro/MDX pages to keep content maintainable.

### Search index
Run the Lunr index builder whenever you add or reorganise content:
```bash
pnpm run build-search-index
```
This scans docs and page routes, cleans their content, and writes `public/search-index.json` for offline search.

## Environment variables
Set `GITHUB_TOKEN` to a GitHub personal access token (with public repo scope) to raise API rate limits when fetching contributor avatars. Create a `.env` file and restart the dev server when you change it.

Algolia DocSearch credentials are configured in `src/consts.ts`. Override them with environment variables or secrets if deploying to production infrastructure.

## Docker workflow
A simple Docker setup is provided for local development:
- `Dockerfile` installs dependencies with npm, builds the site, and runs the dev server on port 3000.
- `docker-compose.yml` maps local `src/` and `public/` directories into the container and exposes the dev server on port `3000` → `4321`.

Build and run with:
```bash
docker compose up --build
```

## Deployment notes
- Run `pnpm build` before deploying and serve the generated `dist/` directory via your static host or CDN.
- Regenerate the search index (`pnpm run build-search-index`) after major content updates so new pages are discoverable.
- Configure any required environment secrets (Algolia, GitHub token) in your hosting provider.

## License
This project is released under the Apache 2.0 License. See [LICENSE](./LICENSE) for details.
