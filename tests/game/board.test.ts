import { describe, expect, it } from 'vitest';
import { attemptSwap, createBoard, findHint, findMatches, resolveMatches, TILE_TYPES, type Board } from '../../src/game/board';

const noMatchesBoard: Board = [
  ['fish-mint', 'fish-lavender', 'fish-peach'],
  ['fish-lavender', 'fish-peach', 'shell-scallop'],
  ['fish-peach', 'shell-scallop', 'shell-spiral'],
];

describe('board logic', () => {
  it('creates an 8 by 8 board without automatic matches', () => {
    const board = createBoard(8, () => 0.4);
    expect(board).toHaveLength(8);
    expect(board.every((row) => row.length === 8)).toBe(true);
    expect(findMatches(board)).toEqual([]);
    expect(board.flat().every((tile) => TILE_TYPES.includes(tile))).toBe(true);
  });

  it('finds horizontal and vertical matches without counting intersections twice', () => {
    const board: Board = [
      ['fish-mint', 'fish-mint', 'fish-mint'],
      ['fish-mint', 'shell-scallop', 'fish-peach'],
      ['fish-mint', 'shell-spiral', 'starfish'],
    ];
    expect(findMatches(board)).toHaveLength(5);
  });

  it('rejects non-adjacent swaps without changing the board', () => {
    const result = attemptSwap(noMatchesBoard, { row: 0, column: 0 }, { row: 2, column: 2 });
    expect(result).toMatchObject({ valid: false, reason: 'not-adjacent' });
    expect(noMatchesBoard[0][0]).toBe('fish-mint');
  });

  it('accepts a swap that creates a match and scores it', () => {
    const board: Board = [
      ['fish-mint', 'fish-lavender', 'fish-mint'],
      ['fish-lavender', 'fish-mint', 'fish-lavender'],
      ['fish-peach', 'shell-scallop', 'shell-spiral'],
    ];
    const result = attemptSwap(board, { row: 0, column: 1 }, { row: 1, column: 1 }, () => 0.7);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.matched).toBeGreaterThanOrEqual(3);
      expect(result.score).toBeGreaterThanOrEqual(300);
      expect(findMatches(result.board)).toEqual([]);
    }
    expect(board[0][1]).toBe('fish-lavender');
  });

  it('finds a legal hint without changing the board', () => {
    const board: Board = [
      ['fish-mint', 'fish-lavender', 'fish-mint'],
      ['fish-lavender', 'fish-mint', 'fish-lavender'],
      ['fish-peach', 'shell-scallop', 'shell-spiral'],
    ];
    const hint = findHint(board);
    expect(hint).not.toBeNull();
    if (hint) {
      expect(attemptSwap(board, hint.first, hint.second, () => 0.5).valid).toBe(true);
    }
    expect(board[0][1]).toBe('fish-lavender');
  });

  it('resolves falling matches as cascades and counts collected tiles', () => {
    const board: Board = [
      ['fish-mint', 'fish-lavender', 'fish-peach'],
      ['shell-scallop', 'shell-scallop', 'shell-scallop'],
      ['fish-mint', 'fish-peach', 'fish-peach'],
      ['fish-mint', 'fish-peach', 'fish-peach'],
    ];
    const result = resolveMatches(board, () => 0.5);

    expect(result.cascades).toBeGreaterThanOrEqual(2);
    expect(result.collected['shell-scallop']).toBe(3);
    expect(result.collected['fish-mint']).toBeGreaterThanOrEqual(3);
    expect(result.score).toBe(result.matched * 100 + (result.cascades - 1) * 250);
    expect(findMatches(result.board)).toEqual([]);
  });
});
