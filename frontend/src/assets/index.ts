import { ASSET_GROUPS, type AssetGroup, type AssetName } from './names';

export { ASSET_GROUPS };
export type { AssetGroup, AssetName };

const urls = import.meta.glob('./svg/**/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const raws = import.meta.glob('./svg/**/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;


const groupOf = new Map<AssetName, AssetGroup>();
for (const group of Object.keys(ASSET_GROUPS) as AssetGroup[]) {
  for (const name of ASSET_GROUPS[group]) groupOf.set(name, group);
}

const keyFor = (name: AssetName) => `./svg/${groupOf.get(name)}/${name}.svg`;

export function assetUrl(name: AssetName): string {
  const url = urls[keyFor(name)];
  if (!url) throw new Error(`Unknown asset: ${name}`);
  return url;
}

export function assetSvg(name: AssetName): string {
  const svg = raws[keyFor(name)];
  if (!svg) throw new Error(`Unknown asset: ${name}`);
  return svg;
}

export function loadAssetImage(name: AssetName): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load asset: ${name}`));
    img.src = assetUrl(name);
  });
}
