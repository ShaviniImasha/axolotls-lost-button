/**
 * Level Controller
 * Model-View-Controller (MVC) - Controller Layer
 * Coordinates level selection, realm navigation, unlocks, and progression.
 */

import { LevelModel } from '../models/LevelModel';
import { ProgressModel } from '../models/ProgressModel';
import { progressRepository } from '../repositories/ProgressRepository';
import type { AdventureLevelDefinition, Difficulty, LevelId, RealmId } from '../game/levelManager';

export class LevelController {
  private levelModel: LevelModel;
  private progressModel: ProgressModel;

  constructor(levelModel?: LevelModel, progressModel?: ProgressModel) {
    this.levelModel = levelModel || new LevelModel();
    this.progressModel = progressModel || new ProgressModel();
  }

  public setLevel(levelId: LevelId): boolean {
    return this.levelModel.setLevel(levelId);
  }

  public getCurrentLevel(): AdventureLevelDefinition {
    return this.levelModel.getCurrentLevel();
  }

  public getLevelsForRealm(realmId: RealmId): AdventureLevelDefinition[] {
    return this.levelModel.getLevelsForRealm(realmId);
  }

  public isLevelUnlocked(levelId: LevelId): boolean {
    return this.progressModel.isUnlocked(levelId);
  }

  public isLevelCompleted(levelId: LevelId): boolean {
    return this.progressModel.isCompleted(levelId);
  }

  public async completeLevel(levelId: LevelId, score: number, pearls: number, userId: string): Promise<void> {
    this.progressModel.recordLevelCompletion(levelId, score, pearls);
    await progressRepository.saveProgress(userId, this.progressModel.getState());
  }

  public getProgressModel(): ProgressModel {
    return this.progressModel;
  }

  public getLevelModel(): LevelModel {
    return this.levelModel;
  }
}

export const levelController = new LevelController();
