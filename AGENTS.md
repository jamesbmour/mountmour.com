# Repository Guidelines

## Project Structure & Module Organization
This Astro documentation site keeps routing entry points in `src/pages` and shared shells in `src/layouts` (for example `MainLayout.astro`). Reusable UI lives in `src/components`, while locale-aware copy and metadata sit in `src/content` and `src/data`. Shared utilities (`src/lib`, `src/consts.ts`) centralize configuration. Global styles are under `src/styles`, static assets belong in `public/`, and generated output emits to `dist/`. Avoid editing files in `dist/` or `node_modules/`; regenerate them through the documented scripts instead.

## Build, Test, and Development Commands
Install dependencies with `pnpm install` (the repo ships a `pnpm-lock.yaml`; match tooling locally). Key scripts: `pnpm dev` starts the Astro dev server with hot reload; `pnpm build` produces the static site in `dist/`; `pnpm preview` serves that build for smoke-testing. Run `pnpm check` for type safety and Markdown validation, `pnpm run build-search-index` to refresh search data after content changes, `pnpm run prettier:check` to enforce formatting, and `pnpm run lint:scss` to validate component styles.

## Coding Style & Naming Conventions
Source follows the Prettier config in `prettier.config.cjs`: single quotes, no semicolons, and trailing commas disabled. Let Prettier format `.astro`, `.ts`, and `.md` files (`pnpm run format`). Components and layouts use PascalCase filenames (e.g., `MainLayout.astro`), utility modules and constants use lower-case or camelCase (`consts.ts`, `languages.ts`), and shared styles remain in lowercase hyphenated files. Keep Tailwind utility classes ordered from outer layout to inner detail for readability, and colocate component-specific styles alongside the component.

## Testing Guidelines
There is no dedicated unit-test harness yet, so rely on Astro's built-in checks. Before opening a pull request, run `pnpm check` and `pnpm build`; both must pass without warnings. When you add scripts or complex interactions, include lightweight regression steps in the PR description and extend the search-index script if new content types need to be indexed.

## Commit & Pull Request Guidelines
Follow the Conventional Commits pattern used in history (`feat:`, `fix:`, `chore:`, `ci:`). Group related changes into a single commit and keep subjects under 72 characters. Pull requests should describe the change at a user-facing level, link to tracking issues, and list manual verification (commands run, screenshots for UI deltas, or relevant URLs). Ensure all formatting and lint checks run locally before requesting review.

## Security & Configuration Tips
Secrets belong in untracked `.env` files referenced through Astro's runtime configuration; never commit keys or service endpoints. Review `astro.config.mjs`, `tailwind.config.mjs`, and `config.yml` before modifying global settings, and note that sitemap data is generated from `sitemap.csv`. If you update hosting or analytics, document the change in `GEMINI.md` to keep automation agents aligned.
