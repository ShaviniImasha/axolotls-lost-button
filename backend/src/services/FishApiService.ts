export interface FishPuzzleData {
  imageUrl: string;
  solution: number;
}

export class FishApiService {
  private static instance: FishApiService;
  private readonly apiUrl = 'https://marcconrad.com/uob/fish/api.php?out=json&base64=yes';

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
      const rawQuestion = data.question || '';
      const imageUrl = rawQuestion.startsWith('data:image/')
        ? rawQuestion
        : /^[A-Za-z0-9+/]+=*$/.test(rawQuestion) && rawQuestion.length > 100
          ? `data:image/png;base64,${rawQuestion}`
          : rawQuestion;

      if (!imageUrl || solution < 0 || solution > 9) {
        throw new Error('Invalid payload from Fish API');
      }

      return { imageUrl, solution };
    } catch (err) {
      throw new Error(`Fish API request failed: ${err instanceof Error ? err.message : String(err)}`);
    }
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
