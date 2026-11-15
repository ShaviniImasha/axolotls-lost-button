/**
 * Puzzle Routes
 * Model-View-Controller (MVC) - Backend Route Layer
 */

import { Router } from 'express';
import { fishApiService } from '../services/FishApiService';

export const puzzleRoutes = Router();

puzzleRoutes.get('/challenge', async (_req, res) => {
  try {
    const puzzle = await fishApiService.fetchPuzzle();
    const options = fishApiService.generateOptions(puzzle.solution, 4);
    res.json({
      imageUrl: puzzle.imageUrl,
      options,
      solution: puzzle.solution,
    });
  } catch (error) {
    res.status(502).json({
      error: error instanceof Error ? error.message : 'Fish API is unavailable.',
    });
  }
});

export default puzzleRoutes;
