import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONTENT_DIR = path.join(__dirname, '../src/content');
const PAGES_DIR = path.join(__dirname, '../src/pages');
const OUTPUT_FILE = path.join(__dirname, '../public/search-index.json');

// Function to strip HTML tags
function stripHtml(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Function to extract frontmatter and content
function extractContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    return { title: path.basename(filePath, path.extname(filePath)), content: stripHtml(content) };
  }

  const frontmatter = frontmatterMatch[1];
  const bodyContent = frontmatterMatch[2];
  
  // Extract title from frontmatter
  const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
  const title = titleMatch ? titleMatch[1] : path.basename(filePath, path.extname(filePath));
  
  return {
    title,
    content: stripHtml(bodyContent).slice(0, 500) // Limit content length
  };
}

// Generate search index
async function generateSearchIndex() {
  const searchIndex = [];

  try {
    // Find all .md, .mdx, and .astro files
    const mdFiles = await glob('**/*.{md,mdx}', { cwd: CONTENT_DIR, absolute: true });
    const astroFiles = await glob('**/*.astro', { cwd: PAGES_DIR, absolute: true });
    
    const allFiles = [...mdFiles, ...astroFiles];

    for (const filePath of allFiles) {
      try {
        const { title, content } = extractContent(filePath);
        
        // Generate URL from file path
        let url = filePath
          .replace(CONTENT_DIR, '')
          .replace(PAGES_DIR, '')
          .replace(/\\/g, '/')
          .replace(/\.(md|mdx|astro)$/, '')
          .replace(/\/index$/, '');
        
        if (!url.startsWith('/')) {
          url = '/' + url;
        }
        
        if (url === '') {
          url = '/';
        }

        searchIndex.push({
          title,
          url,
          content
        });
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error.message);
      }
    }

    // Write search index to public directory
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex, null, 2));
    console.log(`✓ Generated search index with ${searchIndex.length} entries at ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error generating search index:', error);
    process.exit(1);
  }
}

generateSearchIndex();
