/**
 * Score Model
 * Backend MVC - Model Layer
 */

export class ScoreModel {
  public static calculateFinalScore(rawScore: number, multiplier: number): number {
    return Math.max(0, Math.round(rawScore * multiplier));
  }

  public static calculateAccuracy(foundCount: number, totalClicks: number): number {
    if (totalClicks <= 0) return 100;
    return Math.min(100, Math.round((foundCount / totalClicks) * 100));
  }
}
