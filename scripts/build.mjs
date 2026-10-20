import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'src');
const output = join(root, 'dist');

async function expandIncludes(html) {
  const includePattern = /@@include\(['"]html\/([\w-]+\.html)['"],\s*\{[^)]*\}\)/g;
  const parts = await Promise.all([...html.matchAll(includePattern)].map(async ([, name]) => {
    return readFile(join(source, 'html', name), 'utf8');
  }));
  let index = 0;
  return html.replace(includePattern, () => parts[index++]).replaceAll('@img/', 'images/').replaceAll('@@title', 'Legalide');
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all([
  cp(join(source, 'images'), join(output, 'images'), { recursive: true }),
  cp(join(source, 'css'), join(output, 'css'), { recursive: true }),
  cp(join(source, 'js'), join(output, 'js'), { recursive: true }),
]);
const html = await readFile(join(source, 'index.html'), 'utf8');
await writeFile(join(output, 'index.html'), await expandIncludes(html));
console.log('Built dist/index.html, css/, js/ and images/');
