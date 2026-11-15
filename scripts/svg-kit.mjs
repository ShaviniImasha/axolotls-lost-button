// Shared palette + helpers for the SVG generators.
// Every asset takes its colours from here, so the whole set stays consistent.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Pastel palette. Each tone: fill (main), deep (shade), line (soft outline). */
export const C = {
  ink: '#4A3347', // eyes, mouths, facial details
  white: '#FFFFFF',
  mouth: '#E0587F',
  tongue: '#FF9DB5',
  pink: { fill: '#FFC1D6', deep: '#FF9DBE', line: '#D9769A', belly: '#FFE3EC', blush: '#FF8FA9' },
  mint: { fill: '#B8F0DC', deep: '#8EDDC0', line: '#5DBBA0' },
  lavender: { fill: '#D7C6FF', deep: '#BBA5F5', line: '#9B85D9' },
  peach: { fill: '#FFD9B8', deep: '#FFBF94', line: '#E39A66' },
  butter: { fill: '#FFF0A8', deep: '#FFE070', line: '#E0B84F' },
  sky: { fill: '#BDE6FF', deep: '#93D3F7', line: '#6DB3DE' },
};

/** Round to one decimal so generated markup stays short and tidy. */
export const r = (n) => Math.round(n * 10) / 10;

/** Wrap markup in an <svg>. No background, so every asset is transparent. */
export const svg = (label, body, { viewBox = '0 0 256 256', size = 256, width = size, height = size } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}" role="img" aria-label="${label}">\n${body.trim()}\n</svg>\n`;

/** Four-point sparkle. */
export const sparkle = (x, y, s, tone = C.butter) =>
  `<path d="M0 -10 Q2 -2 10 0 Q2 2 0 10 Q-2 2 -10 0 Q-2 -2 0 -10 Z" transform="translate(${x} ${y}) scale(${s})" fill="${tone.fill}" stroke="${tone.line}" stroke-width="${r(2.5 / s)}" stroke-linejoin="round"/>`;

/** Chubby five-point star with a soft outline (two stacked round-joined polygons). */
export const roundedStar = (cx, cy, R, tone, { inner = 0.5, puff = 8, outline = 3 } = {}) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = ((-90 + i * 36) * Math.PI) / 180;
    const rad = (i % 2 ? R * inner : R) - puff / 2;
    return `${r(cx + rad * Math.cos(a))},${r(cy + rad * Math.sin(a))}`;
  }).join(' ');
  return (
    `<polygon points="${pts}" fill="${tone.line}" stroke="${tone.line}" stroke-width="${puff + outline * 2}" stroke-linejoin="round"/>` +
    `<polygon points="${pts}" fill="${tone.fill}" stroke="${tone.fill}" stroke-width="${puff}" stroke-linejoin="round"/>`
  );
};

/** Attribute string for soft rounded outlines. */
export const line = (color, w = 3) =>
  `stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'svg');

/** Write { name: svgString } into src/assets/svg/<folder>/<name>.svg */
export function writeSvgs(folder, files) {
  const dir = join(ROOT, folder);
  mkdirSync(dir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(dir, `${name}.svg`), content);
  }
  console.log(`${folder}: wrote ${Object.keys(files).length} files`);
}
