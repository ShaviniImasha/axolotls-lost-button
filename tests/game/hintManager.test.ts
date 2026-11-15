import { describe, expect, it } from 'vitest';
import { HintManager } from '../../src/game/hintManager';

describe('HintManager', () => {
  it('respects maximum hints and provides object coordinates', () => {
    const hintManager = new HintManager(2);
    expect(hintManager.getHintsRemaining()).toBe(2);

    const unfound = [
      { id: 'item-1', name: 'Pearl', x: 20, y: 30, required: true },
      { id: 'item-2', name: 'Starfish', x: 50, y: 70, required: false },
    ];

    const h1 = hintManager.requestHint(unfound, 1);
    expect(h1.success).toBe(true);
    expect(h1.type).toBe('object-location');
    expect(h1.targetObjectId).toBe('item-1');
    expect(h1.targetCoords).toEqual({ x: 20, y: 30 });
    expect(h1.hintsRemaining).toBe(1);

    const h2 = hintManager.requestHint([], 1);
    expect(h2.success).toBe(true);
    expect(h2.type).toBe('clue-guidance');
    expect(h2.hintsRemaining).toBe(0);

    const h3 = hintManager.requestHint([], 0);
    expect(h3.success).toBe(false);
    expect(h3.hintsRemaining).toBe(0);
  });
});

