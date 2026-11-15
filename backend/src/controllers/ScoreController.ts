/**
 * Score Controller
 * Backend MVC - Controller Layer
 */

import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/authenticationMiddleware';
import { scoreRepository } from '../repositories/ScoreRepository';
import { ScoreModel } from '../models/ScoreModel';
import { LevelModel } from '../models/LevelModel';

export class ScoreController {
  public static async submitScore(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { levelId, rawScore, username, avatar } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const level = LevelModel.getById(levelId);
    const multiplier = level?.scoreMultiplier ?? 1;
    const finalScore = ScoreModel.calculateFinalScore(Number(rawScore) || 0, multiplier);

    await scoreRepository.saveScore({
      userId,
      username: username || 'Mysterious Explorer',
      avatar: avatar || 'axolotl-happy',
      totalScore: finalScore,
      highestScore: finalScore,
      levelsCompleted: 1,
      lastUpdated: new Date().toISOString(),
    });

    res.json({
      success: true,
      rawScore,
      multiplier,
      finalScore,
      recordedAt: new Date().toISOString(),
    });
  }
}
