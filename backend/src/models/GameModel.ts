/**
 * Game Model
 * Backend MVC - Model Layer
 */

import { LevelModel, type LevelDefinition } from './LevelModel';

export interface GameSession {
  sessionId: string;
  userId: string;
  level: LevelDefinition;
  timeRemaining: number;
  score: number;
  isCompleted: boolean;
  startedAt: number;
}

export class GameModel {
  public static createSession(sessionId: string, userId: string, levelId: string): GameSession {
    const level = LevelModel.getById(levelId) || LevelModel.getAll()[0];
    return {
      sessionId,
      userId,
      level,
      timeRemaining: level.timeLimit,
      score: 0,
      isCompleted: false,
      startedAt: Date.now(),
    };
  }

  public static validateChestUnlock(attemptCode: [number, number, number], targetCode: [number, number, number]): boolean {
    return attemptCode[0] === targetCode[0] &&
           attemptCode[1] === targetCode[1] &&
           attemptCode[2] === targetCode[2];
  }
}
