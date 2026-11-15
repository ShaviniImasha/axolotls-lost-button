/**
 * Score Routes
 * Backend Route Layer
 */

import { Router } from 'express';
import { ScoreController } from '../controllers/ScoreController';
import { authenticateToken } from '../middleware/authenticationMiddleware';

export const scoreRoutes = Router();

scoreRoutes.post('/submit', authenticateToken, ScoreController.submitScore);

export default scoreRoutes;
