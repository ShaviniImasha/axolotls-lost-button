/**
 * Score Service
 * Frontend Service Layer
 * Submits scores to backend REST endpoints.
 */

import { ApiClient } from './apiClient';

export interface ScoreSubmissionPayload {
  levelId: string;
  rawScore: number;
  username?: string;
  avatar?: string;
}

export class ScoreService {
  private static instance: ScoreService;

  private constructor() {}

  public static getInstance(): ScoreService {
    if (!ScoreService.instance) {
      ScoreService.instance = new ScoreService();
    }
    return ScoreService.instance;
  }

  public async submitScore(payload: ScoreSubmissionPayload): Promise<{ success: boolean; finalScore: number }> {
    try {
      return await ApiClient.post('/scores/submit', payload);
    } catch (err) {
      console.warn('[Frontend ScoreService] Error posting to backend:', err);
      return { success: false, finalScore: payload.rawScore };
    }
  }
}

export const scoreService = ScoreService.getInstance();
