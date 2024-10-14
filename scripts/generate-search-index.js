// scripts/generate-search-index.js

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = './src/pages'; // Adjust the path to your content directory
const outputDir = './public';

function walk(dir) {
  let files = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      files.push(fullPath);
    }
  });
  return files;
}

const files = walk(contentDir);

const index = files.map((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const { data, content: body } = matter(content);

  return {
    title: data.title || '',
    url: data.url || fileToUrl(file),
    content: body,
  };
});

function fileToUrl(filePath) {
  const relativePath = path.relative('./src/pages', filePath);
  const url = '/' + relativePath.replace(/(index)?\.(md|mdx)$/, '').replace(/\\/g, '/');
  return url === '/' ? '/' : url;
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.writeFileSync(
  path.join(outputDir, 'search-index.json'),
  JSON.stringify(index)
);

console.log('Search index generated.');