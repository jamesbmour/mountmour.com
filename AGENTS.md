# Repository Guidelines

## Project Structure & Module Organization
This Astro documentation site keeps route entry points in `src/pages` and shared shells in `src/layouts` such as `MainLayout.astro`. Reusable UI sits in `src/components`, while locale copy and metadata are under `src/content` and `src/data`. Utilities in `src/lib` and `src/consts.ts` centralize configuration, global styles live in `src/styles`, and static assets belong in `public/`. Build artifacts land in `dist/`; regenerate them via scripts rather than editing by hand.

## Build, Test, and Development Commands
Install dependencies with `pnpm install` (the repo tracks `pnpm-lock.yaml`). Use `pnpm dev` for the Astro dev server with hot reload, `pnpm build` to generate the static site in `dist/`, and `pnpm preview` to review that output locally. Run `pnpm check` for type safety and Markdown validation, `pnpm run build-search-index` after content updates, `pnpm run prettier:check` to enforce formatting, and `pnpm run lint:scss` for stylelint coverage.

## Coding Style & Naming Conventions
Prettier (`prettier.config.cjs`) enforces single quotes, no semicolons, and no trailing commas; rely on `pnpm run format` before committing. Components and layouts use PascalCase filenames, utilities use lower-case or camelCase, and styles stay in lowercase hyphenated files. Keep Tailwind utility classes grouped from layout primitives to fine-grained tweaks and colocate component-specific styles with the component.

## Testing Guidelines
There is no standalone unit-test suite yet, so treat `pnpm check` and `pnpm build` as blocking quality gates. Document any manual regression steps in your pull request and extend `src/scripts/build-search-index.js` only when new content types require indexing. If you add interactive behaviour, outline how reviewers can reproduce it locally.

## Commit & Pull Request Guidelines
Follow the Conventional Commit style seen in history (`feat:`, `fix:`, `chore:`, `ci:`) and keep subjects under 72 characters. Pull requests should summarise the change, link tracking issues, and list validation steps (commands run, screenshots for UI updates, or relevant URLs). Ensure format and lint tasks pass locally before requesting review.

## Security & Configuration Tips
Secrets belong in untracked `.env` files surfaced through Astro runtime config; never commit keys or service endpoints. Review `astro.config.mjs`, `tailwind.config.mjs`, and `config.yml` before altering global settings, and note that sitemap data originates from `sitemap.csv`. Update `GEMINI.md` when configuration changes affect automation agents.
