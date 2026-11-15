/**
 * Score Model
 * Model-View-Controller (MVC) - Model Layer
 * Manages player scoring logic, multiplier calculations, action point deltas, and score breakdown.
 */

import type { Difficulty, DifficultySettings } from '../game/levelManager';
import {
  DIFFICULTY_MULTIPLIERS,
  DIFFICULTY_MULTIPLIER_ENABLED,
  type ScoreAction,
  SCORE_VALUES,
} from '../game/scoringSystem';

export interface ScoreBreakdown {
  rawScore: number;
  multiplier: number;
  finalScore: number;
  timeBonus: number;
  foundItemsBonus: number;
  chestBonus: number;
}

export class ScoreModel {
  private currentScore: number;
  private scoreHistory: Array<{ action: ScoreAction; delta: number; timestamp: number }> = [];

  constructor(initialScore = 0) {
    this.currentScore = Math.max(0, initialScore);
  }

  public getScore(): number {
    return this.currentScore;
  }

  public setScore(score: number): void {
    this.currentScore = Math.max(0, score);
  }

  public applyAction(action: ScoreAction): { delta: number; newScore: number } {
    const delta = SCORE_VALUES[action] ?? 0;
    this.currentScore = Math.max(0, this.currentScore + delta);
    this.scoreHistory.push({ action, delta, timestamp: Date.now() });
    return { delta, newScore: this.currentScore };
  }

  public finalizeScore(
    difficulty: Difficulty | Pick<DifficultySettings, 'scoreMultiplier'>,
    multiplierEnabled = DIFFICULTY_MULTIPLIER_ENABLED,
  ): number {
    if (multiplierEnabled) {
      const multiplier =
        typeof difficulty === 'string'
          ? (DIFFICULTY_MULTIPLIERS[difficulty as Difficulty] ?? 1)
          : difficulty.scoreMultiplier;
      this.currentScore = Math.max(0, Math.round(this.currentScore * multiplier));
    }
    return this.currentScore;
  }

  public getBreakdown(difficulty: Difficulty): ScoreBreakdown {
    const multiplier = DIFFICULTY_MULTIPLIERS[difficulty] ?? 1;
    return {
      rawScore: this.currentScore,
      multiplier,
      finalScore: Math.round(this.currentScore * multiplier),
      timeBonus: 0,
      foundItemsBonus: this.scoreHistory.filter((h) => h.action.startsWith('find')).reduce((s, h) => s + h.delta, 0),
      chestBonus: SCORE_VALUES['level-complete'],
    };
  }

  public getHistory() {
    return [...this.scoreHistory];
  }

  public reset(): void {
    this.currentScore = 0;
    this.scoreHistory = [];
  }
}
