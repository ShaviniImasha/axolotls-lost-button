import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadSavedGame, saveGame } from '../../src/game/storage';

const storage = new Map<string, string>();

beforeEach(() => {
  storage.clear();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  });
});

describe('saved progress', () => {
  it('round-trips pearls, achievements, sound, and puzzle progress', () => {
    const game = {
      unlockedThrough: 2,
      stars: { 1: 3 },
      muted: true,
      pearls: 5,
      fishScore: 400,
      fishSolved: 4,
      pairsWins: 2,
      pairsBestMoves: 19,
      dailyClaimedOn: '2026-11-03',
      achievements: ['first-catch'],
    };
    expect(saveGame(game)).toEqual({ saved: true });
    expect(loadSavedGame()).toEqual({ game });
  });

  it('migrates valid earlier progress and rejects invalid stored values visibly', () => {
    storage.set('little-tide-save', JSON.stringify({
      version: 1,
      unlockedThrough: 1,
      stars: { 1: 2 },
      muted: false,
    }));
    expect(loadSavedGame().game).toMatchObject({
      pearls: 0,
      fishSolved: 0,
      stars: { 1: 2 },
    });

    storage.set('little-tide-save', '{"version":2,"pearls":-4}');
    expect(loadSavedGame().warning).toContain('Progress could not be loaded');
  });
});
