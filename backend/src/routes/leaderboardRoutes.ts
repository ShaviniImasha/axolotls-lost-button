/**
 * Leaderboard Routes
 * Backend Route Layer
 */

import { Router } from 'express';
import { LeaderboardController } from '../controllers/LeaderboardController';

export const leaderboardRoutes = Router();

leaderboardRoutes.get('/', LeaderboardController.getLeaderboard);

export default leaderboardRoutes;
