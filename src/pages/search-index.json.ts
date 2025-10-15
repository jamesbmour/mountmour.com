// File: src/pages/search-index.json.ts
export const prerender = true;

import matter from 'gray-matter';
import lunr from 'lunr';

// Utility: derive the final route URL from a source file path
function filePathToRoute(filePath: string): string {
  // Handle both /src/pages and /src/content/docs paths
  let rel = filePath
    .replace(/^\/?src\/(pages|content\/docs)\//, '/')
    .replace(/\.(md|mdx|astro)$/, '');

  // Remove language prefix from content/docs paths (e.g., /en/home -> /home)
  rel = rel.replace(/^\/(en|de|es|fr)\//, '/');

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
  // Index both src/pages and src/content/docs
  const pagesFiles = import.meta.glob(['/src/pages/**/*.{md,mdx,astro}'], {
    eager: true,
    as: 'raw',
  }) as Record<string, string>;

  const docsFiles = import.meta.glob(['/src/content/docs/**/*.{md,mdx}'], {
    eager: true,
    as: 'raw',
  }) as Record<string, string>;

  // Combine both file sources
  const allFiles = { ...pagesFiles, ...docsFiles };

  type SearchDoc = {
    id: string;
    title: string;
    url: string;
    description: string;
    content: string;
  };

  const docs: SearchDoc[] = [];

  for (const [path, raw] of Object.entries(allFiles)) {
    try {
      // Parse frontmatter if present
      const { content, data } = matter(raw);
      const { title, headings } = extractTitleAndHeadings(content, (data as any)?.title);
      const plain = toPlainText(content);

      // Keep index small: truncate body text
      const MAX_LEN = 1200;
      const contentExcerpt = plain.slice(0, MAX_LEN);
      
      // Extract description
      const description = (data as any)?.description || plain.slice(0, 200);

      const url = filePathToRoute(path.replace(/^\//, ''));

      // Skip non-user-facing pages
      if (url.includes('404') || url.includes('search-index')) continue;

      // Create unique ID
      const id = path.replace(/^\/src\//, '').replace(/\.(md|mdx|astro)$/, '');

      docs.push({
        id,
        title,
        url,
        description,
        content: contentExcerpt,
      });
    } catch (error) {
      console.error(`Error processing ${path}:`, error);
      continue;
    }
  }

  // Build Lunr index
  const idx = lunr(function () {
    this.field('title', { boost: 10 });
    this.field('description', { boost: 5 });
    this.field('content');
    this.ref('id');

    docs.forEach((doc) => {
      this.add(doc);
    });
  });

  // Return both the index and documents
  const result = {
    index: idx.toJSON(),
    documents: docs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      url: doc.url,
    })),
  };

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
    status: 200,
  });
}