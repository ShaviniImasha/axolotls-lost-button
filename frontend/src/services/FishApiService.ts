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
  private puzzleCache: FishPuzzle[] = [];

  private constructor() {}

  public static getInstance(): FishApiService {
    if (!FishApiService.instance) {
      FishApiService.instance = new FishApiService();
    }
    return FishApiService.instance;
  }

  /**
   * Fetch a verified puzzle from Fish API with safe retry/fallback
   */
  public async getPuzzle(): Promise<FishPuzzle> {
    try {
      const puzzle = await fetchFishPuzzle();
      return puzzle;
    } catch (error) {
      ErrorHandler.log(error, 'FishApiService.getPuzzle');
      // If network fails, provide an offline fallback puzzle to maintain gameplay
      return this.getOfflineFallback();
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

  /**
   * Offline fallback puzzle when API is unreachable
   */
  public getOfflineFallback(): FishPuzzle {
    const fallbackPuzzles: FishPuzzle[] = [
      {
        imageUrl: 'https://marcconrad.com/uob/fish/images/1.png',
        solution: 3,
      },
      {
        imageUrl: 'https://marcconrad.com/uob/fish/images/2.png',
        solution: 5,
      },
      {
        imageUrl: 'https://marcconrad.com/uob/fish/images/3.png',
        solution: 7,
      },
    ];
    const randomIndex = Math.floor(Math.random() * fallbackPuzzles.length);
    return fallbackPuzzles[randomIndex];
  }
}

export const fishApiService = FishApiService.getInstance();
