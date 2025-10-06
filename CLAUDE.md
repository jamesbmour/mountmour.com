# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based documentation website for an Airbnb property guide (mountmour.com). The site provides multilingual guest information with English and German support, featuring house guides, appliance instructions, and local area information.

## Development Commands

```bash
# Start development server
npm run dev
# or
npm start

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Linting and formatting
npm run lint:scss              # Lint SCSS and Astro styles
npm run prettier:check         # Check code formatting
npm run format                 # Auto-format code with Prettier

# Build search index (run before deployment if content changes)
npm run build-search-index
```

## Architecture

### Content Management

- **Content Collections**: Uses Astro Content Collections with schema validation (`src/content/config.ts`)
- **Docs Storage**: Markdown/MDX files in `src/content/docs/` organized by language (`en/`, `de/`)
- **Content Schema**: All docs require `title`, `description`, `lang`, and `dir` frontmatter
- **Static Assets**: Reference documents, PDFs, and images stored in `src/data/`

### Routing System

- **Dynamic Routes**: `src/pages/[...slug].astro` handles all content routes via `getStaticPaths()`
- **Content Rendering**: Pages fetch from the `docs` collection and render via `MainLayout`
- **Homepage**: `src/pages/index.astro` serves as the entry point

### Layout Structure

- **MainLayout** (`src/layouts/MainLayout.astro`): Primary layout with three-column responsive grid
  - Left Sidebar: Site navigation (desktop only)
  - Main Content: Page content with headings
  - Right Sidebar: Table of contents (large screens only)
  - Integrated Flowise chatbot for guest assistance

### Navigation

- **Sidebar Configuration**: Defined in `src/consts.ts` as the `SIDEBAR` object
- **Multilingual**: Separate nav structures for each language in `KNOWN_LANGUAGES`
- **Categories**: "Guide Books", "Kitchen", "Living Room", "Other"

### Search

- **Algolia Integration**: Search powered by Algolia with credentials in `ALGOLIA` constant
- **Search Index**: Built via `src/scripts/build-search-index.js` using Lunr.js
- **Index Output**: Generated to `public/search-index.json`

### Component Architecture

- **Framework Flexibility**: Uses multiple frameworks (React, Preact, Svelte) via Astro integrations
- **UI Components**: Shadcn-style components in `src/components/ui/` (React/TypeScript)
  - Built with Radix UI primitives
  - Styled with Tailwind CSS and CVA (class-variance-authority)
- **Layout Components**:
  - `Header/` - Site header with navigation
  - `Footer/` - Site footer
  - `LeftSidebar/` - Main navigation sidebar
  - `RightSidebar/` - Table of contents
  - `PageContent/` - Content wrapper with heading structure

### Styling

- **Tailwind CSS**: Primary styling system with custom theme in `tailwind.config.mjs`
- **CSS Variables**: Theme colors defined via HSL CSS variables
- **Dark Mode**: Class-based dark mode support
- **SCSS**: Additional styles in `src/styles/`
- **No Preflight**: Tailwind preflight disabled (`corePlugins.preflight: false`)

### TypeScript Configuration

- **Strict Mode**: Extends `astro/tsconfigs/strict`
- **JSX Runtime**: Configured for Preact (`jsxImportSource: "preact"`)
- **Path Aliases**: `@/*` maps to `./src/*`

### Integrations

- **Astro Integrations**: MDX, Markdoc, Preact, React, Svelte, Sitemap, Tailwind
- **Chatbot**: Flowise embedded chatbot (hosted at `https://fw.jb7.me`)
- **SEO**: Automated sitemap generation, custom meta tags via `HeadSEO.astro`

## Deployment

- **Platform**: Azure Static Web Apps
- **CI/CD**: GitHub Actions workflow (`.github/workflows/azure-static-web-apps-calm-field-0e82da210.yml`)
- **Branch**: Deploys from `main` branch
- **Build Command**: `npm run build` (Astro)
- **Output Directory**: `dist/`

## Content Editing Guidelines

When adding or modifying content:

1. Create MDX files in `src/content/docs/{lang}/` following existing structure
2. Include required frontmatter (title, description, lang, dir)
3. Update `SIDEBAR` in `src/consts.ts` for navigation
4. Run `npm run build-search-index` to update search
5. Images/PDFs go in `src/data/` or appropriate subdirectory

## Key Files

- `src/consts.ts` - Site configuration, navigation, Algolia settings
- `src/content/config.ts` - Content collection schemas
- `src/layouts/MainLayout.astro` - Primary page template
- `src/pages/[...slug].astro` - Dynamic content router
- `astro.config.mjs` - Astro framework configuration
- `tailwind.config.mjs` - Tailwind theme and plugin configuration
