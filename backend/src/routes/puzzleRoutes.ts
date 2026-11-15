/**
 * Puzzle Routes
 * Model-View-Controller (MVC) - Backend Route Layer
 */

import { Router } from 'express';
import { fishApiService } from '../services/FishApiService';

export const puzzleRoutes = Router();

puzzleRoutes.get('/challenge', async (_req, res) => {
  try {
    const puzzle = await fishApiService.getPuzzle();
    const options = fishApiService.generateOptions(puzzle.solution, 4);
    res.json({
      imageUrl: puzzle.imageUrl,
      options,
    });
  } catch (error) {
    const fallback = fishApiService.getOfflineFallback();
    res.json({
      imageUrl: fallback.imageUrl,
      options: [1, 2, 3, 5],
    });
  }
});

export default puzzleRoutes;
