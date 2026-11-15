import type { AssetName } from '../assets';
import {
  getAllLevels,
  type AdventureLevelDefinition,
  type HiddenObjectType,
  type LevelId,
} from './levelManager';

export type { HiddenObjectType } from './levelManager';

export interface LevelHiddenObject {
  id: string;
  levelId: LevelId;
  name: string;
  type: HiddenObjectType;
  x: number;
  y: number;
  asset?: AssetName;
  customSvg?: string;
  required: boolean;
  pointsReward: number;
  isPearl: boolean;
  givesClueId?: string;
  layerZ?: number;
}

export interface DiscoveryResult {
  success: boolean;
  object: LevelHiddenObject | null;
  message: string;
  pointsEarned: number;
  pearlsEarned: number;
  clueAwardedId?: string;
  missionCompleted: boolean;
  requiredFoundCount: number;
  totalRequiredCount: number;
}

interface ObjectTemplate {
  name: string;
  type: HiddenObjectType;
  asset?: AssetName;
  x: number;
  y: number;
  pointsReward?: number;
  isPearl?: boolean;
  clue?: boolean;
}

const REALM_OBJECTS: Record<AdventureLevelDefinition['realmId'], ObjectTemplate[]> = {
  pond: [
    { name: 'Shimmering Pearl', type: 'pearl', x: 22, y: 64, isPearl: true },
    { name: 'Spiral Pond Shell', type: 'shell', asset: 'shell-spiral', x: 42, y: 78 },
    { name: 'Glowing Message Bottle', type: 'bottle', asset: 'message-bottle', x: 62, y: 68, pointsReward: 10, clue: true },
    { name: 'Little Starfish', type: 'starfish', asset: 'starfish', x: 70, y: 80 },
    { name: 'Pink Shell', type: 'shell', asset: 'shell-scallop', x: 14, y: 42 },
    { name: 'Glowing Pond Pearl', type: 'pearl', x: 74, y: 38, isPearl: true },
    { name: 'Water Lily Pearl', type: 'pearl', x: 34, y: 27, isPearl: true },
    { name: 'Pond Pebble', type: 'treasure', asset: 'pearl', x: 90, y: 36, pointsReward: 10 },
  ],
  coral: [
    { name: 'Coral Pearl', type: 'pearl', x: 18, y: 72, isPearl: true },
    { name: 'Moon Shell Scallop', type: 'shell', asset: 'shell-scallop', x: 34, y: 82 },
    { name: 'Ancient Pearl Coin', type: 'treasure', asset: 'pearl', x: 45, y: 65, pointsReward: 10, clue: true },
    { name: 'Golden Starfish', type: 'starfish', asset: 'starfish', x: 68, y: 28 },
    { name: 'Lavender Whorl Shell', type: 'shell', asset: 'shell-spiral', x: 88, y: 36 },
    { name: 'Reef Pearl', type: 'pearl', x: 52, y: 35, isPearl: true },
    { name: 'Coral Spark', type: 'shell', asset: 'coral-fan', x: 12, y: 28 },
    { name: 'Blossom Pearl', type: 'pearl', x: 72, y: 58, isPearl: true },
  ],
  cave: [
    { name: 'Twilight Pearl', type: 'pearl', x: 15, y: 68, isPearl: true },
    { name: 'Golden Scallop', type: 'treasure', asset: 'shell-scallop', x: 25, y: 82, pointsReward: 10 },
    { name: 'Glowing Cave Tablet', type: 'clue', asset: 'rune-tablet', x: 75, y: 26, pointsReward: 10, clue: true },
    { name: 'Golden Skeleton Key', type: 'key', asset: 'magic-key', x: 58, y: 62, pointsReward: 10 },
    { name: 'Abyssal Starfish', type: 'starfish', asset: 'starfish', x: 50, y: 84 },
    { name: 'Cave Pearl', type: 'pearl', x: 35, y: 32, isPearl: true },
    { name: 'Jelly Bloom', type: 'starfish', asset: 'jellyfish', x: 68, y: 82 },
    { name: 'Crystal Pearl', type: 'pearl', x: 65, y: 45, isPearl: true },
  ],
};

function stableHash(value: string): number {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createObjects(level: AdventureLevelDefinition): LevelHiddenObject[] {
  const templates = REALM_OBJECTS[level.realmId].slice(0, level.difficultySettings.hiddenObjectCount);
  const placement = {
    obvious: { shift: -7, jitter: 1 },
    'partly-tucked-away': { shift: 0, jitter: 2 },
    'well-hidden': { shift: 7, jitter: 3 },
  }[level.difficultySettings.objectPlacement];
  return templates.map((template, index) => {
    const seed = stableHash(`${level.id}:${index}`);
    const jitterX = (seed % (placement.jitter * 2 + 1)) - placement.jitter;
    const jitterY = ((seed >>> 8) % (placement.jitter * 2 + 1)) - placement.jitter;
    const clue = template.clue ? level.clues.find((item) => item.source === 'hidden-object') : undefined;
    return {
      id: `${level.id}-${template.type}-${index + 1}`,
      levelId: level.id,
      name: template.name,
      type: template.type,
      x: Math.max(8, Math.min(92, template.x + placement.shift + jitterX)),
      y: Math.max(16, Math.min(88, template.y + placement.shift + jitterY)),
      asset: template.asset ?? level.realm.hiddenObjectArtTypes[template.type],
      required: true,
      pointsReward: template.pointsReward ?? 5,
      isPearl: template.isPearl ?? false,
      givesClueId: clue?.id,
    };
  });
}

export const LEVEL_OBJECTS: Record<LevelId, LevelHiddenObject[]> = Object.fromEntries(
  getAllLevels().map((level) => [level.id, createObjects(level)]),
) as Record<LevelId, LevelHiddenObject[]>;

export class HiddenObjectManager {
  private foundObjectIds: Set<string> = new Set();
  private currentLevelId: LevelId = 'pond-easy';

  constructor(levelId: LevelId = 'pond-easy') {
    this.currentLevelId = levelId;
  }

  public setLevel(levelId: LevelId): void {
    this.currentLevelId = levelId;
    this.foundObjectIds.clear();
  }

  public getObjectsForCurrentLevel(): LevelHiddenObject[] {
    return LEVEL_OBJECTS[this.currentLevelId];
  }

  public getUnfoundObjects(): LevelHiddenObject[] {
    return this.getObjectsForCurrentLevel().filter((obj) => !this.foundObjectIds.has(obj.id));
  }

  public isObjectFound(objectId: string): boolean {
    return this.foundObjectIds.has(objectId);
  }

  public getRequiredObjectsCount(): number {
    return this.getObjectsForCurrentLevel().filter((object) => object.required).length;
  }

  public getRequiredFoundCount(): number {
    return this.getObjectsForCurrentLevel().filter((object) => object.required && this.foundObjectIds.has(object.id)).length;
  }

  public isMissionComplete(): boolean {
    return this.getRequiredFoundCount() >= this.getRequiredObjectsCount();
  }

  public discover(objectId: string): DiscoveryResult {
    const all = this.getObjectsForCurrentLevel();
    const target = all.find((object) => object.id === objectId);

    if (!target) {
      return this.failure(null, 'Nope, just bubbles.');
    }
    if (this.foundObjectIds.has(objectId)) {
      return this.failure(target, 'Got that one already!');
    }

    this.foundObjectIds.add(objectId);
    const pointsEarned = target.pointsReward;
    const pearlsEarned = target.isPearl ? 1 : 0;
    const requiredFoundCount = this.getRequiredFoundCount();
    const totalRequiredCount = this.getRequiredObjectsCount();
    const message = target.givesClueId
      ? `Ooh, a chest clue! +${pointsEarned} points.`
      : target.isPearl
        ? `Shiny pearl! +${pointsEarned} points.`
        : `Found ${target.name}! +${pointsEarned} points.`;

    return {
      success: true,
      object: target,
      message,
      pointsEarned,
      pearlsEarned,
      clueAwardedId: target.givesClueId,
      missionCompleted: requiredFoundCount >= totalRequiredCount,
      requiredFoundCount,
      totalRequiredCount,
    };
  }

  public reset(): void {
    this.foundObjectIds.clear();
  }

  private failure(object: LevelHiddenObject | null, message: string): DiscoveryResult {
    return {
      success: false,
      object,
      message,
      pointsEarned: 0,
      pearlsEarned: 0,
      missionCompleted: this.isMissionComplete(),
      requiredFoundCount: this.getRequiredFoundCount(),
      totalRequiredCount: this.getRequiredObjectsCount(),
    };
  }
}
