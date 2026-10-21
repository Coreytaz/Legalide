import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const html = await readFile(join(dist, 'index.html'), 'utf8');
const css = await readFile(join(dist, 'css/style.css'), 'utf8');

const matches = (pattern, content = html) => [...content.matchAll(pattern)];
test('static build resolves source includes and references', () => {
  assert.doesNotMatch(html, /@@(?:include|title)|@img\//);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /<title>Legalide — Legal Guidance<\/title>/);
});
test('one h1, named section headings, and keyboard skip link', () => {
  assert.equal(matches(/<h1\b/g).length, 1);
  assert.match(html, /class="skip-link" href="#main-content"/);
  assert.match(html, /aria-controls="primary-navigation"\s+aria-expanded="false"/);
  for (const id of ['home','practice-areas','advice','about','get-in-touch','consultation']) {
    assert.ok(html.includes(`id="${id}"`), `Missing section: ${id}`);
  }
});
test('all in-page anchors have matching destinations', () => {
  const ids = new Set(matches(/\bid="([^"]+)"/g).map(m => m[1]));
  for (const [,fragment] of matches(/href="#([^"]+)"/g)) {
    assert.ok(ids.has(fragment), `Broken fragment: ${fragment}`);
  }
  assert.equal(matches(/href="#"/g).length,0);
});
test('local styles, modules and images exist', async () => {
  const urls = [...matches(/\b(?:src|href)="((?:css|js|images)\/[^"?#]+)"/g).map(m => m[1])];
  for (const url of urls) await access(join(dist,url));
  await access(join(dist,'js/modules/burger.js'));
  await access(join(dist,'images/hero__bg.webp'));
});
test('images have dimensions and accessible alt text', () => {
  for (const [element] of matches(/<img\b[^>]+>/g)) {
    assert.match(element,/\balt="[^"]*"/);
    assert.match(element,/\bwidth="\d+"/);
    assert.match(element,/\bheight="\d+"/);
  }
});
test('responsive CSS, accessible focus, reduced motion and image optimization', () => {
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /max-width: 768px/);
  assert.match(css, /max-width: 540px/);
  assert.match(css, /hero__bg\.webp/);
  assert.match(html, /hero__portrait\.webp/);
});
test('forms do not claim backend success', async () => {
  const app = await readFile(join(dist, 'js/app.js'),'utf8');
  assert.match(html, /type="email"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(app, /subscriptions are not available online/);
});
