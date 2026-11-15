/**
 * Puzzle Controller
 * Model-View-Controller (MVC) - Controller Layer
 * Coordinates Fish API math challenges, option selection, hints, and feedback.
 */

import { PuzzleModel, type PuzzleModelState } from '../models/PuzzleModel';
import { fishApiService } from '../services/FishApiService';
import { audioService } from '../services/audioService';

export class PuzzleController {
  private puzzleModel: PuzzleModel;

  constructor(puzzleModel?: PuzzleModel) {
    this.puzzleModel = puzzleModel || new PuzzleModel();
  }

  public getModel(): PuzzleModel {
    return this.puzzleModel;
  }

  public getState(): PuzzleModelState {
    return this.puzzleModel.getState();
  }

  /**
   * Load new fish math riddle from Fish API
   */
  public async loadNewChallenge(): Promise<void> {
    this.puzzleModel.setLoading(true);
    try {
      const puzzle = await fishApiService.getPuzzle();
      this.puzzleModel.setPuzzle(puzzle);
    } catch {
      this.puzzleModel.setError('Pip could not reach the fish teacher. Try again!');
    }
  }

  /**
   * Handle user picking an answer option
   */
  public selectOption(option: number): void {
    this.puzzleModel.selectAnswer(option);
  }

  /**
   * Submit answer and return outcome
   */
  public submitAnswer(): { isCorrect: boolean; solution: number } {
    const outcome = this.puzzleModel.submitAnswer();
    if (outcome.isCorrect) {
      audioService.play('bubble');
    } else {
      audioService.play('bubble');
    }
    return outcome;
  }

  /**
   * Use hint to eliminate wrong answer options
   */
  public useHint(): number[] {
    return this.puzzleModel.useEliminationHint();
  }

  public reset(): void {
    this.puzzleModel.reset();
  }
}

export const puzzleController = new PuzzleController();
