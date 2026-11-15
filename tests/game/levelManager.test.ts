import { describe, expect, it } from 'vitest';
import {
  ADVENTURE_LEVELS,
  DIFFICULTY_SETTINGS,
  LevelManager,
  buildLevelId,
  getLevel,
  getLevelById,
  getRequiredLevelToUnlock,
  isLevelUnlockedByRules,
  parseLevelId,
} from '../../src/game/levelManager';

describe('realm and difficulty levels', () => {
  it('builds and parses valid IDs and rejects invalid IDs', () => {
    expect(buildLevelId('pond', 'easy')).toBe('pond-easy');
    expect(parseLevelId('cave-hard')).toEqual({ realmId: 'cave', difficulty: 'hard' });
    expect(parseLevelId('pond-expert')).toBeUndefined();
  });

  it('resolves all nine realm and difficulty combinations', () => {
    expect(ADVENTURE_LEVELS.map((level) => level.id)).toEqual([
      'pond-easy', 'pond-medium', 'pond-hard',
      'coral-easy', 'coral-medium', 'coral-hard',
      'cave-easy', 'cave-medium', 'cave-hard',
    ]);
    expect(ADVENTURE_LEVELS).toHaveLength(9);
    for (const level of ADVENTURE_LEVELS) {
      expect(getLevelById(level.id)).toEqual(level);
      expect(level.realm.name).toBeTruthy();
      expect(level.difficultySettings.timeLimit).toBe(DIFFICULTY_SETTINGS[level.difficulty].timeLimit);
    }
    expect(getLevel('pond', 'hard').difficulty).toBe('hard');
    expect(getLevel('cave', 'easy').realm.name).toBe('Enchanted Treasure Cave');
  });

  it('shares progressively harder settings across every realm', () => {
    for (const realm of ['pond', 'coral', 'cave'] as const) {
      const easy = getLevel(realm, 'easy').difficultySettings;
      const medium = getLevel(realm, 'medium').difficultySettings;
      const hard = getLevel(realm, 'hard').difficultySettings;
      expect(easy.timeLimit).toBeGreaterThan(medium.timeLimit);
      expect(medium.timeLimit).toBeGreaterThan(hard.timeLimit);
      expect(easy.hiddenObjectCount).toBeLessThan(medium.hiddenObjectCount);
      expect(medium.hiddenObjectCount).toBeLessThan(hard.hiddenObjectCount);
      expect(easy.maxHints).toBeGreaterThan(medium.maxHints);
      expect(medium.maxHints).toBeGreaterThan(hard.maxHints);
      expect(easy.fishPuzzleComplexity.answerOptionCount).toBeLessThan(hard.fishPuzzleComplexity.answerOptionCount);
    }
  });

  it('applies the realm and difficulty unlock prerequisites in one rule', () => {
    expect(getRequiredLevelToUnlock('pond-easy')).toBeNull();
    expect(getRequiredLevelToUnlock('pond-medium')).toBe('pond-easy');
    expect(getRequiredLevelToUnlock('pond-hard')).toBe('pond-medium');
    expect(getRequiredLevelToUnlock('coral-easy')).toBe('pond-easy');
    expect(getRequiredLevelToUnlock('cave-easy')).toBe('coral-easy');
    expect(isLevelUnlockedByRules('pond-easy', [])).toBe(true);
    expect(isLevelUnlockedByRules('pond-medium', ['pond-easy'])).toBe(true);
    expect(isLevelUnlockedByRules('pond-hard', ['pond-easy'])).toBe(false);
  });

  it('unlocks the same-realm next difficulty and next-realm Easy after completion', () => {
    const manager = new LevelManager();
    expect(manager.getUnlockedLevels()).toEqual(['pond-easy']);
    expect(manager.setCurrentLevelId('pond-easy')).toBe(true);

    const easyComplete = manager.completeCurrentLevel();
    expect(easyComplete.nextLevelId).toBe('pond-medium');
    expect(manager.isLevelCompleted('pond-easy')).toBe(true);
    expect(manager.isLevelUnlocked('pond-medium')).toBe(true);
    expect(manager.isLevelUnlocked('coral-easy')).toBe(true);
    expect(manager.isLevelUnlocked('pond-hard')).toBe(false);

    manager.setCurrentLevelId('pond-medium');
    const mediumComplete = manager.completeCurrentLevel();
    expect(mediumComplete.nextLevelId).toBe('pond-hard');
    expect(manager.isLevelUnlocked('pond-hard')).toBe(true);
  });
});
