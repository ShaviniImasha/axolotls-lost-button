import type { AssetName } from '../assets';

export interface HiddenObjectData {
  id: string;
  name: string;
  assetKey: AssetName;
  x: number;
  y: number;
  width: number;
  height?: number;
  isFound: boolean;
}
