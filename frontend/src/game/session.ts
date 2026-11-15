import { attemptSwap, createBoard, TILE_TYPES, type Board, type Position, type TileType } from './board';
import type { LevelDefinition } from './levels';

export type LevelStatus = 'playing' | 'complete' | 'failed';

export interface LevelSession {
  levelId: number;
  board: Board;
  movesRemaining: number;
  score: number;
  collected: Partial<Record<TileType, number>>;
  status: LevelStatus;
  stars: number;
}

export type GameScreen =
  | { type: 'title' }
  | { type: 'level-select' }
  | { type: 'level'; session: LevelSession }
  | { type: 'paused'; session: LevelSession }
  | { type: 'level-complete'; session: LevelSession }
  | { type: 'level-failed'; session: LevelSession };

export type LevelMoveResult =
  | { session: LevelSession; valid: false; reason: 'out-of-bounds' | 'not-adjacent' | 'no-match' | 'level-ended'; cascades: 0 }
  | { session: LevelSession; valid: true; cascades: number };

export function createLevelSession(
  level: LevelDefinition,
  random: () => number = Math.random,
): LevelSession {
  return {
    levelId: level.id,
    board: createBoard(level.size, random),
    movesRemaining: level.moveLimit,
    score: 0,
    collected: {},
    status: 'playing',
    stars: 0,
  };
}

function meetsGoal(session: LevelSession, level: LevelDefinition): boolean {
  return (session.collected[level.goal.tile] ?? 0) >= level.goal.count;
}

function rateStars(score: number, thresholds: LevelDefinition['starThresholds']): number {
  if (score >= thresholds[2]) return 3;
  if (score >= thresholds[1]) return 2;
  return 1;
}

export function playLevelMove(
  session: LevelSession,
  level: LevelDefinition,
  first: Position,
  second: Position,
  random: () => number = Math.random,
): LevelMoveResult {
  if (session.status !== 'playing') {
    return { session, valid: false, reason: 'level-ended', cascades: 0 };
  }

  const move = attemptSwap(session.board, first, second, random);
  if (!move.valid) return { session, valid: false, reason: move.reason, cascades: 0 };

  const collected = { ...session.collected };
  for (const tile of TILE_TYPES) {
    const count = move.collected[tile];
    if (count !== undefined) collected[tile] = (collected[tile] ?? 0) + count;
  }
  const updated: LevelSession = {
    ...session,
    board: move.board,
    movesRemaining: session.movesRemaining - 1,
    score: session.score + move.score,
    collected,
    status: 'playing',
    stars: 0,
  };

  if (meetsGoal(updated, level)) {
    updated.status = 'complete';
    updated.stars = rateStars(updated.score, level.starThresholds);
  } else if (updated.movesRemaining <= 0) {
    updated.status = 'failed';
  }

  return { session: updated, valid: true, cascades: move.cascades };
}
