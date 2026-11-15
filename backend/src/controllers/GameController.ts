/**
 * Game Controller (MVC)
 * Model-View-Controller (MVC) - Controller Layer
 * Coordinates active gameplay loop, timer ticks, hidden-object discovery, and chest unlocking.
 */

import { GameModel, type GamePhase, type GameSessionState } from '../models/GameModel';
import { ObjectController } from './ObjectController';
import { ScoreController } from './ScoreController';
import { PuzzleController } from './PuzzleController';
import { audioService } from '../services/audioService';
import type { AdventureLevelDefinition } from '../game/levelManager';

export class GameController {
  private gameModel: GameModel;
  private objectController: ObjectController;
  private scoreController: ScoreController;
  private puzzleController: PuzzleController;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private onStateChangeCallback?: (state: GameSessionState) => void;

  constructor(
    level: AdventureLevelDefinition,
    gameModel?: GameModel,
    objectController?: ObjectController,
    scoreController?: ScoreController,
    puzzleController?: PuzzleController,
  ) {
    this.gameModel = gameModel || new GameModel(level);
    this.objectController = objectController || new ObjectController(this.gameModel.getObjectModel());
    this.scoreController = scoreController || new ScoreController(this.gameModel.getScoreModel());
    this.puzzleController = puzzleController || new PuzzleController();
  }

  public setOnStateChange(cb: (state: GameSessionState) => void): void {
    this.onStateChangeCallback = cb;
  }

  public getModel(): GameModel {
    return this.gameModel;
  }

  public startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (!this.gameModel.isGamePaused()) {
        const remaining = this.gameModel.decrementTime();
        if (remaining <= 0) {
          this.handleTimeout();
        }
        this.notifyState();
      }
    }, 1000);
  }

  public stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  public pauseGame(): void {
    this.gameModel.setPaused(true);
    this.notifyState();
  }

  public resumeGame(): void {
    this.gameModel.setPaused(false);
    this.notifyState();
  }

  public handleTimeout(): void {
    this.stopTimer();
    this.gameModel.setPhase('timeout');
    this.notifyState();
  }

  public adjustChestDial(dialIndex: number, delta: number): number {
    const val = this.gameModel.getChestLogic().adjustDial(dialIndex, delta);
    audioService.play('bubble');
    this.notifyState();
    return val;
  }

  public tryUnlockChest(): { success: boolean; message: string; buttonFound: boolean } {
    const result = this.gameModel.getChestLogic().tryUnlock();
    if (result.success) {
      audioService.play('treasure');
      this.scoreController.handleScoreAction('level-complete');
      this.gameModel.setPhase('completed');
    }
    this.notifyState();
    return result;
  }

  private notifyState(): void {
    this.onStateChangeCallback?.(this.gameModel.getState());
  }
}
