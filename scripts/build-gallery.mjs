// Builds src/assets/preview.html: a self-contained gallery of every SVG on a watery background.
// Open it directly in a browser (no server needed).
import { readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets');
const groups = readdirSync(join(ASSETS, 'svg'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();

const sections = groups
  .map((g) => {
    const cards = readdirSync(join(ASSETS, 'svg', g))
      .filter((f) => f.endsWith('.svg'))
      .sort()
      .map((f) => `<figure><img src="svg/${g}/${f}" alt="${f.slice(0, -4)}"><figcaption>${f.slice(0, -4)}</figcaption></figure>`)
      .join('\n      ');
    return `<h2>${g}</h2>\n    <div class="grid">\n      ${cards}\n    </div>`;
  })
  .join('\n    ');

writeFileSync(
  join(ASSETS, 'preview.html'),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Axolotl asset preview</title>
<style>
  body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; color: #4A3347;
         background: linear-gradient(#D9F2FF, #BDE6FF 60%, #A8DCF5); min-height: 100vh; }
  h1 { margin-top: 0 } h2 { margin: 32px 0 12px; text-transform: capitalize }
  .grid { display: flex; flex-wrap: wrap; gap: 16px }
  figure { margin: 0; padding: 12px; background: #ffffff66; border-radius: 20px; text-align: center }
  img { display: block; height: 140px; width: auto; max-width: 260px }
  figcaption { margin-top: 6px; font-size: 12px }
</style>
</head>
<body>
  <h1>Axolotl asset preview</h1>
  ${sections}
</body>
</html>
`
);
console.log('preview.html written');
