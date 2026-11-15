/**
 * Puzzle Model
 * Model-View-Controller (MVC) - Model Layer
 * Manages Fish API puzzle state, options, elimination hints, user answers, and validation results.
 */

import type { FishPuzzle } from '../api/fishApi';
import type { DifficultySettings } from '../game/levelManager';

export type PuzzleFeedback = 'correct' | 'incorrect' | null;

export interface PuzzleModelState {
  current: FishPuzzle | null;
  loading: boolean;
  error: string | null;
  selectedAnswer: number | null;
  submitted: boolean;
  feedback: PuzzleFeedback;
  hintUsed: boolean;
  eliminatedOptions: number[];
  answerOptions: number[];
  solvedCount: number;
}

export class PuzzleModel {
  private state: PuzzleModelState = {
    current: null,
    loading: false,
    error: null,
    selectedAnswer: null,
    submitted: false,
    feedback: null,
    hintUsed: false,
    eliminatedOptions: [],
    answerOptions: [],
    solvedCount: 0,
  };

  private complexity: DifficultySettings['fishPuzzleComplexity'] = {
    answerOptionCount: 4,
    hintEliminationCount: 2,
  };

  public setDifficulty(complexity: DifficultySettings['fishPuzzleComplexity']): void {
    this.complexity = complexity;
  }

  public getState(): PuzzleModelState {
    return { ...this.state, eliminatedOptions: [...this.state.eliminatedOptions], answerOptions: [...this.state.answerOptions] };
  }

  public setLoading(loading: boolean): void {
    this.state.loading = loading;
    if (loading) {
      this.state.error = null;
      this.state.selectedAnswer = null;
      this.state.submitted = false;
      this.state.feedback = null;
      this.state.hintUsed = false;
      this.state.eliminatedOptions = [];
    }
  }

  public setPuzzle(puzzle: FishPuzzle): void {
    this.state.current = puzzle;
    this.state.loading = false;
    this.state.error = null;
    this.state.answerOptions = this.generateOptions(puzzle.solution, this.complexity.answerOptionCount);
  }

  public setError(errorMessage: string): void {
    this.state.error = errorMessage;
    this.state.loading = false;
  }

  public selectAnswer(answer: number): void {
    if (this.state.submitted) return;
    this.state.selectedAnswer = answer;
  }

  public submitAnswer(): { isCorrect: boolean; solution: number } {
    if (!this.state.current || this.state.selectedAnswer === null) {
      throw new Error('Cannot submit without active puzzle and selection.');
    }
    const isCorrect = this.state.selectedAnswer === this.state.current.solution;
    this.state.submitted = true;
    this.state.feedback = isCorrect ? 'correct' : 'incorrect';
    if (isCorrect) {
      this.state.solvedCount += 1;
    }
    return { isCorrect, solution: this.state.current.solution };
  }

  public useEliminationHint(): number[] {
    if (!this.state.current || this.state.hintUsed) return [];
    const solution = this.state.current.solution;
    const incorrect = this.state.answerOptions.filter((opt) => opt !== solution && !this.state.eliminatedOptions.includes(opt));
    
    // Eliminate options up to hintEliminationCount
    const count = Math.min(this.complexity.hintEliminationCount, incorrect.length);
    const newlyEliminated = incorrect.slice(0, count);
    this.state.eliminatedOptions.push(...newlyEliminated);
    this.state.hintUsed = true;
    return newlyEliminated;
  }

  private generateOptions(solution: number, count: number): number[] {
    const opts = new Set<number>([solution]);
    while (opts.size < count) {
      opts.add(Math.floor(Math.random() * 10));
    }
    return Array.from(opts).sort(() => Math.random() - 0.5);
  }

  public reset(): void {
    this.state = {
      current: null,
      loading: false,
      error: null,
      selectedAnswer: null,
      submitted: false,
      feedback: null,
      hintUsed: false,
      eliminatedOptions: [],
      answerOptions: [],
      solvedCount: 0,
    };
  }
}
