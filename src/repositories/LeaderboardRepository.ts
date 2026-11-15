/**
 * Leaderboard Repository
 * Model-View-Controller (MVC) - Repository Layer
 * Manages leaderboard data retrieval from Firestore with sample offline fallbacks.
 */

import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { firebaseService } from '../services/FirebaseService';
import type { LeaderboardPlayer } from '../models/LeaderboardModel';
import { ErrorHandler } from '../utils/ErrorHandler';

const DEFAULT_SAMPLE_PLAYERS: LeaderboardPlayer[] = [
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

  public async fetchLeaderboard(limitCount = 20): Promise<LeaderboardPlayer[]> {
    const db = firebaseService.getFirestore();
    if (firebaseService.isConfigured() && db) {
      try {
        const scoresRef = collection(db, 'scores');
        const q = query(scoresRef, orderBy('totalScore', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          return snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              playerId: docSnap.id,
              name: data.username || 'Mysterious Axolotl',
              avatar: data.avatar || 'axolotl-happy',
              score: data.totalScore || 0,
              pearls: data.pearls || 0,
              completedLevelsCount: data.levelsCompleted || 0,
            };
          });
        }
      } catch (err) {
        ErrorHandler.log(err, 'LeaderboardRepository.fetchLeaderboard (remote)');
      }
    }

    return [...DEFAULT_SAMPLE_PLAYERS];
  }
}

export const leaderboardRepository = LeaderboardRepository.getInstance();
