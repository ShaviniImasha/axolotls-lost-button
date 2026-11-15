/**
 * Leaderboard Routes
 * Model-View-Controller (MVC) - Backend Route Layer
 */

import { Router } from 'express';
import { leaderboardRepository } from '../repositories/LeaderboardRepository';

export const leaderboardRoutes = Router();

leaderboardRoutes.get('/', async (_req, res) => {
  try {
    const list = await leaderboardRepository.fetchLeaderboard(20);
    res.json({ leaderboard: list });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default leaderboardRoutes;
