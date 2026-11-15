/**
 * Game Repository
 * Backend Repository Layer
 * Manages active session memory and persistence.
 */

import type { GameSession } from '../models/GameModel';

export class GameRepository {
  private static instance: GameRepository;
  private sessions = new Map<string, GameSession>();

  private constructor() {}

  public static getInstance(): GameRepository {
    if (!GameRepository.instance) {
      GameRepository.instance = new GameRepository();
    }
    return GameRepository.instance;
  }

  public save(session: GameSession): void {
    this.sessions.set(session.sessionId, session);
  }

  public findById(sessionId: string): GameSession | undefined {
    return this.sessions.get(sessionId);
  }

  public remove(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}

export const gameRepository = GameRepository.getInstance();
