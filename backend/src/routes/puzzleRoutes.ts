/**
 * Puzzle Routes
 * Backend Route Layer
 */

import { Router } from 'express';
import { PuzzleController } from '../controllers/PuzzleController';

export const puzzleRoutes = Router();

puzzleRoutes.get('/challenge', PuzzleController.getChallenge);
puzzleRoutes.post('/verify', PuzzleController.verifyAnswer);

export default puzzleRoutes;
