// Game UI: icons, decorative stars, reward badges, level-complete scenes.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, r, svg, sparkle, roundedStar, writeSvgs } from './svg-kit.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const EMPTY = { fill: '#F4EEF9', line: '#D8CDE6' }; // unearned star / slot

// ============================ ICONS (96 x 96) ================================
// Each glyph is defined once and drawn twice: a fat tone-coloured pass (outline)
// then a thinner white pass on top, giving a soft outlined sticker look.
const glyphs = {
  play: { tone: C.mint, body: `<path d="M41 33 L65 48 L41 63 Z"/>` },
  pause: {
    tone: C.lavender,
    body: `<rect x="35" y="34" width="6" height="28" rx="2"/><rect x="55" y="34" width="6" height="28" rx="2"/>`,
  },
  restart: {
    tone: C.peach,
    body: `<path d="M56.5 33.3 A17 17 0 1 1 33.3 39.5" fill="none"/><path d="M37.3 32.6 L37.5 44.2 L27.1 38.2 Z"/>`,
  },
  settings: {
    tone: C.sky,
    body:
      `<circle cx="48" cy="48" r="13" fill="none"/>` +
      Array.from({ length: 8 }, (_, i) => `<rect x="45" y="25" width="6" height="8" rx="2" transform="rotate(${i * 45} 48 48)"/>`).join(''),
  },
  home: {
    tone: C.pink,
    body: `<path d="M27 50 L48 31 L69 50 Z"/><rect x="34" y="49" width="28" height="17" rx="3"/>`,
  },
  hint: {
    tone: C.butter,
    body: `<path d="M48 28 C38 28 32 36 34 45 C35 51 41 54 41 60 H55 C55 54 61 51 62 45 C64 36 58 28 48 28 Z"/><rect x="42" y="65" width="12" height="3" rx="1.5"/>`,
  },
  sound: {
    tone: C.sky,
    body: `<path d="M29 42 H37 L49 32 V64 L37 54 H29 Z"/><path d="M58 41 Q65 48 58 55" fill="none"/><path d="M63 34 Q77 48 63 62" fill="none"/>`,
  },
  heart: {
    tone: C.pink,
    body: `<path d="M48 67 C25 52 30 31 42 33 C46 34 48 38 48 38 C48 38 50 34 54 33 C66 31 71 52 48 67 Z"/>`,
  },
  lock: {
    tone: C.lavender,
    body: `<rect x="32" y="46" width="32" height="22" rx="6"/><path d="M38 46 V40 A10 10 0 0 1 58 40 V46" fill="none"/>`,
  },
};

const icons = {};
for (const [name, { tone, body }] of Object.entries(glyphs)) {
  const id = `glyph-${name}`;
  icons[`icon-${name}`] = svg(
    `${name} icon`,
    `
  <circle cx="48" cy="52" r="40" fill="${tone.line}" opacity=".3"/>
  <circle cx="48" cy="48" r="40" fill="${tone.fill}" stroke="${tone.line}" stroke-width="3"/>
  <path d="M22 38 Q28 22 48 17" fill="none" stroke="${C.white}" stroke-width="5" stroke-linecap="round" opacity=".6"/>
  <defs><g id="${id}">${body}</g></defs>
  <use href="#${id}" fill="${tone.line}" stroke="${tone.line}" stroke-width="13" stroke-linejoin="round" stroke-linecap="round"/>
  <use href="#${id}" fill="${C.white}" stroke="${C.white}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>`,
    { viewBox: '0 0 96 96', size: 96 }
  );
}

// ========================= DECORATIVE STARS (256) ============================
const chubbyStar = (label, tone, extra = '') =>
  svg(
    label,
    `${roundedStar(128, 136, 104, tone, { inner: 0.52, puff: 26, outline: 3 })}
  <path d="M92 92 Q110 66 138 64" fill="none" stroke="${C.white}" stroke-width="7" stroke-linecap="round" opacity=".65"/>${extra}`
  );
const starFace = `
  <circle cx="108" cy="140" r="8" fill="${C.ink}"/><circle cx="148" cy="140" r="8" fill="${C.ink}"/>
  <circle cx="110.8" cy="137" r="2.9" fill="${C.white}"/><circle cx="150.8" cy="137" r="2.9" fill="${C.white}"/>
  <ellipse cx="92" cy="158" rx="10" ry="6" fill="${C.pink.blush}" opacity=".55"/><ellipse cx="164" cy="158" rx="10" ry="6" fill="${C.pink.blush}" opacity=".55"/>
  <path d="M120 156 Q128 166 136 156" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>`;

const stars = {
  'star-gold': chubbyStar('Gold star', C.butter),
  'star-pink': chubbyStar('Pink star', C.pink),
  'star-lavender': chubbyStar('Lavender star', C.lavender),
  'star-happy': chubbyStar('Happy gold star', C.butter, starFace),
  'star-empty': svg('Empty star slot', roundedStar(128, 136, 104, EMPTY, { inner: 0.52, puff: 26, outline: 3 })),
  sparkles: svg(
    'Sparkle cluster',
    [
      sparkle(128, 128, 5.5, C.butter),
      sparkle(54, 62, 3, C.pink),
      sparkle(206, 74, 3.6, C.lavender),
      sparkle(196, 198, 2.6, C.mint),
      sparkle(62, 190, 3.2, C.sky),
    ].join('\n  ')
  ),
};

// ============================== BADGES (256) =================================
const emblems = {
  star: (t) => roundedStar(128, 114, 46, { fill: C.white, line: t.line }, { inner: 0.52, puff: 12, outline: 2.5 }),
  bolt: (t) =>
    `<path d="M140 70 L102 120 H125 L113 158 L156 104 H132 Z" fill="${C.white}" stroke="${t.line}" stroke-width="6" stroke-linejoin="round"/>`,
  heart: (t) =>
    `<path d="M128 156 C80 124 92 76 120 88 C126 91 128 96 128 96 C128 96 130 91 136 88 C164 76 176 124 128 156 Z" fill="${C.white}" stroke="${t.line}" stroke-width="6" stroke-linejoin="round"/>`,
  gem: (t) =>
    `<path d="M104 84 H152 L172 110 L128 158 L84 110 Z" fill="${C.white}" stroke="${t.line}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M84 110 H172 M104 84 L116 110 L128 158 L140 110 L152 84" fill="none" stroke="${t.line}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" opacity=".55"/>`,
};

const badge = (label, tone, ribbon, emblem) =>
  svg(
    label,
    `
  <g stroke="${ribbon.line}" stroke-width="3" stroke-linejoin="round" fill="${ribbon.fill}">
    <path d="M86 156 L58 240 L90 226 L110 250 L132 166 Z"/>
    <path d="M170 156 L198 240 L166 226 L146 250 L124 166 Z"/>
  </g>
  <circle cx="128" cy="116" r="88" fill="${tone.deep}" stroke="${tone.line}" stroke-width="3"/>
  <circle cx="128" cy="116" r="70" fill="${tone.fill}" stroke="${tone.line}" stroke-width="3"/>
  <path d="M74 98 Q82 66 118 56" fill="none" stroke="${C.white}" stroke-width="7" stroke-linecap="round" opacity=".7"/>
  ${emblem(tone)}
  ${sparkle(206, 50, 1, { fill: C.white, line: tone.line })}`
  );

const badges = {
  'badge-bronze': badge('Bronze badge', C.peach, C.pink, emblems.star),
  'badge-silver': badge('Silver badge', C.sky, C.lavender, emblems.star),
  'badge-gold': badge('Gold badge', C.butter, C.pink, emblems.star),
  'badge-speedy': badge('Speedy badge', C.sky, C.mint, emblems.bolt),
  'badge-perfect': badge('Perfect badge', C.pink, C.lavender, emblems.heart),
  'badge-collector': badge('Collector badge', C.mint, C.butter, emblems.gem),
};

// ====================== LEVEL COMPLETE SCENES (512 x 400) ====================
// Reuses the finished axolotl characters so the scene always matches them.
const inner = (file) =>
  readFileSync(join(HERE, '..', 'src', 'assets', 'svg', 'characters', file), 'utf8').match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1].trim();

const bubbleBit = (x, y, rr) =>
  `<circle cx="${x}" cy="${y}" r="${rr}" fill="${C.sky.fill}" fill-opacity=".45" stroke="${C.sky.line}" stroke-width="2.5"/><path d="M${r(x - rr * 0.5)} ${r(y - rr * 0.1)} A${r(rr * 0.55)} ${r(rr * 0.55)} 0 0 1 ${r(x - rr * 0.1)} ${r(y - rr * 0.5)}" fill="none" stroke="${C.white}" stroke-width="3" stroke-linecap="round"/>`;

const levelComplete = (n, character) => {
  const slots = [
    { x: 150, y: 168, R: 44, rot: -12 },
    { x: 256, y: 150, R: 56, rot: 0 },
    { x: 362, y: 168, R: 44, rot: 12 },
  ];
  const starsMarkup = slots
    .map((s, i) => {
      const tone = i < n ? C.butter : EMPTY;
      const shine =
        i < n
          ? `<path d="M${s.x - s.R * 0.45} ${s.y - s.R * 0.35} Q${s.x - s.R * 0.25} ${s.y - s.R * 0.65} ${s.x + s.R * 0.05} ${s.y - s.R * 0.7}" fill="none" stroke="${C.white}" stroke-width="5" stroke-linecap="round" opacity=".65"/>`
          : '';
      return `<g transform="rotate(${s.rot} ${s.x} ${s.y})">${roundedStar(s.x, s.y, s.R, tone, { inner: 0.52, puff: s.R * 0.25, outline: 3 })}${shine}</g>`;
    })
    .join('\n  ');
  const confetti =
    n > 0
      ? [
          sparkle(60, 130, 1.6, C.pink),
          sparkle(452, 124, 1.8, C.lavender),
          sparkle(96, 220, 1.1, C.butter),
          sparkle(420, 226, 1.3, C.mint),
          sparkle(40, 270, 0.9, C.sky),
          sparkle(474, 276, 1, C.peach),
        ].join('\n  ')
      : '';
  return svg(
    `Level complete, ${n} ${n === 1 ? 'star' : 'stars'}`,
    `
  ${bubbleBit(40, 330, 14)}${bubbleBit(470, 320, 18)}${bubbleBit(452, 366, 9)}${bubbleBit(66, 366, 8)}
  <path d="M70 34 H442 L418 62 L442 90 H70 L94 62 Z" fill="${C.pink.fill}" stroke="${C.pink.line}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M96 48 H300" fill="none" stroke="${C.white}" stroke-width="6" stroke-linecap="round" opacity=".6"/>
  ${starsMarkup}
  ${confetti}
  <g transform="translate(141 172) scale(0.9)">
  ${inner(character)}
  </g>`,
    { viewBox: '0 0 512 400', width: 512, height: 400 }
  );
};

const levelScenes = {
  'level-complete-3stars': levelComplete(3, 'axolotl-excited.svg'),
  'level-complete-2stars': levelComplete(2, 'axolotl-happy.svg'),
  'level-complete-1star': levelComplete(1, 'axolotl-mascot.svg'),
};

writeSvgs('ui', { ...icons, ...stars, ...badges, ...levelScenes });
