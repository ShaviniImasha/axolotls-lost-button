/**
 * Leaderboard Controller
 * Backend MVC - Controller Layer
 */

import type { Request, Response } from 'express';
import { leaderboardRepository } from '../repositories/LeaderboardRepository';

export class LeaderboardController {
  public static async getLeaderboard(req: Request, res: Response): Promise<void> {
    const limitCount = Math.min(50, Math.max(5, Number(req.query.limit) || 20));
    const rankings = await leaderboardRepository.getLeaderboard(limitCount);
    res.json({ leaderboard: rankings });
  }
}
