import { describe, expect, it } from 'vitest';
import { migrateSavedProgress } from '../../src/game/playerProgressManager';
import type { LevelId } from '../../src/game/levelManager';

describe('saved player progress migration', () => {
  it('maps legacy levels to the matching realm-difficulty IDs and initializes all nine records', () => {
    const migrated = migrateSavedProgress({
      currentLevel: 2 as unknown as LevelId,
      unlockedLevels: [1, 2] as unknown as LevelId[],
      completedLevels: [1, 2, 3] as unknown as LevelId[],
    });

    expect(migrated.currentLevel).toBe('coral-medium');
    expect(migrated.completedLevels).toEqual(['pond-easy', 'coral-medium', 'cave-hard']);
    expect(migrated.unlockedLevels).toContain('pond-medium');
    expect(Object.keys(migrated.levelProgress)).toHaveLength(9);
    expect(migrated.levelProgress['pond-easy']).toEqual({ bestScore: 0 });
  });

  it('preserves valid per-level best scores while ignoring invalid values', () => {
    const migrated = migrateSavedProgress({
      levelProgress: {
        'pond-easy': { bestScore: 125 },
        'cave-hard': { bestScore: Number.NaN },
      } as Record<LevelId, { bestScore: number }>,
    });

    expect(migrated.levelProgress['pond-easy'].bestScore).toBe(125);
    expect(migrated.levelProgress['cave-hard'].bestScore).toBe(0);
  });
});
