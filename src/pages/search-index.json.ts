// File: src/pages/search-index.json.ts
export const prerender = true;

import matter from 'gray-matter';

// Utility: derive the final route URL from a source file path in /src/pages
function filePathToRoute(filePath: string): string {
  // Examples:
  // /src/pages/index.md -> /
  // /src/pages/blog/index.mdx -> /blog/
  // /src/pages/docs/getting-started.astro -> /docs/getting-started/
  let rel = filePath
    .replace(/^\/?src\/pages\//, '/')
    .replace(/\.(md|mdx|astro)$/, '');

  if (rel.endsWith('/index')) {
    rel = rel.slice(0, -('/index'.length)) || '/';
  } else if (!rel.endsWith('/')) {
    rel += '/';
  }
  return rel;
}

// Utility: Strip markdown and HTML to get plain text for full-text search
function toPlainText(input: string): string {
  // Remove code fences
  let out = input.replace(/```[\s\S]*?```/g, ' ');
  // Remove HTML tags
  out = out.replace(/<[^>]+>/g, ' ');
  // Remove frontmatter separators (if any remain)
  out = out.replace(/^---[\s\S]*?---/m, ' ');
  // Convert markdown links/images to text
  out = out.replace(/!\[[^\]]*\]\([^)]+\)/g, ' '); // images
  out = out.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // links
  // Remove emphasis/strong/code marks
  out = out.replace(/[*_`~]/g, ' ');
  // Collapse whitespace
  out = out.replace(/\s+/g, ' ').trim();
  return out;
}

// Extract title and headings from markdown-like content
function extractTitleAndHeadings(content: string, fmTitle?: string): { title: string; headings: string[] } {
  const headings: string[] = [];
  const headingRegex = /^#{1,6}\s+(.*)$/gm;
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push(match[1].trim());
  }

  // Prefer frontmatter title; else first H1; else fallback
  let title = fmTitle || headings.find((h) => h) || '';
  if (!title) {
    // Try to find a <title> if indexing .astro raw source that contains HTML
    const titleTag = content.match(/<title>(.*?)<\/title>/i);
    if (titleTag?.[1]) title = titleTag[1].trim();
  }
  if (!title) title = 'Untitled';

  return { title, headings };
}

export async function GET() {
  // Index only src/pages content (Markdown/MDX/Astro). Adjust globs if needed.
  const files = import.meta.glob(['/src/pages/**/*.{md,mdx,astro}'], {
    eager: true,
    as: 'raw',
  }) as Record<string, string>;

  type SearchDoc = {
    title: string;
    url: string;
    headings: string[];
    content: string; // Plain text, truncated for size
  };

  const docs: SearchDoc[] = [];

  for (const [path, raw] of Object.entries(files)) {
    try {
      // Parse frontmatter if present (md/mdx will have it; astro may or may not)
      const { content, data } = matter(raw);
      const { title, headings } = extractTitleAndHeadings(content, (data as any)?.title);
      const plain = toPlainText(content);

      // Keep index small: truncate body text but still useful for matching/snippets
      const MAX_LEN = 1200;
      const contentExcerpt = plain.slice(0, MAX_LEN);

      const url = filePathToRoute(path.replace(/^\//, ''));

      // Skip pages that are clearly non-user-facing (optional)
      if (url.includes('404')) continue;

      docs.push({
        title,
        url,
        headings,
        content: contentExcerpt,
      });
    } catch {
      // Skip problematic files rather than failing the build
      continue;
    }
  }

  return new Response(JSON.stringify(docs), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
    status: 200,
  });
}