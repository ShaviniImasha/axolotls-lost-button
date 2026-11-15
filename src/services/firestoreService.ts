import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import type { PlayerProfileData } from './authService';
import { getAllLevels, type LevelId } from '../game/levelManager';
import type { AssetName } from '../assets';

export interface PlayerDoc {
  userId: string;
  username: string;
  email: string | null;
  avatar: string;
  createdAt: string;
  lastLogin: string;
  profileInfo?: Record<string, unknown> | string;
}

export interface PlayerProgressDoc {
  userId: string;
  currentLevel: string | number;
  completedLevels: (string | number)[];
  collectedRewards: {
    pearls: number;
    clues: string[];
    items?: string[];
  };
  totalLevelsCompleted: number;
  lastUpdated: string;
  gameProgress?: Record<string, unknown>;
}

export interface ScoreDoc {
  userId: string;
  username: string;
  avatar?: string;
  totalScore: number;
  highestScore: number;
  levelsCompleted: number;
  completedLevels?: (string | number)[];
  lastUpdated: string;
}

export interface AchievementDoc {
  userId: string;
  achievementName: string;
  achievementDescription: string;
  unlockedAt: string;
}

const LOCAL_PROGRESS_KEY_PREFIX = 'axolotl_progress_';

function completeLevelProgress(progress: Partial<PlayerProfileData>): Partial<PlayerProfileData> {
  const levelProgress = Object.fromEntries(
    getAllLevels().map((level) => {
      const savedScore = progress.levelProgress?.[level.id]?.bestScore;
      return [
        level.id,
        {
          bestScore:
            typeof savedScore === 'number' && Number.isFinite(savedScore) && savedScore >= 0
              ? savedScore
              : 0,
        },
      ];
    }),
  ) as Record<LevelId, { bestScore: number }>;
  return { ...progress, levelProgress };
}

export class FirestoreService {
  private static instance: FirestoreService;

  private constructor() {}

  public static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  /**
   * Automatically creates documents in `players`, `playerProgress`, and `scores`.
   * Throws on error so the caller and browser console can report any permission issues immediately.
   */
  public async createInitialPlayerRecords(
    userId: string,
    username: string,
    email: string | null,
    avatar: AssetName = 'axolotl-happy',
  ): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      console.warn('[Firestore] Skipped createInitialPlayerRecords: db is null or not configured.');
      return;
    }

    const now = new Date().toISOString();

    const playerDoc: PlayerDoc = {
      userId,
      username,
      email,
      avatar,
      createdAt: now,
      lastLogin: now,
      profileInfo: { bio: 'A friendly pond explorer helping Pip find buttons!' },
    };

    const progressDoc: PlayerProgressDoc = {
      userId,
      currentLevel: 1,
      completedLevels: [],
      collectedRewards: {
        pearls: 0,
        clues: [],
      },
      totalLevelsCompleted: 0,
      lastUpdated: now,
      gameProgress: {
        levelProgress: {},
      },
    };

    const scoreDoc: ScoreDoc = {
      userId,
      username,
      avatar,
      totalScore: 0,
      highestScore: 0,
      levelsCompleted: 0,
      completedLevels: [],
      lastUpdated: now,
    };

    try {
      console.log(`[Firestore] Writing initial documents for UID: ${userId}...`);
      await Promise.all([
        setDoc(doc(db, 'players', userId), playerDoc, { merge: true }),
        setDoc(doc(db, 'playerProgress', userId), progressDoc, { merge: true }),
        setDoc(doc(db, 'scores', userId), scoreDoc, { merge: true }),
      ]);
      console.log(`[Firestore] SUCCESS: Initial documents created in players, playerProgress, and scores for ${userId}`);
    } catch (err) {
      console.error('[Firestore] ERROR writing initial records:', err);
      throw err;
    }
  }

  public async recordPlayerLogin(userId: string): Promise<void> {
    if (!isFirebaseConfigured || !db) return;
    try {
      await setDoc(
        doc(db, 'players', userId),
        { lastLogin: new Date().toISOString() },
        { merge: true },
      );
    } catch (err) {
      console.warn('Could not update lastLogin in Firestore:', err);
    }
  }

  public async loadPlayerProfile(
    playerId: string,
    idToken?: string | null,
  ): Promise<Partial<PlayerProfileData> | null> {
    if (isFirebaseConfigured && db) {
      try {
        const [playerSnap, progressSnap, scoreSnap] = await Promise.all([
          getDoc(doc(db, 'players', playerId)),
          getDoc(doc(db, 'playerProgress', playerId)),
          getDoc(doc(db, 'scores', playerId)),
        ]);

        if (playerSnap.exists() || progressSnap.exists() || scoreSnap.exists()) {
          const playerData = (playerSnap.exists() ? playerSnap.data() : {}) as Partial<PlayerDoc>;
          const progressData = (progressSnap.exists() ? progressSnap.data() : {}) as Partial<PlayerProgressDoc>;
          const scoreData = (scoreSnap.exists() ? scoreSnap.data() : {}) as Partial<ScoreDoc>;

          const collectedRewards = progressData.collectedRewards || { pearls: 0, clues: [] };
          const levelProgress = (progressData.gameProgress?.levelProgress as any) || {};
          const completedLevels = (progressData.completedLevels as any) || [];

          return {
            playerId,
            name: playerData.username || scoreData.username || 'Pond Pal',
            email: playerData.email || null,
            avatar: (playerData.avatar as AssetName) || 'axolotl-happy',
            totalScore: typeof scoreData.totalScore === 'number' ? scoreData.totalScore : 0,
            currentLevel: (progressData.currentLevel as any) || 1,
            completedLevels,
            collectedPearls: collectedRewards.pearls || 0,
            collectedClues: collectedRewards.clues || [],
            levelProgress,
            gameProgress: progressData.gameProgress || {},
          };
        }
      } catch (err) {
        console.warn('Firestore multi-collection load failed:', err);
      }
    }

    if (idToken) {
      try {
        const response = await fetch(`/api/progress/${encodeURIComponent(playerId)}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
            Accept: 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.profile) {
            return data.profile;
          }
        }
      } catch {
        // Backend not running or unreachable
      }
    }

    const storage =
      typeof window !== 'undefined' && window.localStorage
        ? window.localStorage
        : typeof localStorage !== 'undefined'
          ? localStorage
          : null;
    if (storage) {
      try {
        const local = storage.getItem(LOCAL_PROGRESS_KEY_PREFIX + playerId);
        if (local) {
          return JSON.parse(local);
        }
      } catch {
        // localStorage unavailable
      }
    }

    return null;
  }

  public async savePlayerProgress(
    playerId: string,
    progress: Partial<PlayerProfileData>,
    idToken?: string | null,
  ): Promise<boolean> {
    let saved = false;
    const savedProgress = completeLevelProgress(progress);
    const now = new Date().toISOString();

    const completedLevels = (savedProgress.completedLevels as any) || [];
    const totalLevelsCompleted = completedLevels.length;
    const totalScore = typeof savedProgress.totalScore === 'number' ? savedProgress.totalScore : 0;

    if (isFirebaseConfigured && db) {
      try {
        const progressDoc: PlayerProgressDoc = {
          userId: playerId,
          currentLevel: savedProgress.currentLevel || 1,
          completedLevels,
          collectedRewards: {
            pearls: savedProgress.collectedPearls || 0,
            clues: savedProgress.collectedClues || [],
          },
          totalLevelsCompleted,
          lastUpdated: now,
          gameProgress: {
            ...(savedProgress.gameProgress || {}),
            levelProgress: savedProgress.levelProgress || {},
          },
        };

        const scoreDoc: ScoreDoc = {
          userId: playerId,
          username: savedProgress.name || 'Pond Pal',
          avatar: savedProgress.avatar || 'axolotl-happy',
          totalScore,
          highestScore: totalScore,
          levelsCompleted: totalLevelsCompleted,
          completedLevels,
          lastUpdated: now,
        };

        const playerUpdates: Partial<PlayerDoc> = {
          userId: playerId,
          username: savedProgress.name || 'Pond Pal',
          avatar: savedProgress.avatar || 'axolotl-happy',
        };

        await Promise.all([
          setDoc(doc(db, 'playerProgress', playerId), progressDoc, { merge: true }),
          setDoc(doc(db, 'scores', playerId), scoreDoc, { merge: true }),
          setDoc(doc(db, 'players', playerId), playerUpdates, { merge: true }),
        ]);

        await this.checkMilestoneAchievements(playerId, savedProgress);
        saved = true;
      } catch (err) {
        console.warn('Firestore multi-collection save failed:', err);
      }
    }

    if (idToken) {
      try {
        const response = await fetch(`/api/progress/${encodeURIComponent(playerId)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(savedProgress),
        });
        if (response.ok) saved = true;
      } catch {
        // backend unavailable
      }
    }

    const storage =
      typeof window !== 'undefined' && window.localStorage
        ? window.localStorage
        : typeof localStorage !== 'undefined'
          ? localStorage
          : null;
    if (storage) {
      try {
        const existing = storage.getItem(LOCAL_PROGRESS_KEY_PREFIX + playerId);
        const prev = existing ? JSON.parse(existing) : {};
        const merged = { ...prev, ...savedProgress, updatedAt: now };
        storage.setItem(LOCAL_PROGRESS_KEY_PREFIX + playerId, JSON.stringify(merged));
        saved = true;
      } catch {
        // local storage error
      }
    }

    return saved;
  }

  public async unlockAchievement(
    userId: string,
    achievementKey: string,
    name: string,
    description: string,
  ): Promise<void> {
    if (!isFirebaseConfigured || !db) return;

    const docId = `${userId}_${achievementKey}`;
    const docData: AchievementDoc = {
      userId,
      achievementName: name,
      achievementDescription: description,
      unlockedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'achievements', docId), docData, { merge: true });
      console.log(`[Firestore] Achievement unlocked for ${userId}: ${name}`);
    } catch (err) {
      console.warn('Could not record achievement:', err);
    }
  }

  public async getUserAchievements(userId: string): Promise<AchievementDoc[]> {
    if (!isFirebaseConfigured || !db) return [];

    try {
      const q = query(collection(db, 'achievements'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const achievements: AchievementDoc[] = [];
      snap.forEach((d) => {
        achievements.push(d.data() as AchievementDoc);
      });
      return achievements;
    } catch (err) {
      console.warn('Could not fetch achievements:', err);
      return [];
    }
  }

  private async checkMilestoneAchievements(
    userId: string,
    progress: Partial<PlayerProfileData>,
  ): Promise<void> {
    const clues = progress.collectedClues || [];
    const completed = progress.completedLevels || [];
    const score = progress.totalScore || 0;

    if (clues.length >= 1) {
      await this.unlockAchievement(
        userId,
        'first_clue',
        'First Clue Found',
        'Discovered a mystery clue in the underwater pond.',
      );
    }
    if (completed.length >= 1) {
      await this.unlockAchievement(
        userId,
        'first_pond_complete',
        'Pond Explorer',
        'Successfully opened the chest and completed your first pond.',
      );
    }
    if (completed.length >= 3) {
      await this.unlockAchievement(
        userId,
        'master_explorer',
        'Master Detective',
        'Found all buttons and completed all 3 pond challenges.',
      );
    }
    if (score >= 100) {
      await this.unlockAchievement(
        userId,
        'centurion',
        'Century Score',
        'Accumulated 100 or more points from fish puzzles and shiny finds.',
      );
    }
  }
}

export const firestoreService = FirestoreService.getInstance();
