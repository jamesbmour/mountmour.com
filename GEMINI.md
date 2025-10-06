# Project Overview

This project is a documentation website for an Airbnb property, built with the Astro framework. It uses a combination of MDX, Preact, React, and Svelte for component-based architecture, and is styled with Tailwind CSS. The site is designed to be a comprehensive guide for guests, with information about the property and the local area.

## Key Technologies

*   **Framework:** [Astro](https://astro.build/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** Preact, React, Svelte
*   **Content:** MDX and Markdoc
*   **Deployment:** The project includes configuration files for deploying to Azure Static Web Apps.

## Project Structure

*   `src/content/docs/`: Contains the Markdown/MDX files for the documentation pages.
*   `src/components/`: Contains the reusable UI components (Astro, Preact, React, Svelte).
*   `src/layouts/`: Contains the main layout for the website.
*   `astro.config.mjs`: The main configuration file for the Astro project.
*   `tailwind.config.mjs`: The configuration file for Tailwind CSS.
*   `package.json`: Defines the project's dependencies and scripts.

# Building and Running

## Development

To start the local development server, run the following command:

```bash
npm run dev
```

## Build

To build the project for production, run the following command:

```bash
npm run build
```

## Linting and Formatting

The project uses Prettier for code formatting and Stylelint for SCSS linting.

*   **Check formatting:** `npm run prettier:check`
*   **Format code:** `npm run format`
*   **Lint SCSS:** `npm run lint:scss`

# Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling. Custom styles are defined in the `src/styles` directory.
*   **Components:** The project uses a mix of Astro, Preact, React, and Svelte components. New components should be created in the `src/components` directory.
*   **Content:** The documentation pages are written in MDX and are located in the `src/content/docs` directory.
