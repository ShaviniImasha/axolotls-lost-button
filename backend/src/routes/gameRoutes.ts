/**
 * Game Routes
 * Backend Route Layer
 */

import { Router } from 'express';
import { GameController } from '../controllers/GameController';
import { authenticateToken } from '../middleware/authenticationMiddleware';

export const gameRoutes = Router();

gameRoutes.post('/start', authenticateToken, GameController.startGame);
gameRoutes.post('/validate-chest', authenticateToken, GameController.validateChestUnlock);

export default gameRoutes;
