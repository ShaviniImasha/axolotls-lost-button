import { fetchFishPuzzle, preloadPuzzleImage, type FishPuzzle, FishApiError } from '../api/fishApi';
import type { DifficultySettings } from './levelManager';

export type PuzzleFeedback = 'correct' | 'incorrect' | null;

export interface PuzzleState {
  current: FishPuzzle | null;
  loading: boolean;
  error: string | null;
  selectedAnswer: number | null;
  submitted: boolean;
  feedback: PuzzleFeedback;
  hintUsed: boolean;
  eliminatedOption: number | null;
  eliminatedOptions: number[];
  answerOptions: number[];
  solvedCount: number;
}

export class PuzzleManager {
  private state: PuzzleState = {
    current: null,
    loading: false,
    error: null,
    selectedAnswer: null,
    submitted: false,
    feedback: null,
    hintUsed: false,
    eliminatedOption: null,
    eliminatedOptions: [],
    answerOptions: [],
    solvedCount: 0,
  };

  private abortController: AbortController | null = null;
  private complexity: DifficultySettings['fishPuzzleComplexity'] = {
    answerOptionCount: 4,
    hintEliminationCount: 2,
  };

  public setDifficulty(complexity: DifficultySettings['fishPuzzleComplexity']): void {
    this.complexity = complexity;
  }

  public getState(): PuzzleState {
    return { ...this.state };
  }

  public async loadPuzzle(): Promise<FishPuzzle> {
    if (this.state.loading) {
      throw new Error('A puzzle is already loading.');
    }

    this.abortController?.abort();
    this.abortController = new AbortController();

    this.state.loading = true;
    this.state.error = null;
    this.state.selectedAnswer = null;
    this.state.submitted = false;
    this.state.feedback = null;
    this.state.hintUsed = false;
    this.state.eliminatedOption = null;
    this.state.eliminatedOptions = [];
    this.state.answerOptions = [];

    try {
      const puzzle = await fetchFishPuzzle(this.abortController.signal);
      await preloadPuzzleImage(puzzle.imageUrl);
      this.state.current = puzzle;
      this.state.answerOptions = this.createAnswerOptions(puzzle.solution);
      this.state.loading = false;
      return puzzle;
    } catch (err) {
      this.state.loading = false;
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw err;
      }
      const message =
        err instanceof FishApiError
          ? err.message
          : 'Could not connect to the Fish Puzzle service. Please check your internet connection.';
      this.state.error = message;
      throw new Error(message);
    }
  }

  public selectAnswer(answer: number): void {
    if (
      this.state.submitted ||
      this.state.loading ||
      !this.state.answerOptions.includes(answer) ||
      this.state.eliminatedOptions.includes(answer)
    ) return;
    this.state.selectedAnswer = answer;
  }

  public submitAnswer(): { correct: boolean; pointsDelta: number; feedback: PuzzleFeedback } {
    if (!this.state.current || this.state.submitted || this.state.selectedAnswer === null) {
      return { correct: false, pointsDelta: 0, feedback: null };
    }

    this.state.submitted = true;
    const isCorrect = this.state.selectedAnswer === this.state.current.solution;

    if (isCorrect) {
      this.state.feedback = 'correct';
      this.state.solvedCount += 1;
      return { correct: true, pointsDelta: 10, feedback: 'correct' };
    } else {
      this.state.feedback = 'incorrect';
      return { correct: false, pointsDelta: -5, feedback: 'incorrect' };
    }
  }

  public retryCurrentQuestion(): void {
    if (this.state.feedback === 'incorrect') {
      this.state.submitted = false;
      this.state.feedback = null;
      this.state.selectedAnswer = null;
    }
  }

  public useHint(): number | null {
    if (!this.state.current || this.state.hintUsed || this.state.submitted) return null;

    const wrongOptions = this.state.answerOptions.filter((option) => option !== this.state.current?.solution);
    const eliminateCount = Math.min(wrongOptions.length, Math.max(this.complexity.hintEliminationCount, 4));
    this.state.eliminatedOptions = wrongOptions.slice(0, eliminateCount);
    const eliminated = this.state.eliminatedOptions[0] ?? null;
    this.state.hintUsed = true;
    this.state.eliminatedOption = eliminated;
    return eliminated;
  }

  public abort(): void {
    this.abortController?.abort();
    this.abortController = null;
    this.state.loading = false;
  }

  public reset(): void {
    this.abort();
    this.state = {
      current: null,
      loading: false,
      error: null,
      selectedAnswer: null,
      submitted: false,
      feedback: null,
      hintUsed: false,
      eliminatedOption: null,
      eliminatedOptions: [],
      answerOptions: [],
      solvedCount: 0,
    };
  }

  private createAnswerOptions(_solution: number): number[] {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  }
}
