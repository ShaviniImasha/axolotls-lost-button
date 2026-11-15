/**
 * Puzzle Model
 * Backend MVC - Model Layer
 */

import type { FishPuzzleData } from '../services/FishApiService';

export class PuzzleModel {
  private puzzle: FishPuzzleData;
  private options: number[];

  constructor(puzzle: FishPuzzleData, options: number[]) {
    this.puzzle = puzzle;
    this.options = options;
  }

  public getPuzzle(): FishPuzzleData {
    return this.puzzle;
  }

  public getOptions(): number[] {
    return [...this.options];
  }

  public verifyAnswer(answer: number): boolean {
    return answer === this.puzzle.solution;
  }
}
