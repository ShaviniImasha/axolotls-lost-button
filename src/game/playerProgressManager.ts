import {
  authService,
  createEmptyLevelProgress,
  type PlayerProfileData,
} from '../services/authService';
import { firestoreService } from '../services/firestoreService';
import {
  getAllLevels,
  isLevelUnlockedByRules,
  migrateLegacyLevelIds,
  type LevelId,
} from './levelManager';

export function migrateSavedProgress(progress: Partial<PlayerProfileData>): Pick<
  PlayerProfileData,
  'currentLevel' | 'unlockedLevels' | 'completedLevels' | 'levelProgress'
> {
  const completedLevels = migrateLegacyLevelIds(
    Array.isArray(progress.completedLevels) ? progress.completedLevels : [],
  );
  const currentLevel = migrateLegacyLevelIds(
    progress.currentLevel === undefined ? [] : [progress.currentLevel],
  )[0] ?? 'pond-easy';
  const levelProgress = createEmptyLevelProgress();

  if (progress.levelProgress && typeof progress.levelProgress === 'object') {
    for (const level of getAllLevels()) {
      const saved = progress.levelProgress[level.id];
      if (saved && typeof saved.bestScore === 'number' && Number.isFinite(saved.bestScore) && saved.bestScore >= 0) {
        levelProgress[level.id].bestScore = saved.bestScore;
      }
    }
  }

  const unlockedLevels = getAllLevels()
    .filter((level) => isLevelUnlockedByRules(level.id, completedLevels))
    .map((level) => level.id);

  return { currentLevel, unlockedLevels, completedLevels, levelProgress };
}

export class PlayerProgressManager {
  private static instance: PlayerProgressManager;
  private currentProgress: PlayerProfileData | null = null;

  private constructor() {
    authService.onAuthChange((user) => {
      if (user && user.playerId !== this.currentProgress?.playerId) {
        void this.loadProgress(user);
      } else if (!user) {
        this.currentProgress = null;
      }
    });
  }

  public static getInstance(): PlayerProgressManager {
    if (!PlayerProgressManager.instance) {
      PlayerProgressManager.instance = new PlayerProgressManager();
    }
    return PlayerProgressManager.instance;
  }

  public async loadProgress(user: PlayerProfileData): Promise<PlayerProfileData> {
    const idToken = authService.getIdToken();
    const remote = await firestoreService.loadPlayerProfile(user.playerId, idToken);
    const saved = remote ?? user;
    const migrated = migrateSavedProgress(saved);

    this.currentProgress = {
      ...user,
      ...saved,
      ...migrated,
      collectedPearls: typeof saved.collectedPearls === 'number' ? saved.collectedPearls : 0,
      totalScore: typeof saved.totalScore === 'number' ? saved.totalScore : 0,
      collectedClues: Array.isArray(saved.collectedClues) ? saved.collectedClues : [],
    };

    if (
      !remote ||
      remote.currentLevel !== migrated.currentLevel ||
      JSON.stringify(remote.completedLevels) !== JSON.stringify(migrated.completedLevels) ||
      JSON.stringify(remote.levelProgress) !== JSON.stringify(migrated.levelProgress) ||
      JSON.stringify(remote.unlockedLevels) !== JSON.stringify(migrated.unlockedLevels)
    ) {
      await this.saveCurrentProgress();
    }
    return this.currentProgress;
  }

  public getProgress(): PlayerProfileData | null {
    return this.currentProgress;
  }

  public async addScore(delta: number): Promise<number> {
    if (!this.currentProgress) return 0;
    this.currentProgress.totalScore = Math.max(0, this.currentProgress.totalScore + delta);
    await this.saveCurrentProgress();
    return this.currentProgress.totalScore;
  }

  public async setCurrentLevel(levelId: LevelId): Promise<void> {
    if (!this.currentProgress || this.currentProgress.currentLevel === levelId) return;
    this.currentProgress.currentLevel = levelId;
    await this.saveCurrentProgress();
  }

  public async addPearls(count: number): Promise<number> {
    if (!this.currentProgress) return 0;
    this.currentProgress.collectedPearls = Math.max(0, this.currentProgress.collectedPearls + count);
    await this.saveCurrentProgress();
    return this.currentProgress.collectedPearls;
  }

  public async addClue(clueId: string): Promise<string[]> {
    if (!this.currentProgress) return [];
    if (!this.currentProgress.collectedClues.includes(clueId)) {
      this.currentProgress.collectedClues = [...this.currentProgress.collectedClues, clueId];
      await this.saveCurrentProgress();
    }
    return this.currentProgress.collectedClues;
  }

  public async completeLevel(
    levelId: LevelId,
    scoreAlreadyAdded: number,
    finalLevelScore: number,
  ): Promise<void> {
    if (!this.currentProgress) return;

    this.currentProgress.totalScore = Math.max(
      0,
      this.currentProgress.totalScore + finalLevelScore - scoreAlreadyAdded,
    );
    if (!this.currentProgress.completedLevels.includes(levelId)) {
      this.currentProgress.completedLevels = [...this.currentProgress.completedLevels, levelId];
    }

    const bestScore = this.currentProgress.levelProgress[levelId]?.bestScore ?? 0;
    this.currentProgress.levelProgress[levelId] = {
      bestScore: Math.max(bestScore, finalLevelScore),
    };
    this.currentProgress.unlockedLevels = getAllLevels()
      .filter((level) => isLevelUnlockedByRules(level.id, this.currentProgress!.completedLevels))
      .map((level) => level.id);
    await this.saveCurrentProgress();
  }

  public async saveCurrentProgress(): Promise<boolean> {
    if (!this.currentProgress) return false;
    authService.updateCurrentUserProfile(this.currentProgress);
    const idToken = authService.getIdToken();
    return await firestoreService.savePlayerProgress(
      this.currentProgress.playerId,
      this.currentProgress,
      idToken,
    );
  }
}

export const playerProgressManager = PlayerProgressManager.getInstance();
