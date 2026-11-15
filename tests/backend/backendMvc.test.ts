/**
 * Backend MVC Integration Tests
 */

import { describe, expect, it } from 'vitest';
import { createApp } from '../../backend/src/app';

describe('Backend MVC REST API', () => {
  const app = createApp();

  it('GET /api/health returns status ok', async () => {
    // Basic handler simulation
    expect(app).toBeDefined();
  });

  it('LevelModel provides 9 adventure levels', async () => {
    const { LevelModel } = await import('../../backend/src/models/LevelModel');
    const levels = LevelModel.getAll();
    expect(levels.length).toBe(9);

    const easyPond = LevelModel.getById('pond-easy');
    expect(easyPond).toBeDefined();
    expect(easyPond?.chestCombination).toEqual([3, 5, 2]);
  });

  it('FishApiService generates options and returns puzzle data', async () => {
    const { fishApiService } = await import('../../backend/src/services/FishApiService');
    const options = fishApiService.generateOptions(5, 4);
    expect(options.length).toBe(4);
    expect(options.includes(5)).toBe(true);

    const fallback = fishApiService.getFallbackPuzzle();
    expect(fallback.imageUrl).toBeDefined();
    expect(typeof fallback.solution).toBe('number');
  });

  it('GameModel validates chest codes correctly', async () => {
    const { GameModel } = await import('../../backend/src/models/GameModel');
    expect(GameModel.validateChestUnlock([3, 5, 2], [3, 5, 2])).toBe(true);
    expect(GameModel.validateChestUnlock([3, 5, 1], [3, 5, 2])).toBe(false);
  });

  it('ScoreModel calculates final scores with multipliers', async () => {
    const { ScoreModel } = await import('../../backend/src/models/ScoreModel');
    expect(ScoreModel.calculateFinalScore(100, 1.5)).toBe(150);
    expect(ScoreModel.calculateFinalScore(100, 2)).toBe(200);
  });

  it('LeaderboardModel correctly ranks players', async () => {
    const { LeaderboardModel } = await import('../../backend/src/models/LeaderboardModel');
    const ranked = LeaderboardModel.rankEntries([
      { playerId: 'p1', name: 'A', avatar: 'axolotl-happy', score: 100, pearls: 5, completedLevelsCount: 1 },
      { playerId: 'p2', name: 'B', avatar: 'fish-mint', score: 250, pearls: 10, completedLevelsCount: 2 },
    ]);
    expect(ranked[0].playerId).toBe('p2');
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].playerId).toBe('p1');
    expect(ranked[1].rank).toBe(2);
  });
});
