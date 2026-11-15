import { describe, expect, it } from 'vitest';
import { TreasureChestLogic } from '../../src/game/treasureChestLogic';
import { getLevel } from '../../src/game/levelManager';

describe('TreasureChestLogic', () => {
  it('manages combination dials and checks unlock condition', () => {
    const level = getLevel('pond', 'easy');
    const chest = new TreasureChestLogic(level);

    expect(chest.isChestAvailable()).toBe(false);

    // Add clues
    chest.addClue(level.clues[0].id);
    expect(chest.isChestAvailable()).toBe(false);

    chest.addClue(level.clues[1].id);
    expect(chest.isChestAvailable()).toBe(true);

    // Initial code is [0, 0, 0]
    expect(chest.getCurrentCode()).toEqual([0, 0, 0]);
    const attemptFail = chest.tryUnlock();
    expect(attemptFail.success).toBe(false);
    expect(attemptFail.buttonFound).toBe(false);

    // Adjust dials to 3, 5, 2
    chest.setDial(0, 3);
    chest.setDial(1, 5);
    chest.setDial(2, 2);
    expect(chest.getCurrentCode()).toEqual([3, 5, 2]);

    const attemptSuccess = chest.tryUnlock();
    expect(attemptSuccess.success).toBe(true);
    expect(attemptSuccess.buttonFound).toBe(true);
    expect(chest.isChestUnlocked()).toBe(true);
  });

  it('cycles dials seamlessly between 0 and 9', () => {
    const chest = new TreasureChestLogic(getLevel('coral', 'medium'));
    chest.setDial(0, 9);
    expect(chest.adjustDial(0, 1)).toBe(0); // 9 + 1 -> 0
    expect(chest.adjustDial(0, -1)).toBe(9); // 0 - 1 -> 9
  });
});
