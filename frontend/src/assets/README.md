# Axolotl game assets

42 original SVGs, all transparent, scalable (`viewBox`), and free of external dependencies.

```
src/assets/
  svg/characters/   5   axolotl-mascot | happy | sad | excited | sleeping
  svg/underwater/  13   fish-*, coral-*, seaweed-*, shell-*, bubbles, jellyfish, starfish
  svg/ui/          24   icon-*, star-*, sparkles, badge-*, level-complete-*
  names.ts              AUTO-GENERATED typed names (do not edit)
  index.ts              assetUrl / assetSvg / loadAssetImage
scripts/
  svg-kit.mjs           shared palette + helpers (change colours here)
  build-*.mjs           one generator per folder
  build-all.mjs         regenerate everything
  verify-svgs.mjs       XML, no external refs, transparent corners
```

## Workflow
1. Edit a colour in `scripts/svg-kit.mjs` or a shape in a `build-*.mjs` file.
2. `node scripts/build-all.mjs` rewrites the SVGs and `names.ts`.
3. `node scripts/verify-svgs.mjs` (needs `xmllint`, `rsvg-convert`, ImageMagick).

## Using them
```ts
import { assetUrl, assetSvg, loadAssetImage } from './assets';

img.src = assetUrl('axolotl-happy');            // <img>, CSS, Phaser load.image
el.innerHTML = assetSvg('jellyfish');           // inline, so CSS can animate it
const ctx2dImg = await loadAssetImage('fish-mint'); // canvas drawImage
```
`assetUrl('axolotl-hapy')` is a compile error, because names come from the generated union type.

## Not using Vite?
`index.ts` uses `import.meta.glob` (Vite). Elsewhere, swap the two glob calls for
`require.context('./svg', true, /\.svg$/)` (webpack: use `asset/resource` for URLs, `asset/source` for raw)
or Parcel's `new URL('./svg/...', import.meta.url)`. The rest of the file stays the same.

## Text
Level-complete scenes and the ribbon contain no text. Overlay "Level Complete!" in HTML/CSS so it stays
translatable and avoids font dependencies.
