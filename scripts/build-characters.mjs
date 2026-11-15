// Generates the collection of cute kawaii axolotl mascot illustrations with different expressions.
// Follows Japanese kawaii illustration style: soft pastel palette, chubby rounded shapes,
// large sparkling eyes, blush cheeks with shine marks, and fluffy feathery gills.
import { C, r, svg, sparkle, line, writeSvgs } from './svg-kit.mjs';

const HEAD = { cx: 128, cy: 116, rx: 70, ry: 60 };
const ATTACH = [215, 180, 145]; // where the 3 gills sprout on the head (parametric degrees)
const rad = (d) => (d * Math.PI) / 180;

/** Fluffy 3-lobed feathery gill stalk */
const gillLobe = (cx, cy, a, flip = false) => {
  const rot = flip ? -a : a;
  const x = flip ? 256 - cx : cx;
  return `
    <g transform="rotate(${rot} ${x} ${cy})">
      <!-- Main stalk -->
      <path d="M${x - 22} ${cy + 4} C${x - 18} ${cy - 14} ${x + 18} ${cy - 14} ${x + 22} ${cy + 4} C${x + 14} ${cy + 12} ${x - 14} ${cy + 12} Z" fill="${C.pink.deep}"/>
      <!-- Fluffy rounded lobes -->
      <circle cx="${x - 14}" cy="${cy - 7}" r="9" fill="${C.pink.deep}"/>
      <circle cx="${x}" cy="${cy - 12}" r="11" fill="${C.pink.deep}"/>
      <circle cx="${x + 14}" cy="${cy - 7}" r="9" fill="${C.pink.deep}"/>
      <!-- Soft inner glow -->
      <ellipse cx="${x}" cy="${cy - 2}" rx="14" ry="5" fill="${C.pink.fill}" opacity=".85"/>
      <circle cx="${x - 14}" cy="${cy - 7}" r="4" fill="${C.pink.fill}" opacity=".75"/>
      <circle cx="${x}" cy="${cy - 12}" r="5" fill="${C.pink.fill}" opacity=".75"/>
      <circle cx="${x + 14}" cy="${cy - 7}" r="4" fill="${C.pink.fill}" opacity=".75"/>
    </g>`;
};

/** Three gills per side */
const gills = (angles) =>
  angles
    .flatMap((a, i) => {
      const t = rad(ATTACH[i]);
      const cx = HEAD.cx + HEAD.rx * Math.cos(t) + Math.cos(rad(a)) * 16;
      const cy = HEAD.cy + HEAD.ry * Math.sin(t) + Math.sin(rad(a)) * 16;
      return [gillLobe(r(cx), r(cy), r(a), false), gillLobe(r(cx), r(cy), r(a), true)];
    })
    .join('');

/** Shared chubby kawaii axolotl body */
const body = (angles, pawPose = 'resting') => `
  <!-- Tail and wavy fin -->
  <g ${line(C.pink.line)}>
    <!-- Translucent dorsal fin -->
    <path d="M150 180 C185 170 230 185 244 212 C248 230 226 238 206 235 C186 232 170 220 158 214 Z" fill="${C.pink.deep}" opacity=".55"/>
    <!-- Tail muscle -->
    <path d="M162 202 C188 196 218 202 232 216 C235 228 220 234 204 232 C188 230 174 224 164 218 Z" fill="${C.pink.fill}"/>
    
    <!-- Feathery gills behind head -->
    ${gills(angles)}

    <!-- Stubby back feet -->
    <ellipse cx="96" cy="232" rx="16" ry="9" fill="${C.pink.fill}"/>
    <ellipse cx="160" cy="232" rx="16" ry="9" fill="${C.pink.fill}"/>

    <!-- Chubby belly body -->
    <ellipse cx="128" cy="192" rx="48" ry="40" fill="${C.pink.fill}"/>
    <!-- Soft cream belly patch -->
    <ellipse cx="128" cy="204" rx="30" ry="24" fill="${C.pink.belly}" stroke="none"/>

    <!-- Paws pose -->
    ${
      pawPose === 'raised'
        ? `
        <!-- Cheering raised paws -->
        <ellipse cx="76" cy="172" rx="12" ry="9" transform="rotate(-40 76 172)" fill="${C.pink.fill}"/>
        <ellipse cx="180" cy="172" rx="12" ry="9" transform="rotate(40 180 172)" fill="${C.pink.fill}"/>
      `
        : pawPose === 'holding'
          ? `
        <!-- Paws together holding lost button or treasure -->
        <ellipse cx="108" cy="186" rx="11" ry="8" transform="rotate(15 108 186)" fill="${C.pink.fill}"/>
        <ellipse cx="148" cy="186" rx="11" ry="8" transform="rotate(-15 148 186)" fill="${C.pink.fill}"/>
      `
          : `
        <!-- Cute paws resting on belly -->
        <ellipse cx="86" cy="194" rx="12" ry="8" transform="rotate(-20 86 194)" fill="${C.pink.fill}"/>
        <ellipse cx="170" cy="194" rx="12" ry="8" transform="rotate(20 170 194)" fill="${C.pink.fill}"/>
      `
    }

    <!-- Cute wide head -->
    <ellipse cx="128" cy="116" rx="72" ry="60" fill="${C.pink.fill}"/>
  </g>

  <!-- Sweet forehead highlight -->
  <path d="M84 82 Q100 66 126 62" fill="none" stroke="${C.white}" stroke-width="5" stroke-linecap="round" opacity=".65"/>
  <circle cx="134" cy="64" r="3" fill="${C.white}" opacity=".65"/>
`;

// ---- Facial detail helpers --------------------------------------------------
const ink = (w = 3) => `fill="none" ${line(C.ink, w)}`;

/** Kawaii blushing cheeks with little white highlight stripes '//' */
const cheeks = (y = 136, rx = 14, ry = 8) => `
  <ellipse cx="84" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.pink.blush}" opacity=".65"/>
  <path d="M79 ${y - 3} L77 ${y + 3} M85 ${y - 3} L83 ${y + 3}" stroke="${C.white}" stroke-width="2" stroke-linecap="round" opacity=".8"/>
  <ellipse cx="172" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.pink.blush}" opacity=".65"/>
  <path d="M167 ${y - 3} L165 ${y + 3} M173 ${y - 3} L171 ${y + 3}" stroke="${C.white}" stroke-width="2" stroke-linecap="round" opacity=".8"/>
`;

/** Classic anime sparkling kawaii eye */
const sparklingEye = (x, y, r = 11) => `
  <circle cx="${x}" cy="${y}" r="${r}" fill="${C.ink}"/>
  <!-- Bottom soft iris crescent -->
  <path d="M${x - r * 0.7} ${y + r * 0.2} Q${x} ${y + r * 0.8} ${x + r * 0.7} ${y + r * 0.2}" fill="none" stroke="#C48DAE" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Primary big highlight -->
  <circle cx="${x + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.38}" fill="${C.white}"/>
  <!-- Secondary soft catchlight -->
  <circle cx="${x - r * 0.35}" cy="${y + r * 0.35}" r="${r * 0.2}" fill="${C.white}"/>
  <!-- Tiny third sparkle -->
  <circle cx="${x + r * 0.5}" cy="${y + r * 0.15}" r="${r * 0.12}" fill="${C.white}"/>
`;

/** Star-shaped catchlight eye for excitement */
const starCatchlightEye = (x, y, r = 12) => `
  <circle cx="${x}" cy="${y}" r="${r}" fill="${C.ink}"/>
  <path d="M${x} ${y - r * 0.7} Q${x + 2} ${y - 2} ${x + r * 0.7} ${y} Q${x + 2} ${y + 2} ${x} ${y + r * 0.7} Q${x - 2} ${y + 2} ${x - r * 0.7} ${y} Q${x - 2} ${y - 2} ${x} ${y - r * 0.7} Z" fill="${C.butter.fill}"/>
  <circle cx="${x - r * 0.35}" cy="${y + r * 0.35}" r="${r * 0.25}" fill="${C.white}"/>
`;

/** Heart catchlight eye for love expression */
const heartCatchlightEye = (x, y, r = 12) => `
  <circle cx="${x}" cy="${y}" r="${r}" fill="${C.ink}"/>
  <path d="M${x} ${y + r * 0.5} C${x - r * 0.7} ${y + r * 0.1} ${x - r * 0.7} ${y - r * 0.5} ${x} ${y - r * 0.2} C${x + r * 0.7} ${y - r * 0.5} ${x + r * 0.7} ${y + r * 0.1} ${x} ${y + r * 0.5} Z" fill="#FFA5BE"/>
  <circle cx="${x - r * 0.3}" cy="${y - r * 0.25}" r="${r * 0.25}" fill="${C.white}"/>
`;

// ---- Character Expressions --------------------------------------------------
const variants = {
  // 1. Primary Mascot (Curious, gentle sweet smile, sparkling eyes)
  'axolotl-mascot': {
    label: 'Pink axolotl mascot',
    angles: [215, 180, 145],
    pawPose: 'resting',
    face: `
      ${cheeks(136)}
      ${sparklingEye(98, 118, 10.5)}
      ${sparklingEye(158, 118, 10.5)}
      <!-- Cute cat-style sweet 'ω' mouth -->
      <path d="M117 131 Q122.5 138 128 131 Q133.5 138 139 131" ${ink(3)}/>
      ${sparkle(168, 76, 0.95)}
    `,
  },

  // 2. Happy (Beaming smile, joyful curved ^^ eyes, open happy mouth)
  'axolotl-happy': {
    label: 'Happy axolotl',
    angles: [222, 186, 150],
    pawPose: 'resting',
    face: `
      ${cheeks(136, 16, 9)}
      <!-- Kawaii curved ^^ happy eyes -->
      <path d="M88 123 Q98 108 108 123 M148 123 Q158 108 168 123" ${ink(4.5)}/>
      <!-- Little joyful eyelashes -->
      <path d="M107 114 L112 110 M149 114 L144 110" ${ink(2.5)}/>
      <!-- Joyful open mouth with cute tongue -->
      <path d="M113 131 Q128 156 143 131 Z" fill="${C.mouth}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="128" cy="139" rx="6.5" ry="4" fill="${C.tongue}"/>
      ${sparkle(170, 72, 1.1)}
      ${sparkle(82, 60, 0.75)}
    `,
  },

  // 3. Excited (Cheering paws raised, star catchlight eyes, open mouth, floating stars)
  'axolotl-excited': {
    label: 'Excited axolotl',
    angles: [235, 202, 172],
    pawPose: 'raised',
    face: `
      ${cheeks(136, 16, 9.5)}
      ${starCatchlightEye(98, 117, 12)}
      ${starCatchlightEye(158, 117, 12)}
      <path d="M86 98 Q98 90 110 97 M146 97 Q158 90 170 98" ${ink(3.5)}/>
      <!-- Wide open laughing mouth -->
      <path d="M110 130 Q128 165 146 130 Z" fill="${C.mouth}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="128" cy="142" rx="9" ry="5.5" fill="${C.tongue}"/>
      <!-- Floating celebration sparkles -->
      ${sparkle(80, 36, 1.1)}
      ${sparkle(176, 30, 1.35)}
      ${sparkle(128, 18, 0.8)}
      ${sparkle(216, 85, 0.9)}
    `,
  },

  // 4. Sad (Pouting, droopy gills, soft glistening teardrop)
  'axolotl-sad': {
    label: 'Sad axolotl',
    angles: [160, 140, 122],
    pawPose: 'resting',
    face: `
      ${cheeks(138, 12, 7)}
      ${sparklingEye(98, 122, 11)}
      ${sparklingEye(158, 122, 11)}
      <!-- Sad droopy eyebrows -->
      <path d="M86 109 Q99 105 112 98 M144 98 Q157 105 170 109" ${ink(3.5)}/>
      <!-- Pouting wavy mouth -->
      <path d="M116 142 Q128 133 140 142" ${ink(3.5)}/>
      <!-- Glistening blue teardrops -->
      <path d="M92 136 C86 144 84 148 92 153 C100 148 98 144 92 136 Z" fill="${C.sky.fill}" stroke="${C.sky.line}" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="93" cy="149" r="1.5" fill="${C.white}"/>
    `,
  },

  // 5. Sleeping (Peacefully dozing, curved lashes, sleeping snot/dream bubble & zzz)
  'axolotl-sleeping': {
    label: 'Sleeping axolotl',
    angles: [170, 150, 128],
    pawPose: 'resting',
    face: `
      ${cheeks(136, 14, 8)}
      <!-- Peaceful sleeping curved eyes -->
      <path d="M88 121 Q98 131 108 121 M148 121 Q158 131 168 121" ${ink(4)}/>
      <!-- Tiny cute resting mouth -->
      <path d="M122 136 Q128 141 134 136" ${ink(3)}/>
      <!-- Kawaii translucent sleeping bubble -->
      <circle cx="148" cy="138" r="9" fill="${C.sky.fill}" stroke="${C.sky.line}" stroke-width="2" opacity=".85"/>
      <ellipse cx="145" cy="134" rx="3" ry="1.8" fill="${C.white}" opacity=".8"/>
      <!-- Soft lavender floating Zzz -->
      <path d="M176 46 H190 L176 60 H190" fill="none" stroke="${C.lavender.line}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M198 24 H210 L198 36 H210" fill="none" stroke="${C.lavender.line}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  },

  // 6. Love (Adoring, heart catchlights, floating hearts)
  'axolotl-love': {
    label: 'In love axolotl',
    angles: [225, 190, 155],
    pawPose: 'holding',
    face: `
      ${cheeks(136, 17, 10)}
      ${heartCatchlightEye(98, 118, 12)}
      ${heartCatchlightEye(158, 118, 12)}
      <path d="M116 131 Q122 138 128 132 Q134 138 140 131" ${ink(3)}/>
      <!-- Floating pastel hearts -->
      <path d="M188 48 C180 38 168 44 174 52 C180 60 188 66 188 66 C188 66 196 60 202 52 C208 44 196 38 188 48 Z" fill="${C.pink.blush}" stroke="${C.pink.line}" stroke-width="2"/>
      <path d="M72 40 C66 32 56 36 60 42 C64 48 72 54 72 54 C72 54 80 48 84 42 C88 36 78 32 72 40 Z" fill="${C.pink.blush}" stroke="${C.pink.line}" stroke-width="2"/>
    `,
  },

  // 7. Surprised (Curious round eyes, 'O' mouth, attentive perked-up gills)
  'axolotl-surprised': {
    label: 'Surprised axolotl',
    angles: [230, 195, 160],
    pawPose: 'raised',
    face: `
      ${cheeks(138, 13, 8)}
      <circle cx="98" cy="116" r="12" fill="${C.ink}"/>
      <circle cx="102" cy="112" r="4.5" fill="${C.white}"/>
      <circle cx="94" cy="120" r="2" fill="${C.white}"/>
      <circle cx="158" cy="116" r="12" fill="${C.ink}"/>
      <circle cx="162" cy="112" r="4.5" fill="${C.white}"/>
      <circle cx="154" cy="120" r="2" fill="${C.white}"/>
      <!-- Cute tiny 'o' mouth -->
      <circle cx="128" cy="136" r="6" fill="${C.mouth}" stroke="${C.ink}" stroke-width="2.5"/>
      <ellipse cx="128" cy="138" rx="3.5" ry="2" fill="${C.tongue}"/>
      ${sparkle(72, 70, 0.9)}
      ${sparkle(184, 70, 0.9)}
    `,
  },
};

// Write out to src/assets/svg/characters/
writeSvgs(
  'characters',
  Object.fromEntries(
    Object.entries(variants).map(([name, v]) => [
      name,
      svg(v.label, body(v.angles, v.pawPose) + v.face),
    ]),
  ),
);
console.log('Main axolotl mascot SVGs generated successfully!');
