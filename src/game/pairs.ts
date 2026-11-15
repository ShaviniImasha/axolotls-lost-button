import { TILE_TYPES, type TileType } from './board';

export interface PairCard {
  id: number;
  tile: TileType;
  flipped: boolean;
  matched: boolean;
}

export interface PairsGame {
  cards: PairCard[];
  moves: number;
  matches: number;
  score: number;
  startedAt: number | null;
  finishedAt: number | null;
}

export function createPairsGame(random: () => number = Math.random): PairsGame {
  const selected = TILE_TYPES.slice(0, 8);
  const doubled = [...selected, ...selected];
  for (let index = doubled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [doubled[index], doubled[swapIndex]] = [doubled[swapIndex], doubled[index]];
  }

  return {
    cards: doubled.map((tile, id) => ({ id, tile, flipped: false, matched: false })),
    moves: 0,
    matches: 0,
    score: 0,
    startedAt: null,
    finishedAt: null,
  };
}

export function flipPairCard(game: PairsGame, cardId: number, now: number): PairsGame {
  if (game.finishedAt !== null || !Number.isInteger(cardId)) return game;
  const card = game.cards.find((candidate) => candidate.id === cardId);
  if (!card || card.flipped || card.matched || game.cards.filter((candidate) => candidate.flipped && !candidate.matched).length >= 2) {
    return game;
  }

  return {
    ...game,
    startedAt: game.startedAt ?? now,
    cards: game.cards.map((candidate) =>
      candidate.id === cardId ? { ...candidate, flipped: true } : candidate,
    ),
  };
}

export function resolvePairTurn(game: PairsGame, now: number): PairsGame {
  const flipped = game.cards.filter((card) => card.flipped && !card.matched);
  if (flipped.length !== 2) return game;
  const isMatch = flipped[0].tile === flipped[1].tile;
  const matches = game.matches + (isMatch ? 1 : 0);
  const finished = matches === game.cards.length / 2;
  return {
    ...game,
    moves: game.moves + 1,
    matches,
    score: game.score + (isMatch ? 100 : 0),
    finishedAt: finished ? now : null,
    cards: game.cards.map((card) =>
      flipped.some((shown) => shown.id === card.id)
        ? { ...card, flipped: isMatch, matched: isMatch }
        : card,
    ),
  };
}

export function elapsedSeconds(game: PairsGame, now: number): number {
  if (game.startedAt === null) return 0;
  return Math.floor(((game.finishedAt ?? now) - game.startedAt) / 1000);
}
