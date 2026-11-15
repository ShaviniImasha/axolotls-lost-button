import { describe, expect, it } from 'vitest';
import { LEVELS } from '../../src/game/levels';
import { createLevelSession, playLevelMove } from '../../src/game/session';
import type { Board } from '../../src/game/board';

const matchBoard: Board = [
  ['fish-mint', 'fish-lavender', 'fish-mint'],
  ['fish-lavender', 'fish-mint', 'fish-lavender'],
  ['fish-peach', 'shell-scallop', 'shell-spiral'],
];

describe('level sessions', () => {
  it('starts with the configured board and move limit', () => {
    const session = createLevelSession(LEVELS[0], () => 0.5);
    expect(session.board).toHaveLength(8);
    expect(session.movesRemaining).toBe(LEVELS[0].moveLimit);
    expect(session.status).toBe('playing');
  });

  it('does not consume a move for an invalid swap', () => {
    const level = LEVELS[0];
    const session = createLevelSession(level, () => 0.5);
    const result = playLevelMove(
      session,
      level,
      { row: 0, column: 0 },
      { row: 0, column: 2 },
      () => 0.5,
    );
    expect(result.valid).toBe(false);
    expect(result.session.movesRemaining).toBe(level.moveLimit);
  });

  it('updates goals, score, and stars when a move completes the level', () => {
    const level = {
      ...LEVELS[0],
      size: 3,
      moveLimit: 3,
      starThresholds: [200, 300, 100000] as const,
      goal: { tile: 'fish-mint' as const, count: 3 },
    };
    const session = { ...createLevelSession(level, () => 0.5), board: matchBoard };
    const result = playLevelMove(
      session,
      level,
      { row: 0, column: 1 },
      { row: 1, column: 1 },
      () => 0.7,
    );

    expect(result.valid).toBe(true);
    expect(result.session.status).toBe('complete');
    expect(result.session.collected['fish-mint']).toBeGreaterThanOrEqual(3);
    expect(result.session.score).toBeGreaterThanOrEqual(300);
    expect(result.session.stars).toBe(2);
    expect(result.session.movesRemaining).toBe(2);
    expect(session.board).toEqual(matchBoard);
  });

  it('fails when the last move does not meet the goal', () => {
    const level = {
      ...LEVELS[0],
      size: 3,
      moveLimit: 1,
      goal: { tile: 'starfish' as const, count: 1 },
    };
    const session = { ...createLevelSession(level, () => 0.5), board: matchBoard };
    const result = playLevelMove(
      session,
      level,
      { row: 0, column: 1 },
      { row: 1, column: 1 },
      () => 0.7,
    );

    expect(result.session.status).toBe('failed');
    expect(result.session.movesRemaining).toBe(0);
  });
});
