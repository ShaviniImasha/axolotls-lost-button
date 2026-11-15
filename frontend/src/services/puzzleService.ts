import { ApiClient } from './apiClient';

export interface BackendPuzzleResponse {
  imageUrl: string;
  options: number[];
  solution: number;
}

export class PuzzleService {
  private static instance: PuzzleService;

  private constructor() {}

  public static getInstance(): PuzzleService {
    if (!PuzzleService.instance) {
      PuzzleService.instance = new PuzzleService();
    }
    return PuzzleService.instance;
  }

  /**
   * Request a fish puzzle challenge from backend
   */
  public async getPuzzleChallenge(optionCount = 4): Promise<BackendPuzzleResponse> {
    return ApiClient.get<BackendPuzzleResponse>(`/puzzles/challenge?optionCount=${optionCount}`);
  }

  /**
   * Verify answer via backend
   */
  public async verifyAnswer(answer: number, expectedSolution: number): Promise<{ success: boolean; isCorrect: boolean; pointsAwarded: number }> {
    return ApiClient.post('/puzzles/verify', { answer, expectedSolution });
  }
}

export const puzzleService = PuzzleService.getInstance();
