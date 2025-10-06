import fs from 'fs';
import path from 'path';
import lunr from 'lunr';
import { glob } from 'glob';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contentDir = path.join(process.cwd(), 'src/content/docs');
const outputPath = path.join(process.cwd(), 'public', 'search-index.json');

// Find all MDX files in the content directory
const files = glob.sync(`${contentDir}/**/*.{md,mdx}`);

const documents = files.map((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const { data, content: body } = matter(content);
  
  // Create URL from file path
  // e.g., src/content/docs/en/home.mdx -> /en/home
  const relativePath = path.relative(contentDir, file);
  const urlPath = '/' + relativePath.replace(/\.(md|mdx)$/, '');
  
  return {
    id: file,
    title: data.title || 'Untitled',
    description: data.description || '',
    content: body,
    url: urlPath,
    lang: data.lang || 'en-us',
  };
});

// Build the search index
const idx = lunr(function () {
  this.field('title', { boost: 10 });
  this.field('description', { boost: 5 });
  this.field('content');
  this.ref('id');

  documents.forEach((doc) => {
    this.add(doc);
  });
});

// Save index and documents
fs.writeFileSync(
  outputPath,
  JSON.stringify({
    index: idx.toJSON(),
    documents: documents.map(doc => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      url: doc.url,
      lang: doc.lang,
    }))
  })
);

console.log(`Search index built successfully with ${documents.length} documents.`);
