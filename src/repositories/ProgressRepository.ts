/**
 * Progress Repository
 * Model-View-Controller (MVC) - Repository Layer
 * Manages player progression, completed levels, and pearls across Firestore and local storage.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseService } from '../services/FirebaseService';
import type { ProgressState } from '../models/ProgressModel';
import { ErrorHandler } from '../utils/ErrorHandler';

const STORAGE_PREFIX = 'axolotl_progress_';

export class ProgressRepository {
  private static instance: ProgressRepository;

  private constructor() {}

  public static getInstance(): ProgressRepository {
    if (!ProgressRepository.instance) {
      ProgressRepository.instance = new ProgressRepository();
    }
    return ProgressRepository.instance;
  }

  /**
   * Load player progress from Firestore with local fallback
   */
  public async loadProgress(userId: string): Promise<Partial<ProgressState> | null> {
    const db = firebaseService.getFirestore();
    if (firebaseService.isConfigured() && db) {
      try {
        const docRef = doc(db, 'playerProgress', userId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          return {
            currentLevel: data.currentLevel,
            completedLevels: data.completedLevels,
            collectedPearls: data.collectedRewards?.pearls,
            totalScore: data.totalScore,
          };
        }
      } catch (err) {
        ErrorHandler.log(err, 'ProgressRepository.loadProgress (remote)');
      }
    }

    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (err) {
      ErrorHandler.log(err, 'ProgressRepository.loadProgress (local)');
    }

    return null;
  }

  /**
   * Save player progress to Firestore and local storage
   */
  public async saveProgress(userId: string, state: ProgressState): Promise<void> {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(state));
    } catch (err) {
      ErrorHandler.log(err, 'ProgressRepository.saveProgress (local)');
    }

    const db = firebaseService.getFirestore();
    if (firebaseService.isConfigured() && db) {
      try {
        const docRef = doc(db, 'playerProgress', userId);
        await setDoc(
          docRef,
          {
            userId,
            currentLevel: state.currentLevel,
            completedLevels: state.completedLevels,
            collectedRewards: {
              pearls: state.collectedPearls,
            },
            totalLevelsCompleted: state.completedLevels.length,
            totalScore: state.totalScore,
            lastUpdated: new Date().toISOString(),
          },
          { merge: true },
        );
      } catch (err) {
        ErrorHandler.log(err, 'ProgressRepository.saveProgress (remote)');
      }
    }
  }
}

export const progressRepository = ProgressRepository.getInstance();
