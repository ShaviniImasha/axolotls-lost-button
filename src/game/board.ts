export const TILE_TYPES = [
  'fish-lavender',
  'fish-mint',
  'fish-peach',
  'shell-scallop',
  'shell-spiral',
  'coral-branch',
  'coral-fan',
  'starfish',
] as const;

export type TileType = (typeof TILE_TYPES)[number];
export type Board = TileType[][];
type WorkingBoard = Array<Array<TileType | null>>;

export interface Position {
  row: number;
  column: number;
}

export type MatchCounts = Partial<Record<TileType, number>>;

export interface MatchResolution {
  board: Board;
  cascades: number;
  matched: number;
  collected: MatchCounts;
  score: number;
}

export type MoveAttempt =
  | { valid: false; reason: 'out-of-bounds' | 'not-adjacent' | 'no-match'; board: Board }
  | ({ valid: true } & MatchResolution);

function isInside(board: ReadonlyArray<ReadonlyArray<TileType | null>>, position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < board.length &&
    position.column >= 0 &&
    position.column < board[position.row].length
  );
}

function wouldMakeMatch(
  board: ReadonlyArray<ReadonlyArray<TileType | null>>,
  position: Position,
  tile: TileType,
): boolean {
  const countInDirection = (rowStep: number, columnStep: number): number => {
    let count = 0;
    let row = position.row + rowStep;
    let column = position.column + columnStep;

    while (board[row]?.[column] === tile) {
      count += 1;
      row += rowStep;
      column += columnStep;
    }

    return count;
  };

  return (
    countInDirection(0, -1) + countInDirection(0, 1) >= 2 ||
    countInDirection(-1, 0) + countInDirection(1, 0) >= 2
  );
}

export function createBoard(size = 8, random: () => number = Math.random): Board {
  if (!Number.isInteger(size) || size < 3) {
    throw new RangeError('Board size must be an integer of at least 3.');
  }

  const board: WorkingBoard = Array.from({ length: size }, () => Array<TileType | null>(size).fill(null));
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      const available = TILE_TYPES.filter((tile) => !wouldMakeMatch(board, { row, column }, tile));
      if (available.length === 0) throw new Error('Unable to generate a match-free board.');
      const choice = Math.min(available.length - 1, Math.floor(random() * available.length));
      board[row][column] = available[choice];
    }
  }

  return board.map((row) =>
    row.map((tile) => {
      if (tile === null) throw new Error('Board generation left an empty tile.');
      return tile;
    }),
  );
}

export function findMatches(board: ReadonlyArray<ReadonlyArray<TileType | null>>): Position[] {
  const matches = new Map<string, Position>();
  const addRun = (positions: Position[]): void => {
    if (positions.length >= 3) {
      for (const position of positions) {
        matches.set(`${position.row}:${position.column}`, position);
      }
    }
  };

  for (let row = 0; row < board.length; row += 1) {
    let start = 0;
    while (start < board[row].length) {
      const tile = board[row][start];
      let end = start + 1;
      while (tile !== null && board[row][end] === tile) end += 1;
      addRun(Array.from({ length: end - start }, (_, offset) => ({ row, column: start + offset })));
      start = end;
    }
  }

  for (let column = 0; column < (board[0]?.length ?? 0); column += 1) {
    let start = 0;
    while (start < board.length) {
      const tile = board[start][column];
      let end = start + 1;
      while (tile !== null && board[end]?.[column] === tile) end += 1;
      addRun(Array.from({ length: end - start }, (_, offset) => ({ row: start + offset, column })));
      start = end;
    }
  }

  return [...matches.values()];
}

function collapseAndRefill(board: WorkingBoard, random: () => number): void {
  for (let column = 0; column < board[0].length; column += 1) {
    const remaining = board.map((row) => row[column]).filter((tile): tile is TileType => tile !== null);
    const emptyCount = board.length - remaining.length;
    for (let row = 0; row < emptyCount; row += 1) board[row][column] = null;
    for (let index = 0; index < remaining.length; index += 1) {
      board[emptyCount + index][column] = remaining[index];
    }
  }

  for (let row = 0; row < board.length; row += 1) {
    for (let column = 0; column < board[row].length; column += 1) {
      if (board[row][column] !== null) continue;
      const position = { row, column };
      const available = TILE_TYPES.filter((tile) => !wouldMakeMatch(board, position, tile));
      if (available.length === 0) throw new Error('Unable to refill the board without creating a match.');
      const choice = Math.min(available.length - 1, Math.floor(random() * available.length));
      board[row][column] = available[choice];
    }
  }
}

export function resolveMatches(board: Board, random: () => number = Math.random): MatchResolution {
  const nextBoard: WorkingBoard = board.map((row) => row.map((tile) => tile));
  const collected: MatchCounts = {};
  let cascades = 0;
  let matched = 0;

  while (true) {
    const matches = findMatches(nextBoard);
    if (matches.length === 0) break;

    cascades += 1;
    matched += matches.length;
    for (const position of matches) {
      const tile = nextBoard[position.row][position.column];
      if (tile === null) throw new Error('Match resolution encountered an empty tile.');
      collected[tile] = (collected[tile] ?? 0) + 1;
      nextBoard[position.row][position.column] = null;
    }
    collapseAndRefill(nextBoard, random);
  }

  return {
    board: nextBoard.map((row) =>
      row.map((tile) => {
        if (tile === null) throw new Error('Match resolution left an empty tile.');
        return tile;
      }),
    ),
    cascades,
    matched,
    collected,
    score: matched * 100 + Math.max(0, cascades - 1) * 250,
  };
}

export function attemptSwap(
  board: Board,
  first: Position,
  second: Position,
  random: () => number = Math.random,
): MoveAttempt {
  if (!isInside(board, first) || !isInside(board, second)) {
    return { valid: false, reason: 'out-of-bounds', board };
  }
  if (Math.abs(first.row - second.row) + Math.abs(first.column - second.column) !== 1) {
    return { valid: false, reason: 'not-adjacent', board };
  }

  const swapped = board.map((row) => [...row]);
  [swapped[first.row][first.column], swapped[second.row][second.column]] = [
    swapped[second.row][second.column],
    swapped[first.row][first.column],
  ];
  if (findMatches(swapped).length === 0) {
    return { valid: false, reason: 'no-match', board };
  }

  return { valid: true, ...resolveMatches(swapped, random) };
}

export function findHint(board: Board): { first: Position; second: Position } | null {
  for (let row = 0; row < board.length; row += 1) {
    for (let column = 0; column < board[row].length; column += 1) {
      const first = { row, column };
      for (const second of [{ row, column: column + 1 }, { row: row + 1, column }]) {
        if (!isInside(board, second)) continue;
        const swapped = board.map((line) => [...line]);
        [swapped[first.row][first.column], swapped[second.row][second.column]] = [
          swapped[second.row][second.column],
          swapped[first.row][first.column],
        ];
        if (findMatches(swapped).length > 0) return { first, second };
      }
    }
  }
  return null;
}
