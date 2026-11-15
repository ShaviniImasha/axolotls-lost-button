import { ApiClient } from './apiClient';

export interface GameSessionStartResponse {
  success: boolean;
  session: {
    sessionId: string;
    level: {
      id: string;
      timeLimit: number;
    };
  };
}

export interface ChestUnlockResponse {
  success: boolean;
  message: string;
  targetCombination?: [number, number, number];
}

export class GameService {
  private static instance: GameService;

  private constructor() {}

  public static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  public async startSession(levelId: string): Promise<GameSessionStartResponse> {
    try {
      return await ApiClient.post<GameSessionStartResponse>('/game/start', { levelId });
    } catch {
      return {
        success: true,
        session: {
          sessionId: `local_${Date.now()}`,
          level: { id: levelId, timeLimit: 90 },
        },
      };
    }
  }

  public async validateChest(levelId: string, attemptCode: [number, number, number]): Promise<ChestUnlockResponse> {
    try {
      return await ApiClient.post<ChestUnlockResponse>('/game/validate-chest', { levelId, attemptCode });
    } catch {
      // Local fallback
      return { success: false, message: 'Connection to vault interrupted.' };
    }
  }
}

export const gameService = GameService.getInstance();
