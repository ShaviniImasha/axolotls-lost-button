import { describe, expect, it } from 'vitest';
import { createPairsGame, elapsedSeconds, flipPairCard, resolvePairTurn } from '../../src/game/pairs';

describe('matching-pairs game', () => {
  it('creates a shuffled deck with exactly two of each creature', () => {
    const game = createPairsGame(() => 0.4);
    expect(game.cards).toHaveLength(16);
    expect(new Set(game.cards.map((card) => card.tile)).size).toBe(8);
    expect(game.cards.filter((card) => card.tile === 'fish-lavender')).toHaveLength(2);
  });

  it('scores matching pairs and completes after all pairs are found', () => {
    let game = createPairsGame(() => 0.2);
    const first = game.cards[0];
    const partner = game.cards.find((card) => card.id !== first.id && card.tile === first.tile);
    expect(partner).toBeDefined();
    if (!partner) return;

    game = flipPairCard(game, first.id, 1000);
    game = flipPairCard(game, partner.id, 1100);
    game = resolvePairTurn(game, 1200);
    expect(game.matches).toBe(1);
    expect(game.score).toBe(100);
    expect(game.moves).toBe(1);
    expect(game.cards.filter((card) => card.matched)).toHaveLength(2);
    expect(elapsedSeconds(game, 5000)).toBe(4);
  });
});
