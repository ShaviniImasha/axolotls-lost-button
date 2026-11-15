/**
 * Progress Model
 * Model-View-Controller (MVC) - Model Layer
 * Manages player journey progression, level completion, unlocks, pearls, and badges.
 */

import type { LevelId } from '../game/levelManager';
import { getAllLevels, isLevelUnlockedByRules } from '../game/levelManager';
import type { PlayerLevelProgress } from '../services/authService';

export interface ProgressState {
  completedLevels: LevelId[];
  unlockedLevels: LevelId[];
  currentLevel: LevelId;
  totalScore: number;
  collectedPearls: number;
  levelProgress: Record<LevelId, PlayerLevelProgress>;
}

export class ProgressModel {
  private state: ProgressState;

  constructor(initialState?: Partial<ProgressState>) {
    const all = getAllLevels();
    const defaultProgress = Object.fromEntries(all.map((lvl) => [lvl.id, { bestScore: 0 }])) as Record<LevelId, PlayerLevelProgress>;

    this.state = {
      completedLevels: initialState?.completedLevels || [],
      unlockedLevels: initialState?.unlockedLevels || ['pond-easy'],
      currentLevel: initialState?.currentLevel || 'pond-easy',
      totalScore: initialState?.totalScore || 0,
      collectedPearls: initialState?.collectedPearls || 0,
      levelProgress: initialState?.levelProgress || defaultProgress,
    };
  }

  public getState(): ProgressState {
    return {
      completedLevels: [...this.state.completedLevels],
      unlockedLevels: [...this.state.unlockedLevels],
      currentLevel: this.state.currentLevel,
      totalScore: this.state.totalScore,
      collectedPearls: this.state.collectedPearls,
      levelProgress: { ...this.state.levelProgress },
    };
  }

  public isUnlocked(levelId: LevelId): boolean {
    return this.state.unlockedLevels.includes(levelId) || isLevelUnlockedByRules(levelId, this.state.completedLevels);
  }

  public isCompleted(levelId: LevelId): boolean {
    return this.state.completedLevels.includes(levelId);
  }

  public recordLevelCompletion(levelId: LevelId, score: number, pearlsFound: number): { newlyCompleted: boolean; scoreDelta: number } {
    let newlyCompleted = false;
    let scoreDelta = 0;

    if (!this.state.completedLevels.includes(levelId)) {
      this.state.completedLevels.push(levelId);
      newlyCompleted = true;
    }

    const currentBest = this.state.levelProgress[levelId]?.bestScore || 0;
    if (score > currentBest) {
      scoreDelta = score - currentBest;
      this.state.totalScore += scoreDelta;
      if (!this.state.levelProgress[levelId]) {
        this.state.levelProgress[levelId] = { bestScore: score };
      } else {
        this.state.levelProgress[levelId].bestScore = score;
      }
    }

    this.state.collectedPearls += pearlsFound;

    // Refresh unlocks
    this.state.unlockedLevels = getAllLevels()
      .filter((lvl) => isLevelUnlockedByRules(lvl.id, this.state.completedLevels))
      .map((lvl) => lvl.id);

    return { newlyCompleted, scoreDelta };
  }

  public addPearls(count: number): void {
    this.state.collectedPearls = Math.max(0, this.state.collectedPearls + count);
  }

  public updateState(state: Partial<ProgressState>): void {
    if (state.completedLevels) this.state.completedLevels = [...state.completedLevels];
    if (state.unlockedLevels) this.state.unlockedLevels = [...state.unlockedLevels];
    if (state.currentLevel) this.state.currentLevel = state.currentLevel;
    if (typeof state.totalScore === 'number') this.state.totalScore = state.totalScore;
    if (typeof state.collectedPearls === 'number') this.state.collectedPearls = state.collectedPearls;
    if (state.levelProgress) this.state.levelProgress = { ...state.levelProgress };
  }
}
