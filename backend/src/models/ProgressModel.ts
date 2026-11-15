/**
 * Progress Model
 * Backend MVC - Model Layer
 */

export interface PlayerProgress {
  userId: string;
  completedLevels: string[];
  totalScore: number;
  collectedPearls: number;
}

export class ProgressModel {
  public static isLevelUnlocked(levelId: string, completedLevels: string[]): boolean {
    if (levelId === 'pond-easy') return true;
    const parts = levelId.split('-');
    const difficulty = parts[1];
    if (difficulty === 'medium') return completedLevels.includes(`${parts[0]}-easy`);
    if (difficulty === 'hard') return completedLevels.includes(`${parts[0]}-medium`);
    return true;
  }
}
