/**
 * Game Model
 * Model-View-Controller (MVC) - Model Layer
 * Represents overall game session state, lifecycle, phase transitions, and active parameters.
 */

import type { AdventureLevelDefinition, ClueDefinition } from '../game/levelManager';
import { ObjectModel, type HiddenObjectData } from './ObjectModel';
import { ScoreModel } from './ScoreModel';
import { TreasureChestLogic } from '../game/treasureChestLogic';

export type GamePhase = 'idle' | 'exploring' | 'puzzle' | 'chest' | 'completed' | 'timeout';

export interface GameSessionState {
  phase: GamePhase;
  level: AdventureLevelDefinition;
  timeRemaining: number;
  isPaused: boolean;
  score: number;
  hintsRemaining: number;
  chestAvailable: boolean;
  chestUnlocked: boolean;
}

export class GameModel {
  private level: AdventureLevelDefinition;
  private phase: GamePhase = 'idle';
  private timeRemaining: number = 90;
  private isPaused: boolean = false;
  private hintsRemaining: number = 3;
  private objectModel: ObjectModel;
  private scoreModel: ScoreModel;
  private chestLogic: TreasureChestLogic;

  constructor(level: AdventureLevelDefinition, objects: HiddenObjectData[] = []) {
    this.level = level;
    this.objectModel = new ObjectModel(objects);
    this.scoreModel = new ScoreModel(0);
    this.chestLogic = new TreasureChestLogic(level);
    this.resetSession(level);
  }

  public resetSession(level: AdventureLevelDefinition, objects: HiddenObjectData[] = []): void {
    this.level = level;
    this.phase = 'exploring';
    this.timeRemaining = level.difficultySettings.timeLimit;
    this.isPaused = false;
    this.hintsRemaining = level.difficultySettings.maxHints;
    this.objectModel.setObjects(objects);
    this.scoreModel.reset();
    this.chestLogic.setLevelConfig(level);
  }

  public getPhase(): GamePhase {
    return this.phase;
  }

  public setPhase(phase: GamePhase): void {
    this.phase = phase;
  }

  public getLevel(): AdventureLevelDefinition {
    return this.level;
  }

  public getTimeRemaining(): number {
    return this.timeRemaining;
  }

  public decrementTime(): number {
    if (this.timeRemaining > 0 && !this.isPaused) {
      this.timeRemaining -= 1;
      if (this.timeRemaining === 0) {
        this.phase = 'timeout';
      }
    }
    return this.timeRemaining;
  }

  public addBonusTime(seconds: number): void {
    this.timeRemaining += seconds;
  }

  public isGamePaused(): boolean {
    return this.isPaused;
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
  }

  public getHintsRemaining(): number {
    return this.hintsRemaining;
  }

  public useHint(): boolean {
    if (this.hintsRemaining > 0) {
      this.hintsRemaining -= 1;
      return true;
    }
    return false;
  }

  public getObjectModel(): ObjectModel {
    return this.objectModel;
  }

  public getScoreModel(): ScoreModel {
    return this.scoreModel;
  }

  public getChestLogic(): TreasureChestLogic {
    return this.chestLogic;
  }

  public getState(): GameSessionState {
    return {
      phase: this.phase,
      level: this.level,
      timeRemaining: this.timeRemaining,
      isPaused: this.isPaused,
      score: this.scoreModel.getScore(),
      hintsRemaining: this.hintsRemaining,
      chestAvailable: this.chestLogic.isChestAvailable(),
      chestUnlocked: this.chestLogic.getCurrentCode().join('') === this.level.chestCombination.join(''),
    };
  }
}
