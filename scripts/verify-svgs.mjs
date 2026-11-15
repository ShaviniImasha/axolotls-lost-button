// Checks every SVG: well-formed XML, no external dependencies, no bad numbers,
// and a fully transparent background (all four corners have alpha 0).
//   node scripts/verify-svgs.mjs
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'svg');

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.svg') ? [p] : [];
  });

const files = walk(ROOT);
let failures = 0;
const fail = (f, msg) => {
  failures++;
  console.error(`FAIL ${f.replace(ROOT, '')}: ${msg}`);
};

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  try {
    execFileSync('xmllint', ['--noout', f], { stdio: 'pipe' });
  } catch (e) {
    fail(f, 'not well-formed XML ' + (e.stderr?.toString().split('\n')[0] ?? ''));
  }
  if (/<image\b|<script\b|<foreignObject\b/.test(text)) fail(f, 'contains image/script/foreignObject');
  if (/href="(?!#)/.test(text) || /url\(\s*['"]?https?:/.test(text)) fail(f, 'external reference');
  if (/undefined|NaN|\[object/.test(text)) fail(f, 'bad generated value');
  if (!/viewBox="/.test(text)) fail(f, 'missing viewBox (not scalable)');

  // Rasterise and check transparency at the corners.
  const [, w, h] = text.match(/viewBox="0 0 (\d+) (\d+)"/) ?? [];
  const png = execFileSync('rsvg-convert', ['-w', '64', f], { stdio: ['ignore', 'pipe', 'pipe'] });
  const probe = execFileSync(
    'convert',
    ['png:-', '-format', '%[fx:p{0,0}.a]%[fx:p{w-1,0}.a]%[fx:p{0,h-1}.a]%[fx:p{w-1,h-1}.a]', 'info:'],
    { input: png }
  ).toString();
  if (probe !== '0000') fail(f, `corners not transparent (alpha ${probe})`);
}

const kb = files.reduce((s, f) => s + statSync(f).size, 0) / 1024;
console.log(`${files.length} SVGs checked, ${failures} failure(s), ${kb.toFixed(1)} KB total`);
process.exit(failures ? 1 : 0);
