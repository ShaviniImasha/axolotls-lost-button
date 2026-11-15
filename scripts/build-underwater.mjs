// Underwater collection: 4 unique cute fish characters, magical lost button, coral, seaweed, shells, bubbles, jellyfish, starfish.
// Designed in authentic Japanese kawaii style with soft pastel colours, cute rounded shapes, and sparkling eyes.
import { C, r, svg, sparkle, roundedStar, line, writeSvgs } from './svg-kit.mjs';

/** Soft-outlined tube helper for corals/seaweed */
const tube = (d, tone, w = 18, outline = 3) =>
  `<path d="${d}" fill="none" stroke="${tone.line}" stroke-width="${w + outline * 2}" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="${tone.fill}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

/** Large anime sparkling kawaii eye */
const eye = (x, y, rr = 10) =>
  `<circle cx="${x}" cy="${y}" r="${rr}" fill="${C.ink}"/>
  <path d="M${r(x - rr * 0.65)} ${r(y + rr * 0.2)} Q${x} ${r(y + rr * 0.75)} ${r(x + rr * 0.65)} ${r(y + rr * 0.2)}" fill="none" stroke="#C48DAE" stroke-width="2" stroke-linecap="round"/>
  <circle cx="${r(x + rr * 0.35)}" cy="${r(y - rr * 0.35)}" r="${r(rr * 0.38)}" fill="${C.white}"/>
  <circle cx="${r(x - rr * 0.35)}" cy="${r(y + rr * 0.35)}" r="${r(rr * 0.2)}" fill="${C.white}"/>
  <circle cx="${r(x + rr * 0.5)}" cy="${r(y + rr * 0.12)}" r="${r(rr * 0.12)}" fill="${C.white}"/>`;

/** Kawaii blush with '//' white highlights */
const blush = (x, y, rx = 10, ry = 6) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.pink.blush}" opacity=".65"/>
  <path d="M${x - 4} ${y - 2} L${x - 6} ${y + 2} M${x + 2} ${y - 2} L${x} ${y + 2}" stroke="${C.white}" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>`;

const smile = (x, y, w = 7) =>
  `<path d="M${x - w} ${y} Q${x} ${y + w} ${x + w} ${y}" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;

const files = {};

// =============================================================================
// CATEGORY 2: FOUR UNIQUE CUTE UNDERWATER FISH CHARACTERS
// =============================================================================

// 1. Peach Round Chubby Guppy / Pufferfish
files['fish-peach'] = svg(
  'Peach chubby fish character',
  `
  <g ${line(C.peach.line)}>
    <!-- Wavy translucent caudal fin with heart lobes -->
    <path d="M68 128 C32 94 18 86 16 104 C14 122 32 128 32 128 C32 128 14 134 16 152 C18 170 32 162 68 128 Z" fill="${C.pink.fill}" stroke="${C.pink.line}" stroke-width="3"/>
    <path d="M38 116 C26 122 26 134 38 140" fill="none" stroke="${C.white}" stroke-width="3" stroke-linecap="round" opacity=".7"/>

    <!-- Fluttery dorsal & ventral fins -->
    <path d="M120 78 C132 50 156 46 168 64 C156 68 146 76 140 88 Z" fill="${C.pink.fill}" stroke="${C.pink.line}" stroke-width="3"/>
    <path d="M120 178 C132 206 156 210 168 192 C156 188 146 180 140 168 Z" fill="${C.pink.fill}" stroke="${C.pink.line}" stroke-width="3"/>

    <!-- Plump rounded body -->
    <ellipse cx="136" cy="128" rx="84" ry="60" fill="${C.peach.fill}"/>
    <!-- Soft baby-pink belly patch -->
    <ellipse cx="136" cy="148" rx="60" ry="32" fill="#FFEAE0" stroke="none"/>

    <!-- Gentle pastel scales/decorations -->
    <path d="M104 84 Q92 128 104 172 M128 78 Q116 128 128 178" fill="none" stroke="${C.pink.fill}" stroke-width="10" opacity=".6" stroke-linecap="round"/>

    <!-- Cute fluttering pectoral fin -->
    <ellipse cx="140" cy="142" rx="16" ry="10" transform="rotate(-15 140 142)" fill="${C.pink.fill}" stroke="${C.pink.line}" stroke-width="2.5"/>
  </g>

  <!-- Sweet back highlight curve -->
  <path d="M116 80 Q144 68 180 76" fill="none" stroke="${C.white}" stroke-width="5" stroke-linecap="round" opacity=".65"/>
  <circle cx="188" cy="80" r="3" fill="${C.white}" opacity=".65"/>

  <!-- Face: Large anime catchlight eye, blush with shine, sweet smile -->
  ${eye(178, 116, 11)}
  ${blush(182, 140, 12, 7)}
  ${smile(202, 134, 7)}

  <!-- Floating pastel bubbles -->
  ${sparkle(214, 66, 0.75, C.butter)}
  <circle cx="218" cy="110" r="4.5" fill="${C.sky.fill}" stroke="${C.sky.line}" stroke-width="1.5" opacity=".7"/>
  `
);

// 2. Lavender Ethereal Angelfish / Butterflyfish
files['fish-lavender'] = svg(
  'Lavender angelfish character',
  `
  <g ${line(C.lavender.line)}>
    <!-- Tall elegant dorsal fin -->
    <path d="M110 90 C125 30 150 18 162 42 C152 58 142 78 135 98 Z" fill="${C.sky.fill}" stroke="${C.sky.line}" stroke-width="3"/>
    <path d="M135 48 C145 60 148 76 142 90" fill="none" stroke="${C.white}" stroke-width="3" stroke-linecap="round" opacity=".6"/>

    <!-- Long flowing ribbon ventral fin -->
    <path d="M125 160 C135 210 148 244 142 248 C136 244 130 200 120 165 Z" fill="${C.sky.fill}" stroke="${C.sky.line}" stroke-width="2.5"/>

    <!-- Forked delicate tail -->
    <path d="M72 128 C40 85 24 72 20 88 C20 110 38 122 40 128 C38 134 20 146 20 168 C24 184 40 171 72 128 Z" fill="${C.sky.fill}" stroke="${C.sky.line}" stroke-width="3"/>

    <!-- Diamond-rounded angelfish body -->
    <path d="M70 128 C92 78 126 70 165 95 C198 116 210 128 214 132 C210 136 198 148 165 169 C126 194 92 186 70 128 Z" fill="${C.lavender.fill}"/>

    <!-- Soft sky-blue pastel stripes -->
    <path d="M118 78 C112 110 112 150 118 182" fill="none" stroke="${C.sky.fill}" stroke-width="14" stroke-linecap="round" opacity=".6"/>
    <path d="M148 88 C142 114 142 146 148 172" fill="none" stroke="${C.sky.fill}" stroke-width="10" stroke-linecap="round" opacity=".5"/>

    <!-- Small side fin -->
    <path d="M136 136 C148 134 156 142 152 150 C144 154 136 148 136 136 Z" fill="${C.sky.fill}" stroke="${C.sky.line}" stroke-width="2"/>
  </g>

  <!-- High forehead highlight -->
  <path d="M136 84 Q162 90 184 104" fill="none" stroke="${C.white}" stroke-width="4.5" stroke-linecap="round" opacity=".7"/>

  <!-- Dreamy anime eyes with upper lash, sweet lavender blush -->
  ${eye(175, 122, 10.5)}
  <!-- Delicate kawaii eyelash -->
  <path d="M172 110 Q178 108 186 112" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>
  ${blush(178, 144, 11, 6.5)}
  ${smile(198, 138, 6)}

  <!-- Floating soft bubbles -->
  ${sparkle(198, 70, 0.7, C.lavender)}
  <circle cx="216" cy="118" r="4" fill="${C.lavender.fill}" stroke="${C.lavender.line}" stroke-width="1.5" opacity=".6"/>
  `
);

// 3. Mint Little Cowfish / Boxfish
files['fish-mint'] = svg(
  'Mint boxfish character',
  `
  <g ${line(C.mint.line)}>
    <!-- Small fan-shaped tail fin -->
    <path d="M64 128 C38 108 26 102 24 116 C22 130 36 128 36 128 C36 128 22 136 24 150 C26 164 38 158 64 128 Z" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="3"/>

    <!-- Tiny fluttery dorsal fin -->
    <path d="M106 82 C114 62 130 60 138 72 C132 76 126 80 120 86 Z" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="2.5"/>

    <!-- Chubby boxy-rounded body -->
    <rect x="62" y="80" width="138" height="102" rx="46" fill="${C.mint.fill}"/>
    <!-- Soft cream-butter belly -->
    <ellipse cx="132" cy="154" rx="55" ry="24" fill="${C.butter.fill}" opacity=".55" stroke="none"/>

    <!-- Two cute tiny rounded horns on forehead -->
    <ellipse cx="178" cy="80" rx="6" ry="11" transform="rotate(18 178 80)" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="2.5"/>
    <ellipse cx="160" cy="76" rx="5.5" ry="9" transform="rotate(12 160 76)" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="2.5"/>

    <!-- Adorable pastel polka dots -->
    <circle cx="92" cy="108" r="6" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="2"/>
    <circle cx="114" cy="98" r="5" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="2"/>
    <circle cx="104" cy="132" r="7" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="2"/>
    <circle cx="128" cy="120" r="5.5" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="2"/>

    <!-- Cute paddling side fin -->
    <ellipse cx="134" cy="144" rx="14" ry="9" transform="rotate(-10 134 144)" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="2"/>
  </g>

  <!-- Sweet forehead highlight -->
  <path d="M124 86 Q146 80 168 86" fill="none" stroke="${C.white}" stroke-width="4.5" stroke-linecap="round" opacity=".7"/>

  <!-- Face: Large anime eye, rosy peach blush, puckered kissy mouth -->
  ${eye(174, 118, 10.5)}
  ${blush(174, 142, 11, 6.5)}
  <!-- Puckered kissy cute '3' mouth -->
  <path d="M196 130 Q199 133 196 136 Q199 139 196 142" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>

  <!-- Floating bubbles -->
  ${sparkle(208, 74, 0.7, C.mint)}
  <circle cx="212" cy="112" r="4" fill="${C.mint.fill}" stroke="${C.mint.line}" stroke-width="1.5" opacity=".7"/>
  `
);

// 4. Golden Striped Sunfish / Clownfish
files['fish-golden'] = svg(
  'Golden clownfish character',
  `
  <g ${line(C.butter.line)}>
    <!-- Frilly wavy caudal fin with double scallops -->
    <path d="M66 128 C34 92 18 88 18 106 C18 120 34 126 34 128 C34 130 18 136 18 150 C18 168 34 164 66 128 Z" fill="${C.peach.fill}" stroke="${C.peach.line}" stroke-width="3"/>
    <path d="M40 114 C28 120 28 132 40 142" fill="none" stroke="${C.white}" stroke-width="3" stroke-linecap="round" opacity=".7"/>

    <!-- Scalloped frilly dorsal fin -->
    <path d="M105 82 C115 54 135 50 148 62 C154 52 168 54 174 68 C166 74 158 80 150 90 Z" fill="${C.peach.fill}" stroke="${C.peach.line}" stroke-width="3"/>
    <!-- Cute ventral fin -->
    <path d="M115 174 C125 198 145 200 156 186 C148 182 140 176 135 166 Z" fill="${C.peach.fill}" stroke="${C.peach.line}" stroke-width="2.5"/>

    <!-- Chubby golden fish body -->
    <ellipse cx="136" cy="128" rx="84" ry="58" fill="${C.butter.fill}"/>

    <!-- Signature curved clownfish white/cream stripes with soft peach outlines -->
    <path d="M102 74 C90 98 90 158 102 182 C108 182 118 178 114 128 C118 78 108 74 102 74 Z" fill="${C.white}" stroke="${C.peach.line}" stroke-width="2"/>
    <path d="M138 72 C128 96 128 160 138 184 C144 184 152 178 148 128 C152 78 144 72 138 72 Z" fill="${C.white}" stroke="${C.peach.line}" stroke-width="2"/>

    <!-- Cheerful waving front pectoral fin -->
    <ellipse cx="148" cy="142" rx="16" ry="11" transform="rotate(20 148 142)" fill="${C.peach.fill}" stroke="${C.peach.line}" stroke-width="2.5"/>
  </g>

  <!-- Forehead shine curve -->
  <path d="M118 78 Q144 68 178 76" fill="none" stroke="${C.white}" stroke-width="5" stroke-linecap="round" opacity=".7"/>

  <!-- Face: Wide joyful eye, blushing pink cheek, cheerful open mouth with tongue -->
  ${eye(178, 116, 11.5)}
  ${blush(180, 142, 12, 7)}
  <!-- Cheerful open laughing mouth -->
  <path d="M198 128 Q208 144 214 130 Z" fill="${C.mouth}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>
  <ellipse cx="206" cy="133" rx="4" ry="2.5" fill="${C.tongue}"/>

  <!-- Celestial sparkles & floating bubbles -->
  ${sparkle(216, 62, 0.85, C.butter)}
  <circle cx="218" cy="106" r="4.5" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="1.5" opacity=".75"/>
  `
);

// =============================================================================
// CATEGORY 3: MAGICAL LOST BUTTON
// =============================================================================
files['button-lost'] = svg(
  'The magical lost button',
  `
  <!-- Radiant golden celestial aura -->
  <circle cx="128" cy="128" r="96" fill="${C.butter.fill}" opacity=".2"/>
  <circle cx="128" cy="128" r="88" fill="${C.pink.fill}" opacity=".25"/>

  <!-- Main pearlescent button body with rim -->
  <g ${line(C.pink.line, 3.5)}>
    <!-- Outer button border -->
    <circle cx="128" cy="128" r="78" fill="${C.pink.fill}"/>
    <!-- Raised carved bevel ring -->
    <circle cx="128" cy="128" r="66" fill="none" stroke="${C.pink.deep}" stroke-width="5"/>
    <!-- Recessed soft cream button interior -->
    <circle cx="128" cy="128" r="54" fill="${C.pink.belly}"/>
  </g>

  <!-- Sweet curved shine reflection on the rim -->
  <path d="M78 84 A66 66 0 0 1 178 84" fill="none" stroke="${C.white}" stroke-width="6" stroke-linecap="round" opacity=".75"/>
  <circle cx="184" cy="90" r="3.5" fill="${C.white}" opacity=".75"/>

  <!-- Four symmetric button holes -->
  ${[[108, 108], [148, 108], [108, 148], [148, 148]]
    .map(
      ([x, y]) => `
      <circle cx="${x}" cy="${y}" r="9" fill="${C.ink}"/>
      <circle cx="${x}" cy="${y}" r="6.5" fill="#2E1B28"/>
      <circle cx="${x - 2}" cy="${y - 2}" r="2.5" fill="${C.white}" opacity=".4"/>
    `,
    )
    .join('')}

  <!-- Magical star-flower cross thread stitching in pastel gold & cream -->
  <path d="M108 108 L148 148 M148 108 L108 148" stroke="${C.butter.deep}" stroke-width="7" stroke-linecap="round"/>
  <path d="M108 108 L148 148 M148 108 L108 148" stroke="${C.butter.fill}" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M108 108 L148 148 M148 108 L108 148" stroke="${C.white}" stroke-width="2" stroke-linecap="round" opacity=".8"/>
  <!-- Center golden thread knot -->
  <circle cx="128" cy="128" r="5" fill="${C.butter.line}"/>
  <circle cx="127" cy="127" r="2" fill="${C.white}"/>

  <!-- Floating magical celestial sparkles -->
  ${sparkle(52, 54, 1.2, C.butter)}
  ${sparkle(204, 62, 1.4, C.butter)}
  ${sparkle(48, 192, 0.95, C.butter)}
  ${sparkle(206, 194, 1.15, C.pink)}
  ${sparkle(128, 28, 0.8, C.butter)}
  `
);

// =============================================================================
// CATEGORY 4: CORAL, SEAWEED, SHELLS & AQUATIC DECORATIONS
// =============================================================================

// ---- CORAL ------------------------------------------------------------------
files['coral-branch'] = svg(
  'Pink branching coral',
  `
  ${tube('M128 236 C128 190 126 160 128 120', C.pink, 28)}
  ${tube('M128 190 C110 176 96 160 92 128 C90 108 94 96 98 84', C.pink, 20)}
  ${tube('M128 168 C146 154 160 140 164 116 C166 100 164 88 160 76', C.pink, 20)}
  ${tube('M128 122 C126 100 128 84 134 62', C.pink, 18)}
  ${tube('M98 98 C86 92 78 84 74 70', C.pink, 14)}
  ${tube('M162 94 C174 88 182 80 186 66', C.pink, 14)}
  <path d="M120 218 C121 196 120 176 121 150" fill="none" stroke="${C.white}" stroke-width="5" stroke-linecap="round" opacity=".6"/>
  <ellipse cx="128" cy="238" rx="48" ry="10" fill="${C.pink.deep}" stroke="${C.pink.line}" stroke-width="3"/>
  ${[[134, 62], [98, 84], [160, 76], [74, 70], [186, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="2.5"/>`).join('\n  ')}
  `
);

files['coral-fan'] = svg(
  'Lavender fan coral',
  `
  ${tube('M128 236 L128 186', C.lavender, 20)}
  <path d="M128 190 C62 180 28 130 40 82 C46 62 68 58 82 66 C92 48 116 44 128 58 C140 44 164 48 174 66 C188 58 210 62 216 82 C228 130 194 180 128 190 Z" fill="${C.lavender.fill}" stroke="${C.lavender.line}" stroke-width="3" stroke-linejoin="round"/>
  <g fill="none" stroke="${C.lavender.deep}" stroke-width="5" stroke-linecap="round">
    <path d="M128 186 C128 140 128 100 128 66"/>
    <path d="M122 182 C100 150 80 118 70 84"/>
    <path d="M134 182 C156 150 176 118 186 84"/>
    <path d="M114 186 C84 164 58 136 48 100"/>
    <path d="M142 186 C172 164 198 136 208 100"/>
  </g>
  <path d="M74 80 Q96 62 118 66" fill="none" stroke="${C.white}" stroke-width="5" stroke-linecap="round" opacity=".6"/>
  <ellipse cx="128" cy="240" rx="42" ry="9" fill="${C.lavender.deep}" stroke="${C.lavender.line}" stroke-width="3"/>
  `
);

files['coral-round'] = svg(
  'Peach bubble coral',
  `
  <g ${line(C.peach.line)}>
    <ellipse cx="128" cy="232" rx="78" ry="14" fill="${C.peach.deep}"/>
    <circle cx="70" cy="190" r="36" fill="${C.peach.fill}"/>
    <circle cx="186" cy="190" r="36" fill="${C.peach.fill}"/>
    <circle cx="128" cy="150" r="62" fill="${C.peach.fill}"/>
  </g>
  <g fill="${C.peach.deep}" opacity=".85">
    ${[[108, 126, 8], [140, 114, 7], [150, 150, 9], [110, 164, 7], [128, 186, 6], [90, 144, 5], [60, 184, 6], [82, 202, 5], [182, 182, 6], [196, 204, 5], [168, 128, 5]].map(([x, y, rr]) => `<circle cx="${x}" cy="${y}" r="${rr}"/>`).join('\n    ')}
  </g>
  <path d="M92 110 Q110 88 140 90" fill="none" stroke="${C.white}" stroke-width="6" stroke-linecap="round" opacity=".6"/>
  ${eye(108, 148, 6)}${eye(148, 148, 6)}${blush(96, 164, 8, 5)}${blush(160, 164, 8, 5)}${smile(128, 160, 7)}
  `
);

// ---- SEAWEED ----------------------------------------------------------------
files['seaweed-wave'] = svg(
  'Mint wavy seaweed',
  `
  ${tube('M128 240 C100 210 156 190 128 160 C102 132 154 112 128 86 C114 72 122 56 132 44', C.mint, 22)}
  <path d="M122 226 C108 206 140 188 124 168" fill="none" stroke="${C.white}" stroke-width="5" stroke-linecap="round" opacity=".6"/>
  ${tube('M122 200 C96 194 78 178 74 156', C.mint, 14)}
  ${tube('M134 134 C160 128 178 112 182 90', C.mint, 14)}
  <ellipse cx="128" cy="242" rx="34" ry="8" fill="${C.mint.deep}" stroke="${C.mint.line}" stroke-width="3"/>
  `
);

files['seaweed-leafy'] = svg(
  'Leafy seaweed',
  `
  <g ${line(C.mint.line)}>
    <path d="M128 240 C124 200 132 160 128 70" fill="none" stroke-width="12"/>
    ${[[210, -1], [180, 1], [150, -1], [120, 1], [92, -1]]
      .map(([y, s]) => `<path d="M128 ${y} C${128 + s * 30} ${y - 6} ${128 + s * 62} ${y - 20} ${128 + s * 66} ${y - 48} C${128 + s * 36} ${y - 44} ${128 + s * 10} ${y - 28} 128 ${y} Z" fill="${C.mint.fill}"/>`)
      .join('\n    ')}
    <path d="M128 74 C112 58 112 40 128 24 C144 40 144 58 128 74 Z" fill="${C.mint.fill}"/>
  </g>
  <ellipse cx="128" cy="242" rx="30" ry="8" fill="${C.mint.deep}" stroke="${C.mint.line}" stroke-width="3"/>
  `
);

// ---- SEASHELLS --------------------------------------------------------------
files['shell-scallop'] = svg(
  'Pink scallop shell',
  `
  <g ${line(C.pink.line)}>
    <path d="M100 206 H156 L168 232 H88 Z" fill="${C.pink.deep}"/>
    <path d="M128 214 C70 214 30 168 34 112 C36 80 60 62 90 66 C100 50 156 50 166 66 C196 62 220 80 222 112 C226 168 186 214 128 214 Z" fill="${C.pink.fill}"/>
  </g>
  <g fill="none" stroke="${C.pink.deep}" stroke-width="6" stroke-linecap="round">
    <path d="M128 208 V76"/><path d="M116 206 C92 170 80 124 86 78"/><path d="M140 206 C164 170 176 124 170 78"/>
    <path d="M104 206 C66 176 54 134 56 96"/><path d="M152 206 C190 176 202 134 200 96"/>
  </g>
  <path d="M70 100 Q84 78 112 72" fill="none" stroke="${C.white}" stroke-width="6" stroke-linecap="round" opacity=".6"/>
  ${eye(104, 150, 6)}${eye(152, 150, 6)}${smile(128, 164, 7)}${blush(90, 164, 9, 5)}${blush(166, 164, 9, 5)}
  `
);

files['shell-spiral'] = svg(
  'Butter spiral shell',
  `
  <g ${line(C.butter.line)}>
    <path d="M60 190 C30 170 34 132 62 122 C74 82 128 62 168 84 C206 100 218 150 196 184 C178 214 120 226 84 214 C74 210 66 202 60 190 Z" fill="${C.butter.fill}"/>
    <path d="M60 190 C90 196 120 188 138 168 C156 148 150 112 122 108" fill="none" stroke="${C.butter.deep}" stroke-width="12"/>
    <path d="M122 108 C100 108 92 126 100 140" fill="none" stroke="${C.butter.deep}" stroke-width="10"/>
  </g>
  <path d="M92 94 Q118 74 152 84" fill="none" stroke="${C.white}" stroke-width="6" stroke-linecap="round" opacity=".7"/>
  ${eye(160, 172, 6)}${smile(176, 186, 6)}${blush(150, 186, 8, 5)}
  `
);

// ---- BUBBLES ----------------------------------------------------------------
const bubble = (x, y, rr) =>
  `<circle cx="${x}" cy="${y}" r="${rr}" fill="${C.sky.fill}" fill-opacity=".45" stroke="${C.sky.line}" stroke-width="3"/>
  <path d="M${r(x - rr * 0.55)} ${r(y - rr * 0.1)} A${r(rr * 0.6)} ${r(rr * 0.6)} 0 0 1 ${r(x - rr * 0.1)} ${r(y - rr * 0.55)}" fill="none" stroke="${C.white}" stroke-width="${r(Math.max(3, rr * 0.14))}" stroke-linecap="round"/>
  <circle cx="${r(x + rr * 0.4)}" cy="${r(y + rr * 0.4)}" r="${r(Math.max(2, rr * 0.07))}" fill="${C.white}"/>`;

files['bubbles'] = svg(
  'Bubble cluster',
  [[96, 176, 50], [168, 112, 34], [92, 80, 22], [186, 192, 16], [150, 40, 12], [60, 126, 11]].map(([x, y, rr]) => bubble(x, y, rr)).join('\n  ')
);

// ---- JELLYFISH --------------------------------------------------------------
files['jellyfish'] = svg(
  'Lavender jellyfish',
  `
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    ${[84, 108, 148, 172]
      .map((x, i) => `<path d="M${x} 150 C${x - 14} 176 ${x + 14} 196 ${x} 222 C${x - 8} 234 ${x + 4} 240 ${x - 2} 244" stroke="${C.lavender.line}" stroke-width="${i % 3 ? 11 : 14}"/>
    <path d="M${x} 150 C${x - 14} 176 ${x + 14} 196 ${x} 222 C${x - 8} 234 ${x + 4} 240 ${x - 2} 244" stroke="${C.lavender.deep}" stroke-width="${i % 3 ? 5 : 8}"/>`)
      .join('\n    ')}
  </g>
  <path d="M40 150 C34 70 78 28 128 28 C178 28 222 70 216 150 C206 164 188 160 178 150 C166 164 146 164 128 150 C110 164 90 164 78 150 C68 160 50 164 40 150 Z" fill="${C.lavender.fill}" stroke="${C.lavender.line}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M62 96 C66 68 90 50 118 46" fill="none" stroke="${C.white}" stroke-width="7" stroke-linecap="round" opacity=".65"/>
  ${eye(100, 110, 9)}${eye(156, 110, 9)}${blush(82, 128, 11, 7)}${blush(174, 128, 11, 7)}${smile(128, 122, 8)}
  ${sparkle(190, 56, 0.8, C.butter)}
  `
);

// ---- STARFISH ---------------------------------------------------------------
files['starfish'] = svg(
  'Peach starfish',
  `
  ${roundedStar(128, 134, 108, C.peach, { inner: 0.5, puff: 26, outline: 3 })}
  ${[[128, 58], [200, 112], [172, 196], [84, 196], [56, 112]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${C.peach.deep}"/>`).join('\n  ')}
  <path d="M96 84 Q112 66 136 66" fill="none" stroke="${C.white}" stroke-width="6" stroke-linecap="round" opacity=".6"/>
  ${eye(108, 130, 8)}${eye(148, 130, 8)}${blush(94, 148, 10, 6)}${blush(162, 148, 10, 6)}${smile(128, 144, 8)}
  `
);


// =============================================================================
// CATEGORY 6: CUTE UNDERWATER ENVIRONMENT DECORATIONS
// =============================================================================

// ---- MESSAGE IN A BOTTLE ----------------------------------------------------
files['message-bottle'] = svg(
  'Message in a bottle',
  `
  <!-- Bottle glass body -->
  <g stroke="${C.sky.line}" stroke-width="3" stroke-linejoin="round">
    <!-- Stopper cork -->
    <rect x="106" y="50" width="44" height="20" rx="8" fill="${C.butter.fill}" stroke="${C.butter.line}"/>
    <path d="M110 54 Q128 48 146 54" fill="none" stroke="${C.white}" stroke-width="3" stroke-linecap="round" opacity=".6"/>

    <!-- Bottle neck -->
    <path d="M108 70 L100 100 H156 L148 70 Z" fill="${C.sky.fill}"/>

    <!-- Bottle main body -->
    <path d="M100 100 C68 108 50 136 54 172 C58 210 88 234 128 234 C168 234 198 210 202 172 C206 136 188 108 156 100 Z" fill="${C.sky.fill}" opacity=".75"/>
    <!-- Thick glass rim highlight -->
    <path d="M100 100 C68 108 50 136 54 172 C58 210 88 234 128 234 C168 234 198 210 202 172 C206 136 188 108 156 100 Z" fill="none" stroke="${C.sky.line}" stroke-width="4"/>

    <!-- Rolled parchment scroll inside -->
    <ellipse cx="128" cy="168" rx="44" ry="34" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="2.5"/>
    <path d="M86 168 Q88 152 128 152 Q168 152 170 168" fill="${C.butter.deep}" stroke="${C.butter.line}" stroke-width="2.5"/>
    <path d="M86 168 Q88 184 128 184 Q168 184 170 168" fill="${C.butter.deep}" stroke="${C.butter.line}" stroke-width="2.5"/>

    <!-- Cute handwritten squiggle lines on scroll -->
    <path d="M104 162 Q128 158 152 162" fill="none" stroke="${C.butter.line}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M108 170 Q128 166 148 170" fill="none" stroke="${C.butter.line}" stroke-width="2" stroke-linecap="round"/>
    <path d="M112 178 Q128 174 144 178" fill="none" stroke="${C.butter.line}" stroke-width="2" stroke-linecap="round"/>

    <!-- Tiny heart seal on scroll -->
    <path d="M128 188 C118 182 120 174 126 176 C128 177 128 179 128 179 C128 179 128 177 130 176 C136 174 138 182 128 188 Z" fill="${C.pink.fill}" stroke="${C.pink.line}" stroke-width="1.5"/>
  </g>

  <!-- Glass shine / reflection -->
  <path d="M74 124 Q68 154 72 184" fill="none" stroke="${C.white}" stroke-width="8" stroke-linecap="round" opacity=".55"/>
  <path d="M108 76 Q118 70 130 74" fill="none" stroke="${C.white}" stroke-width="4" stroke-linecap="round" opacity=".65"/>

  <!-- Cute kawaii face on bottle -->
  <circle cx="105" cy="136" r="6" fill="${C.ink}"/>
  <circle cx="107" cy="134" r="2.2" fill="${C.white}"/>
  <circle cx="151" cy="136" r="6" fill="${C.ink}"/>
  <circle cx="153" cy="134" r="2.2" fill="${C.white}"/>
  <ellipse cx="92" cy="148" rx="8" ry="5" fill="${C.pink.blush}" opacity=".6"/>
  <ellipse cx="164" cy="148" rx="8" ry="5" fill="${C.pink.blush}" opacity=".6"/>
  <path d="M122 146 Q128 152 134 146" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>

  <!-- Floating bubbles -->
  ${sparkle(202, 64, 0.85, C.sky)}
  <circle cx="208" cy="108" r="4.5" fill="${C.sky.fill}" stroke="${C.sky.line}" stroke-width="1.5" opacity=".7"/>
  `
);

// ---- MAGIC KEY --------------------------------------------------------------
files['magic-key'] = svg(
  'Magic key',
  `
  <!-- Key glow aura -->
  <ellipse cx="128" cy="128" rx="90" ry="88" fill="${C.butter.fill}" opacity=".2"/>

  <g stroke="${C.butter.line}" stroke-width="3.5" stroke-linejoin="round">
    <!-- Key head ring outer -->
    <circle cx="128" cy="98" r="58" fill="${C.butter.fill}"/>
    <!-- Key head ring inner hole -->
    <circle cx="128" cy="98" r="34" fill="transparent"/>
    <!-- Key head inner cut-out -->
    <circle cx="128" cy="98" r="34" fill="${C.butter.deep}" opacity=".35"/>

    <!-- Key shaft body -->
    <rect x="120" y="150" width="16" height="86" rx="8" fill="${C.butter.fill}"/>
    <!-- Key teeth -->
    <rect x="136" y="184" width="18" height="12" rx="4" fill="${C.butter.fill}"/>
    <rect x="136" y="204" width="14" height="10" rx="4" fill="${C.butter.fill}"/>
    <rect x="136" y="220" width="10" height="8" rx="3" fill="${C.butter.fill}"/>
  </g>

  <!-- Decorative star cut-out in head -->
  ${roundedStar(128, 98, 20, { fill: C.butter.deep, line: C.butter.line }, { inner: 0.52, puff: 5, outline: 2 })}

  <!-- Shine on key head -->
  <path d="M84 68 Q96 50 122 46" fill="none" stroke="${C.white}" stroke-width="6" stroke-linecap="round" opacity=".7"/>
  <circle cx="170" cy="56" r="4" fill="${C.white}" opacity=".65"/>

  <!-- Shaft shine -->
  <path d="M122 156 Q122 192 122 228" fill="none" stroke="${C.white}" stroke-width="3.5" stroke-linecap="round" opacity=".5"/>

  <!-- Floating magical sparkles around key -->
  ${sparkle(54, 58, 1.1, C.butter)}
  ${sparkle(202, 66, 1.3, C.pink)}
  ${sparkle(46, 186, 0.9, C.lavender)}
  ${sparkle(208, 188, 1.0, C.butter)}
  `
);

// ---- RUNE TABLET / CLUE STONE -----------------------------------------------
files['rune-tablet'] = svg(
  'Ancient rune tablet',
  `
  <!-- Stone shadow -->
  <ellipse cx="132" cy="232" rx="80" ry="14" fill="${C.lavender.line}" opacity=".35"/>

  <!-- Main tablet stone body -->
  <rect x="48" y="48" width="160" height="188" rx="32" fill="${C.lavender.fill}" stroke="${C.lavender.line}" stroke-width="4"/>

  <!-- Worn carved inset border -->
  <rect x="60" y="60" width="136" height="164" rx="22" fill="none" stroke="${C.lavender.deep}" stroke-width="5" opacity=".55"/>

  <!-- Top stone highlight -->
  <path d="M72 68 Q96 52 148 56" fill="none" stroke="${C.white}" stroke-width="7" stroke-linecap="round" opacity=".65"/>

  <!-- Rune glyphs - cute simplified symbols -->
  <!-- Crown glyph -->
  <path d="M92 104 L100 90 L110 98 L120 82 L130 98 L140 90 L148 104 Z" fill="none" stroke="${C.lavender.line}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
  <!-- Fish glyph -->
  <path d="M94 130 C104 122 140 118 160 130 C140 142 104 138 94 130 Z" fill="none" stroke="${C.lavender.line}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M94 130 L82 122 L82 138 Z" fill="${C.lavender.line}"/>
  <!-- Star glyph -->
  ${roundedStar(128, 170, 22, { fill: C.lavender.deep, line: C.lavender.line }, { inner: 0.52, puff: 5, outline: 2 })}
  <!-- Dot ornaments -->
  <circle cx="80" cy="86" r="4" fill="${C.lavender.deep}" opacity=".7"/>
  <circle cx="176" cy="86" r="4" fill="${C.lavender.deep}" opacity=".7"/>
  <circle cx="80" cy="200" r="4" fill="${C.lavender.deep}" opacity=".7"/>
  <circle cx="176" cy="200" r="4" fill="${C.lavender.deep}" opacity=".7"/>

  <!-- Kawaii face on tablet -->
  <circle cx="104" cy="200" r="7" fill="${C.ink}"/>
  <circle cx="106.5" cy="197" r="2.5" fill="${C.white}"/>
  <circle cx="152" cy="200" r="7" fill="${C.ink}"/>
  <circle cx="154.5" cy="197" r="2.5" fill="${C.white}"/>
  <ellipse cx="90" cy="212" rx="9" ry="6" fill="${C.pink.blush}" opacity=".6"/>
  <ellipse cx="166" cy="212" rx="9" ry="6" fill="${C.pink.blush}" opacity=".6"/>
  <path d="M120 210 Q128 218 136 210" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>

  <!-- Floating sparkles -->
  ${sparkle(46, 48, 1.0, C.lavender)}
  ${sparkle(210, 54, 1.2, C.butter)}
  `
);

// ---- PEARL ------------------------------------------------------------------
files['pearl'] = svg(
  'Glowing pearl',
  `
  <!-- Soft glow aura -->
  <circle cx="128" cy="128" r="96" fill="${C.sky.fill}" opacity=".18"/>
  <circle cx="128" cy="128" r="80" fill="${C.lavender.fill}" opacity=".2"/>

  <!-- Pearl body -->
  <circle cx="128" cy="128" r="70" fill="${C.white}" stroke="${C.sky.line}" stroke-width="3.5"/>

  <!-- Iridescent pastel sheen patches -->
  <ellipse cx="108" cy="108" rx="28" ry="20" fill="${C.lavender.fill}" opacity=".35"/>
  <ellipse cx="152" cy="148" rx="22" ry="16" fill="${C.sky.fill}" opacity=".3"/>
  <ellipse cx="140" cy="96" rx="18" ry="12" fill="${C.pink.fill}" opacity=".3"/>

  <!-- Main shine highlight -->
  <path d="M88 84 Q106 62 140 66" fill="none" stroke="${C.white}" stroke-width="10" stroke-linecap="round" opacity=".85"/>
  <circle cx="152" cy="74" r="6" fill="${C.white}" opacity=".8"/>
  <!-- Secondary shimmer -->
  <path d="M76 130 Q80 148 86 162" fill="none" stroke="${C.white}" stroke-width="5" stroke-linecap="round" opacity=".45"/>

  <!-- Tiny kawaii sparkle face -->
  <circle cx="110" cy="136" r="7" fill="${C.ink}"/>
  <circle cx="112.5" cy="133" r="2.5" fill="${C.white}"/>
  <circle cx="146" cy="136" r="7" fill="${C.ink}"/>
  <circle cx="148.5" cy="133" r="2.5" fill="${C.white}"/>
  <ellipse cx="96" cy="150" rx="9" ry="5.5" fill="${C.pink.blush}" opacity=".55"/>
  <ellipse cx="160" cy="150" rx="9" ry="5.5" fill="${C.pink.blush}" opacity=".55"/>
  <path d="M120 148 Q128 156 136 148" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>

  <!-- Outer sparkles -->
  ${sparkle(48, 56, 1.2, C.sky)}
  ${sparkle(204, 62, 1.4, C.lavender)}
  ${sparkle(46, 196, 0.9, C.pink)}
  ${sparkle(206, 196, 1.1, C.butter)}
  `
);

// ---- TREASURE CHEST ---------------------------------------------------------
files['treasure-chest'] = svg(
  'Magical treasure chest',
  `
  <!-- Chest shadow -->
  <ellipse cx="130" cy="232" rx="94" ry="14" fill="${C.butter.line}" opacity=".3"/>

  <!-- Chest lower body -->
  <rect x="38" y="150" width="184" height="82" rx="16" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="4"/>

  <!-- Chest lid -->
  <path d="M38 150 C38 104 222 104 222 150 Z" fill="${C.butter.fill}" stroke="${C.butter.line}" stroke-width="4" stroke-linejoin="round"/>
  <!-- Lid dome top -->
  <path d="M44 148 C44 112 216 112 216 148" fill="${C.peach.fill}" stroke="${C.peach.line}" stroke-width="3"/>

  <!-- Wood plank lines on chest body -->
  <path d="M38 170 H222 M38 190 H222 M38 210 H222" fill="none" stroke="${C.butter.deep}" stroke-width="3.5" opacity=".5"/>
  <!-- Wood plank lines on lid -->
  <path d="M56 134 Q130 126 204 134 M70 146 Q130 138 190 146" fill="none" stroke="${C.butter.deep}" stroke-width="3" opacity=".5"/>

  <!-- Iron band straps -->
  <rect x="38" y="146" width="184" height="14" rx="4" fill="${C.lavender.line}" stroke="${C.lavender.deep}" stroke-width="2.5" opacity=".8"/>
  <rect x="38" y="224" width="184" height="10" rx="4" fill="${C.lavender.line}" stroke="${C.lavender.deep}" stroke-width="2.5" opacity=".7"/>
  <!-- Vertical strap -->
  <rect x="118" y="104" width="24" height="128" rx="5" fill="${C.lavender.line}" stroke="${C.lavender.deep}" stroke-width="2.5" opacity=".75"/>

  <!-- Lock plate -->
  <rect x="110" y="147" width="40" height="30" rx="10" fill="${C.butter.deep}" stroke="${C.butter.line}" stroke-width="3"/>
  <!-- Lock keyhole -->
  <circle cx="130" cy="157" r="6" fill="${C.ink}"/>
  <path d="M126 163 L134 163 L132 172 L128 172 Z" fill="${C.ink}"/>
  <circle cx="128" cy="156" r="2" fill="${C.white}" opacity=".5"/>

  <!-- Lid shine -->
  <path d="M72 120 Q104 108 152 112" fill="none" stroke="${C.white}" stroke-width="7" stroke-linecap="round" opacity=".6"/>
  <circle cx="164" cy="114" r="4" fill="${C.white}" opacity=".6"/>

  <!-- Kawaii face on chest -->
  <circle cx="96" cy="194" r="8" fill="${C.ink}"/>
  <circle cx="99" cy="191" r="3" fill="${C.white}"/>
  <circle cx="164" cy="194" r="8" fill="${C.ink}"/>
  <circle cx="167" cy="191" r="3" fill="${C.white}"/>
  <ellipse cx="80" cy="210" rx="11" ry="7" fill="${C.pink.blush}" opacity=".6"/>
  <ellipse cx="180" cy="210" rx="11" ry="7" fill="${C.pink.blush}" opacity=".6"/>
  <path d="M120 208 Q130 218 140 208" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>

  <!-- Magical sparkle aura -->
  ${sparkle(36, 44, 1.2, C.butter)}
  ${sparkle(218, 52, 1.5, C.butter)}
  ${sparkle(36, 192, 0.9, C.pink)}
  ${sparkle(222, 194, 1.0, C.lavender)}
  ${sparkle(128, 30, 0.85, C.butter)}
  `
);

writeSvgs('underwater', files);
console.log('Underwater SVGs including 4 unique fish and the magical lost button updated!');
