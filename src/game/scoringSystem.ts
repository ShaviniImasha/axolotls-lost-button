import type { Difficulty, DifficultySettings } from './levelManager';
// ScoringSystem manages the player's score during a level, 
// applying score changes based on actions and finalizing the score with difficulty multipliers.

export type ScoreAction =
  | 'fish-correct'
  | 'fish-incorrect'
  | 'find-normal'
  | 'find-treasure'
  | 'level-complete';

export const SCORE_VALUES: Record<ScoreAction, number> = {
  'fish-correct': 10,
  'fish-incorrect': -5,
  'find-normal': 5,
  'find-treasure': 10,
  'level-complete': 30,
};

export const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
  easy: 1,
  medium: 1.5,
  hard: 2,
};

export const DIFFICULTY_MULTIPLIER_ENABLED = true;

export class ScoringSystem {
  private currentScore: number;

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
    const delta = SCORE_VALUES[action];
    this.currentScore = Math.max(0, this.currentScore + delta);
    return { delta, newScore: this.currentScore };
  }

  public finalizeScore(
    difficulty: Difficulty | Pick<DifficultySettings, 'scoreMultiplier'>,
    multiplierEnabled = DIFFICULTY_MULTIPLIER_ENABLED,
  ): number {
    if (multiplierEnabled) {
      const multiplier =
        typeof difficulty === 'string' ? DIFFICULTY_MULTIPLIERS[difficulty] : difficulty.scoreMultiplier;
      this.currentScore = Math.max(0, Math.round(this.currentScore * multiplier));
    }
    return this.currentScore;
  }

  public reset(): void {
    this.currentScore = 0;
  }
}
