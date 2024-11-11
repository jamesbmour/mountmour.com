import fs from 'fs';
import path from 'path';
import lunr from 'lunr';
import * as glob from 'glob'; // Changed to import all exports
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contentDir = path.join(process.cwd(), 'src/');
const outputPath = path.join(process.cwd(), 'public', 'search-index.json');

// Use glob.sync through the glob namespace
const files = glob.sync(`${contentDir}/src`);

const documents = files.map((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const { data, content: body } = matter(content);
  return {
    id: file,
    title: data.title,
    content: body,
    url: file.replace(contentDir, '').replace(/\.mdx?$/, ''),
  };
});

const idx = lunr(function () {
  this.field('title');
  this.field('content');
  this.ref('id');

  documents.forEach((doc) => {
    this.add(doc);
  });
});

fs.writeFileSync(outputPath, JSON.stringify({ index: idx.toJSON(), documents }));
console.log('Search index built successfully.');