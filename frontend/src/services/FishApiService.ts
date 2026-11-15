/**
 * Fish API Service
 * Model-View-Controller (MVC) - Service Layer
 * Encapsulates external Fish API HTTP communication, response parsing, and fallbacks.
 */

import { fetchFishPuzzle, type FishPuzzle, FishApiError } from '../api/fishApi';
import { ErrorHandler } from '../utils/ErrorHandler';

export interface FishPuzzleChallenge {
  imageUrl: string;
  solution: number;
  options: number[];
  revealedClueText?: string;
}

export class FishApiService {
  private static instance: FishApiService;

  private constructor() {}

  public static getInstance(): FishApiService {
    if (!FishApiService.instance) {
      FishApiService.instance = new FishApiService();
    }
    return FishApiService.instance;
  }

  /** Fetch a verified puzzle from the documented Fish API. */
  public async getPuzzle(): Promise<FishPuzzle> {
    try {
      return await fetchFishPuzzle();
    } catch (error) {
      ErrorHandler.log(error, 'FishApiService.getPuzzle');
      throw error;
    }
  }

  /**
   * Generate answer options for a given solution
   */
  public generateOptions(solution: number, optionCount: 4 | 6 | 10 = 4): number[] {
    const options = new Set<number>([solution]);
    while (options.size < optionCount) {
      const candidate = Math.floor(Math.random() * 10);
      options.add(candidate);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  }

}

export const fishApiService = FishApiService.getInstance();
