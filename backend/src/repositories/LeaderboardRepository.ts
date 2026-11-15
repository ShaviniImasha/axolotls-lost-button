/**
 * Leaderboard Repository
 * Backend Repository Layer
 * Fetches rankings from Firestore 'scores' collection.
 */

import { getAdminDb } from '../config/firebase';
import type { LeaderboardRankEntry } from '../models/LeaderboardModel';
import { LeaderboardModel } from '../models/LeaderboardModel';

const SAMPLE_PLAYERS: Array<Omit<LeaderboardRankEntry, 'rank'>> = [
  { playerId: 'sample-1', name: 'CoralComet', avatar: 'fish-peach', score: 320, pearls: 31, completedLevelsCount: 3 },
  { playerId: 'sample-2', name: 'BubblesAxo', avatar: 'axolotl-excited', score: 260, pearls: 27, completedLevelsCount: 3 },
  { playerId: 'sample-3', name: 'PearlSprout', avatar: 'fish-mint', score: 210, pearls: 22, completedLevelsCount: 2 },
  { playerId: 'sample-4', name: 'Moonfin', avatar: 'fish-lavender', score: 175, pearls: 18, completedLevelsCount: 2 },
  { playerId: 'sample-5', name: 'KelpScout', avatar: 'jellyfish', score: 120, pearls: 14, completedLevelsCount: 1 },
];

export class LeaderboardRepository {
  private static instance: LeaderboardRepository;

  private constructor() {}

  public static getInstance(): LeaderboardRepository {
    if (!LeaderboardRepository.instance) {
      LeaderboardRepository.instance = new LeaderboardRepository();
    }
    return LeaderboardRepository.instance;
  }

  public async getLeaderboard(limitCount = 20): Promise<LeaderboardRankEntry[]> {
    const db = getAdminDb();
    if (db) {
      try {
        const snap = await db.collection('scores').orderBy('totalScore', 'desc').limit(limitCount).get();
        if (!snap.empty) {
          const rawEntries = snap.docs.map((docSnap: any) => {
            const data = docSnap.data();
            return {
              playerId: docSnap.id,
              name: data.username || 'Mysterious Explorer',
              avatar: data.avatar || 'axolotl-happy',
              score: data.totalScore || 0,
              pearls: data.pearls || 0,
              completedLevelsCount: data.levelsCompleted || 0,
            };
          });
          return LeaderboardModel.rankEntries(rawEntries);
        }
      } catch (err) {
        console.warn('[Backend LeaderboardRepository] Firestore fetch error:', err);
      }
    }

    return LeaderboardModel.rankEntries(SAMPLE_PLAYERS);
  }
}

export const leaderboardRepository = LeaderboardRepository.getInstance();
