import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import type { AssetName } from '../assets';
import { getAllLevels, type Difficulty, type LevelId } from '../game/levelManager';
import type { PlayerProfileData } from './authService';

export type LeaderboardDifficulty = Difficulty | 'all';

export interface LeaderboardEntry {
  playerId: string;
  name: string;
  avatar: AssetName;
  score: number;
  pearls: number;
  completedLevelsCount: number;
  isCurrentPlayer?: boolean;
}

export interface RankedLeaderboardEntry extends LeaderboardEntry {
  rank: number;
}

const DEFAULT_SAMPLE_PLAYERS: LeaderboardEntry[] = [
  { playerId: 'sample-1', name: 'CoralComet', avatar: 'fish-peach', score: 320, pearls: 31, completedLevelsCount: 3 },
  { playerId: 'sample-2', name: 'BubblesAxo', avatar: 'axolotl-excited', score: 260, pearls: 27, completedLevelsCount: 3 },
  { playerId: 'sample-3', name: 'PearlSprout', avatar: 'fish-mint', score: 210, pearls: 22, completedLevelsCount: 2 },
  { playerId: 'sample-4', name: 'Moonfin', avatar: 'fish-lavender', score: 175, pearls: 18, completedLevelsCount: 2 },
  { playerId: 'sample-5', name: 'KelpScout', avatar: 'jellyfish', score: 120, pearls: 14, completedLevelsCount: 1 },
];

export class LeaderboardService {
  private static instance: LeaderboardService;

  private constructor() {}

  public static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
  }

  /**
   * Retrieves player rankings from Firestore `scores` collection, ordered by totalScore descending.
   */
  public async getLeaderboard(
    currentPlayerId?: string,
    currentName?: string,
    currentScore?: number,
    currentPearls?: number,
    currentCompletedCount?: number,
    difficulty: LeaderboardDifficulty = 'all',
    currentLevelProgress?: PlayerProfileData['levelProgress'],
    currentCompletedLevels?: readonly LevelId[],
  ): Promise<RankedLeaderboardEntry[]> {
    let entries: LeaderboardEntry[] = [];

    // 1. Try Firestore `scores` collection (with fallback to `players`)
    if (isFirebaseConfigured && db) {
      try {
        const scoresRef = collection(db, 'scores');
        const q = query(scoresRef, orderBy('totalScore', 'desc'), limit(100));
        const snap = await getDocs(q);

        if (!snap.empty) {
          snap.forEach((docSnap) => {
            const data = docSnap.data();
            entries.push({
              playerId: docSnap.id,
              name: data.username || data.name || 'Explorer',
              avatar: (data.avatar as AssetName) || 'axolotl-happy',
              score: typeof data.totalScore === 'number' ? data.totalScore : 0,
              pearls: 0,
              completedLevelsCount:
                typeof data.levelsCompleted === 'number'
                  ? data.levelsCompleted
                  : Array.isArray(data.completedLevels)
                    ? data.completedLevels.length
                    : 0,
              isCurrentPlayer: docSnap.id === currentPlayerId,
            });
          });
        } else {
          // If scores collection hasn't been populated yet, check `players` collection
          const playersRef = collection(db, 'players');
          const pq = query(playersRef, orderBy('totalScore', 'desc'), limit(100));
          const pSnap = await getDocs(pq);
          pSnap.forEach((docSnap) => {
            const data = docSnap.data();
            entries.push({
              playerId: docSnap.id,
              name: data.username || data.name || 'Explorer',
              avatar: (data.avatar as AssetName) || 'axolotl-happy',
              score: scoreForDifficulty(data.totalScore, data.levelProgress, difficulty),
              pearls: typeof data.collectedPearls === 'number' ? data.collectedPearls : 0,
              completedLevelsCount: completedCountForDifficulty(data.completedLevels, difficulty),
              isCurrentPlayer: docSnap.id === currentPlayerId,
            });
          });
        }
      } catch (err) {
        console.warn('Leaderboard fetch from Firestore failed:', err);
      }
    }

    // 2. Try backend API if Firestore returned nothing
    if (entries.length === 0) {
      try {
        const response = await fetch(`/api/leaderboard?difficulty=${encodeURIComponent(difficulty)}`, {
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.leaderboard) && data.leaderboard.length > 0) {
            entries = data.leaderboard.map((item: any) => ({
              playerId: item.playerId,
              name: item.name || item.username,
              avatar: item.avatar || 'axolotl-happy',
              score: item.score ?? item.totalScore ?? 0,
              pearls: item.pearls ?? item.collectedPearls ?? 0,
              completedLevelsCount:
                item.completedLevelsCount ??
                (Array.isArray(item.completedLevels) ? item.completedLevels.length : 0),
              isCurrentPlayer: item.playerId === currentPlayerId,
            }));
          }
        }
      } catch {
        // Backend not reachable
      }
    }

    // 3. Fallback to sample players
    if (entries.length === 0) {
      entries = DEFAULT_SAMPLE_PLAYERS.map((entry) => ({
        ...entry,
        isCurrentPlayer: entry.playerId === currentPlayerId,
      }));
    }

    // 4. Inject current player if authenticated
    if (currentPlayerId) {
      const existingIndex = entries.findIndex((entry) => entry.playerId === currentPlayerId);
      const computedScore =
        currentScore ?? scoreForDifficulty(0, currentLevelProgress, difficulty);
      const computedCompletedCount =
        currentCompletedCount ?? completedCountForDifficulty(currentCompletedLevels, difficulty);

      const playerEntry: LeaderboardEntry = {
        playerId: currentPlayerId,
        name: currentName || 'You',
        avatar: 'axolotl-happy',
        score: computedScore,
        pearls: currentPearls ?? 0,
        completedLevelsCount: computedCompletedCount,
        isCurrentPlayer: true,
      };

      if (existingIndex >= 0) {
        entries[existingIndex] = {
          ...entries[existingIndex],
          name: currentName || entries[existingIndex].name,
          score: Math.max(entries[existingIndex].score, computedScore),
          pearls: Math.max(entries[existingIndex].pearls, currentPearls ?? 0),
          completedLevelsCount: Math.max(
            entries[existingIndex].completedLevelsCount,
            computedCompletedCount,
          ),
          isCurrentPlayer: true,
        };
      } else {
        entries.push(playerEntry);
      }
    }

    // 5. Sort descending by score
    entries.sort((a, b) => b.score - a.score);

    // 6. Assign ranks
    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }
}

function scoreForDifficulty(
  totalScore: unknown,
  levelProgress: unknown,
  difficulty: LeaderboardDifficulty,
): number {
  if (difficulty === 'all') {
    return typeof totalScore === 'number' && Number.isFinite(totalScore) && totalScore >= 0
      ? totalScore
      : 0;
  }
  const matchingLevels = getAllLevels().filter((level) => level.difficulty === difficulty);
  if (!levelProgress || typeof levelProgress !== 'object') {
    return 0;
  }
  const progressMap = levelProgress as Record<string, { bestScore?: number } | undefined>;
  return matchingLevels.reduce((sum, level) => {
    const bestScore = progressMap[level.id]?.bestScore;
    return typeof bestScore === 'number' && Number.isFinite(bestScore) && bestScore >= 0
      ? sum + bestScore
      : sum;
  }, 0);
}

function completedCountForDifficulty(
  completedLevels: unknown,
  difficulty: LeaderboardDifficulty,
): number {
  if (!Array.isArray(completedLevels)) {
    return 0;
  }
  if (difficulty === 'all') {
    return completedLevels.length;
  }
  const allowed = new Set(
    getAllLevels()
      .filter((level) => level.difficulty === difficulty)
      .map((level) => level.id),
  );
  return completedLevels.filter((levelId) => allowed.has(levelId)).length;
}

export const leaderboardService = LeaderboardService.getInstance();
