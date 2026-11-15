/**
 * Fish API Service
 * Backend Service Layer
 * Communicates with Marc Conrad's external Fish API and validates payload responses.
 */

export interface FishPuzzleData {
  imageUrl: string;
  solution: number;
}

export class FishApiService {
  private static instance: FishApiService;
  private readonly apiUrl = 'https://marcconrad.com/uob/fish/api.php?out=json';

  private constructor() {}

  public static getInstance(): FishApiService {
    if (!FishApiService.instance) {
      FishApiService.instance = new FishApiService();
    }
    return FishApiService.instance;
  }

  /**
   * Fetch a math riddle puzzle from the external Fish API
   */
  public async fetchPuzzle(): Promise<FishPuzzleData> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(this.apiUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as { question?: string; solution?: number; chest?: number; fish?: number };
      const solution = typeof data.solution === 'number' ? data.solution : typeof data.fish === 'number' ? data.fish : 0;
      const imageUrl = data.question || '';

      if (!imageUrl || solution < 0 || solution > 9) {
        throw new Error('Invalid payload from Fish API');
      }

      return { imageUrl, solution };
    } catch (err) {
      console.warn('[Backend FishApiService] External API error, serving fallback:', err);
      return this.getFallbackPuzzle();
    }
  }

  /**
   * Offline / fallback riddles
   */
  public getFallbackPuzzle(): FishPuzzleData {
    const fallbacks: FishPuzzleData[] = [
      { imageUrl: 'https://marcconrad.com/uob/fish/images/1.png', solution: 3 },
      { imageUrl: 'https://marcconrad.com/uob/fish/images/2.png', solution: 5 },
      { imageUrl: 'https://marcconrad.com/uob/fish/images/3.png', solution: 7 },
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  /**
   * Generate multiple choice options including the correct solution
   */
  public generateOptions(solution: number, count = 4): number[] {
    const options = new Set<number>([solution]);
    while (options.size < count) {
      options.add(Math.floor(Math.random() * 10));
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  }
}

export const fishApiService = FishApiService.getInstance();
