/**
 * Level Model
 * Model-View-Controller (MVC) - Model Layer
 * Manages adventure levels, realms, difficulty settings, and chest combinations.
 */

import {
  type AdventureLevelDefinition,
  type Difficulty,
  type LevelId,
  type RealmDefinition,
  type RealmId,
  REALMS,
  getAllLevels,
  getLevelById,
} from '../game/levelManager';

export class LevelModel {
  private currentLevel: AdventureLevelDefinition;

  constructor(initialLevelId: LevelId = 'pond-easy') {
    const level = getLevelById(initialLevelId);
    this.currentLevel = level || getAllLevels()[0];
  }

  public getCurrentLevel(): AdventureLevelDefinition {
    return this.currentLevel;
  }

  public setLevel(levelId: LevelId): boolean {
    const level = getLevelById(levelId);
    if (level) {
      this.currentLevel = level;
      return true;
    }
    return false;
  }

  public getRealm(): RealmDefinition {
    return this.currentLevel.realm;
  }

  public getDifficulty(): Difficulty {
    return this.currentLevel.difficulty;
  }

  public getChestCombination(): [number, number, number] {
    return [...this.currentLevel.chestCombination];
  }

  public getClues() {
    return [...this.currentLevel.clues];
  }

  public getAllLevels(): AdventureLevelDefinition[] {
    return getAllLevels();
  }

  public getNextLevel(): AdventureLevelDefinition | undefined {
    const all = getAllLevels();
    const currentIndex = all.findIndex((lvl) => lvl.id === this.currentLevel.id);
    if (currentIndex >= 0 && currentIndex < all.length - 1) {
      return all[currentIndex + 1];
    }
    return undefined;
  }

  public getRealms(): RealmDefinition[] {
    return REALMS;
  }

  public getLevelsForRealm(realmId: RealmId): AdventureLevelDefinition[] {
    return getAllLevels().filter((lvl) => lvl.realmId === realmId);
  }
}
