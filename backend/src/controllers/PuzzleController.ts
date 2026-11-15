/**
 * Puzzle Controller
 * Backend MVC - Controller Layer
 * Handles Fish API riddle fetching, option distribution, and answer verification.
 */

import type { Request, Response } from 'express';
import { fishApiService } from '../services/FishApiService';
import { PuzzleModel } from '../models/PuzzleModel';

export class PuzzleController {
  /**
   * GET /api/puzzles/challenge
   * Retrieves a new puzzle challenge with image and option choices
   */
  public static async getChallenge(req: Request, res: Response): Promise<void> {
    try {
      const optionCount = Number(req.query.optionCount) === 6 ? 6 : Number(req.query.optionCount) === 10 ? 10 : 4;
      const puzzleData = await fishApiService.fetchPuzzle();
      const options = fishApiService.generateOptions(puzzleData.solution, optionCount);

      const puzzleModel = new PuzzleModel(puzzleData, options);

      res.json({
        imageUrl: puzzleModel.getPuzzle().imageUrl,
        options: puzzleModel.getOptions(),
        solution: puzzleModel.getPuzzle().solution, // Provided for client verification / feedback
      });
    } catch (err) {
      const fallback = fishApiService.getFallbackPuzzle();
      res.json({
        imageUrl: fallback.imageUrl,
        options: [1, 3, 5, 7],
        solution: fallback.solution,
      });
    }
  }

  /**
   * POST /api/puzzles/verify
   * Validates player solution submission
   */
  public static verifyAnswer(req: Request, res: Response): void {
    const { answer, expectedSolution } = req.body;
    const isCorrect = Number(answer) === Number(expectedSolution);
    res.json({
      success: isCorrect,
      isCorrect,
      solution: expectedSolution,
      pointsAwarded: isCorrect ? 10 : -5,
    });
  }
}
