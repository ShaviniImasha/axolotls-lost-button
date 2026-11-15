/**
 * Score Controller
 * Model-View-Controller (MVC) - Controller Layer
 * Coordinates scoring calculations, action point deltas, bonuses, and persistence.
 */

import { ScoreModel, type ScoreBreakdown } from '../models/ScoreModel';
import { scoreRepository } from '../repositories/ScoreRepository';
import type { ScoreAction } from '../game/scoringSystem';
import type { Difficulty } from '../game/levelManager';
import { audioService } from '../services/audioService';

export class ScoreController {
  private scoreModel: ScoreModel;

  constructor(scoreModel?: ScoreModel) {
    this.scoreModel = scoreModel || new ScoreModel(0);
  }

  public setModel(model: ScoreModel): void {
    this.scoreModel = model;
  }

  public getModel(): ScoreModel {
    return this.scoreModel;
  }

  public getScore(): number {
    return this.scoreModel.getScore();
  }

  /**
   * Process in-game score actions (fish puzzle, item found, chest open)
   */
  public handleScoreAction(action: ScoreAction): { delta: number; newScore: number } {
    const result = this.scoreModel.applyAction(action);
    if (result.delta > 0) {
      audioService.play('bubble');
    }
    return result;
  }

  /**
   * Finalize score upon level completion with difficulty multiplier
   */
  public finalizeLevelScore(difficulty: Difficulty): ScoreBreakdown {
    this.scoreModel.finalizeScore(difficulty);
    return this.scoreModel.getBreakdown(difficulty);
  }

  /**
   * Record score to repository
   */
  public async persistScore(userId: string, username: string, avatar: string, levelId: string, totalScore: number, completedCount: number): Promise<void> {
    await scoreRepository.submitScore({
      userId,
      username,
      avatar,
      score: this.scoreModel.getScore(),
      levelId,
      totalScore,
      completedLevelsCount: completedCount,
    });
  }

  public reset(): void {
    this.scoreModel.reset();
  }
}

export const scoreController = new ScoreController();
