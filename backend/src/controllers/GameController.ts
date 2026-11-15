/**
 * Game Controller
 * Backend MVC - Controller Layer
 */

import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/authenticationMiddleware';
import { GameModel } from '../models/GameModel';
import { gameRepository } from '../repositories/GameRepository';
import { LevelModel } from '../models/LevelModel';

export class GameController {
  public static startGame(req: AuthenticatedRequest, res: Response): void {
    const { levelId } = req.body;
    const userId = req.user?.uid || 'guest';
    const sessionId = `game_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const session = GameModel.createSession(sessionId, userId, levelId || 'pond-easy');
    gameRepository.save(session);

    res.json({ success: true, session });
  }

  public static validateChestUnlock(req: AuthenticatedRequest, res: Response): void {
    const { levelId, attemptCode } = req.body;
    const level = LevelModel.getById(levelId);

    if (!level) {
      res.status(404).json({ error: 'Level not found' });
      return;
    }

    if (!Array.isArray(attemptCode) || attemptCode.length !== 3) {
      res.status(400).json({ error: 'Invalid code format' });
      return;
    }

    const isMatch = GameModel.validateChestUnlock(attemptCode as [number, number, number], level.chestCombination);

    res.json({
      success: isMatch,
      message: isMatch ? 'Click! The chest pops open!' : 'The dials shudder and lock firm. Keep looking for clues!',
      targetCombination: isMatch ? level.chestCombination : undefined,
    });
  }
}
