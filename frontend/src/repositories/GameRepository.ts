/**
 * Game Repository
 * Model-View-Controller (MVC) - Repository Layer
 * Manages game session state persistence.
 */

import type { GameSessionState } from '../models/GameModel';

const SESSION_STORAGE_KEY = 'axolotl_game_session';

export class GameRepository {
  private static instance: GameRepository;

  private constructor() {}

  public static getInstance(): GameRepository {
    if (!GameRepository.instance) {
      GameRepository.instance = new GameRepository();
    }
    return GameRepository.instance;
  }

  public saveActiveSession(state: GameSessionState): void {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable or disabled
    }
  }

  public getActiveSession(): GameSessionState | null {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  public clearActiveSession(): void {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}

export const gameRepository = GameRepository.getInstance();
