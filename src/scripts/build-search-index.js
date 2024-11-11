import fs from 'fs';
import path from 'path';
import lunr from 'lunr';
import glob from 'glob';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'src/');
const outputPath = path.join(process.cwd(), 'public', 'search-index.json');

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