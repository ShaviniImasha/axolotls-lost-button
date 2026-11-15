import type { TileType } from './board';

export interface LevelDefinition {
  id: number;
  title: string;
  size: number;
  moveLimit: number;
  starThresholds: readonly [number, number, number];
  goal: { tile: TileType; count: number };
}

export const LEVELS: readonly LevelDefinition[] = [
  { id: 1, title: 'Shallow Reef', size: 8, moveLimit: 18, starThresholds: [900, 1600, 2500], goal: { tile: 'fish-mint', count: 12 } },
  { id: 2, title: 'Shell Cove', size: 8, moveLimit: 18, starThresholds: [1000, 1800, 2700], goal: { tile: 'shell-scallop', count: 14 } },
  { id: 3, title: 'Coral Garden', size: 8, moveLimit: 17, starThresholds: [1100, 1900, 2900], goal: { tile: 'coral-branch', count: 15 } },
  { id: 4, title: 'Starfish Bay', size: 8, moveLimit: 17, starThresholds: [1200, 2100, 3100], goal: { tile: 'starfish', count: 16 } },
  { id: 5, title: 'Jellyfish Lagoon', size: 8, moveLimit: 16, starThresholds: [1300, 2200, 3300], goal: { tile: 'fish-lavender', count: 18 } },
  { id: 6, title: 'Pearl Paradise', size: 8, moveLimit: 16, starThresholds: [1400, 2400, 3500], goal: { tile: 'shell-spiral', count: 20 } },
];
