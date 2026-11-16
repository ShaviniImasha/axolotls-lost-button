// Import services used for authentication, audio, leaderboard and game settings.
import { authService, type PlayerProfileData } from '../services/authService';
import { audioService } from '../services/audioService';
import { leaderboardService, type RankedLeaderboardEntry } from '../services/leaderboardService';

// Import managers that handle different parts of the game.
import { LevelManager, type AdventureLevelDefinition, type Difficulty, type LevelId } from './levelManager';
import { HiddenObjectManager } from './hiddenObjectManager';
import { PuzzleManager } from './puzzleManager';
import { ScoringSystem } from './scoringSystem';
import { TimerManager } from './timerManager';
import { settingsService } from '../services/settingsService';
import { HintManager } from './hintManager';
import { TreasureChestLogic } from './treasureChestLogic';
import { playerProgressManager } from './playerProgressManager';

// Defines all the screens that the player can navigate to in the game.
export type ScreenState =
  | 'landing'
  | 'login'
  | 'register'
  | 'home'
  | 'level-select'
  | 'exploration'
  | 'level-complete'
  | 'leaderboard'
  | 'profile';

// Stores the current game information, including player details,
// selected level, score, timer, hints, overlays and leaderboard data.
export interface ControllerState {
  currentScreen: ScreenState;
  isFishOverlayOpen: boolean;
  isChestModalOpen: boolean;
  isPauseOverlayOpen: boolean;
  confirmDialog: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    confirmAction: string;
    cancelAction: string;
  } | null;
  player: PlayerProfileData | null;
  currentLevel: AdventureLevelDefinition;
  nextLevelId: LevelId | null;
  completedLevelScore: number;
  pearlsEarnedThisLevel: number;
  timeRemainingStr: string;
  timeFraction: number;
  hintsRemaining: number;
  highlightedCoords: { x: number; y: number } | null;
  axoSpeech: string;
  chestFeedbackMessage: string | null;
  chestFeedbackIsError: boolean;
  authError: string | null;
  leaderboardEntries: RankedLeaderboardEntry[];
  leaderboardDifficulty: Difficulty | 'all';
  hasActiveRun: boolean;
}

export class GameController {
  private levelManager: LevelManager;
  private hiddenObjectManager: HiddenObjectManager;
  private puzzleManager: PuzzleManager;
  private scoringSystem: ScoringSystem;
  private timerManager: TimerManager;
  private hintManager: HintManager;
  private chestLogic: TreasureChestLogic;

  private state: ControllerState;
  private listeners: ((state: ControllerState) => void)[] = [];
  private highlightTimeout: number | null = null;
  private speechTimeout: number | null = null;

  constructor() {
    this.levelManager = new LevelManager();
    const initialLevel = this.levelManager.getCurrentLevel();

    this.hiddenObjectManager = new HiddenObjectManager(initialLevel.id);
    this.puzzleManager = new PuzzleManager();
    this.scoringSystem = new ScoringSystem(0);
    this.timerManager = new TimerManager(initialLevel.difficultySettings.timeLimit);
    this.hintManager = new HintManager(initialLevel.difficultySettings.maxHints);
    this.chestLogic = new TreasureChestLogic(initialLevel);

    this.state = {
      currentScreen: 'landing',
      isFishOverlayOpen: false,
      isChestModalOpen: false,
      isPauseOverlayOpen: false,
      confirmDialog: null,
      player: null,
      currentLevel: initialLevel,
      timeRemainingStr: this.timerManager.getFormattedTime(),
      timeFraction: 1,
      hintsRemaining: initialLevel.difficultySettings.maxHints,
      highlightedCoords: null,
      axoSpeech: 'Psst... look for a glimmer!',
      chestFeedbackMessage: null,
      chestFeedbackIsError: false,
      authError: null,
      leaderboardEntries: [],
      leaderboardDifficulty: 'all',
      hasActiveRun: false,
      nextLevelId: null,
      completedLevelScore: 0,
      pearlsEarnedThisLevel: 0,
    };

    this.levelManager.setCurrentLevelId('pond-easy');

    this.initSubscriptions();
  }

  private initSubscriptions(): void {
    authService.onAuthChange((user) => {
      this.state.player = user;
      if (user) {
        this.levelManager.syncProgress(user.unlockedLevels, user.completedLevels);
        if (this.state.currentScreen === 'landing' || this.state.currentScreen === 'login' || this.state.currentScreen === 'register') {
          this.state.currentScreen = 'home';
        }
      } else {
        if (this.state.currentScreen !== 'login' && this.state.currentScreen !== 'register') {
          this.state.currentScreen = 'landing';
        }
        this.state.hasActiveRun = false;
        this.timerManager.stop();
      }
      this.emitChange();
    });
  }

  public subscribe(listener: (state: ControllerState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emitChange(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  public getState(): ControllerState {
    return this.state;
  }

  public getLevelManager(): LevelManager {
    return this.levelManager;
  }

  public getHiddenObjectManager(): HiddenObjectManager {
    return this.hiddenObjectManager;
  }

  public getPuzzleManager(): PuzzleManager {
    return this.puzzleManager;
  }

  public getChestLogic(): TreasureChestLogic {
    return this.chestLogic;
  }

  public getScoringSystem(): ScoringSystem {
    return this.scoringSystem;
  }

  public setScreen(screen: ScreenState): void {
    if (screen !== 'exploration') {
      this.timerManager.stop();
    }
    this.state.currentScreen = screen;
    this.state.isFishOverlayOpen = false;
    this.state.isChestModalOpen = false;
    this.state.isPauseOverlayOpen = false;
    this.state.confirmDialog = null;
    this.emitChange();
  }

  public selectLevelPreview(levelId: LevelId): void {
    const lvl = this.levelManager.getLevelById(levelId);
    if (lvl) {
      this.state.currentLevel = lvl;
      this.emitChange();
    }
  }

  public async startLevel(levelId: LevelId): Promise<void> {
    if (!this.levelManager.isLevelUnlocked(levelId)) return;
    if (!this.levelManager.setCurrentLevelId(levelId)) return;
    const level = this.levelManager.getCurrentLevel();

    this.hiddenObjectManager.setLevel(level.id);
    this.hintManager.setLevel(level);
    this.chestLogic.setLevelConfig(level);
    const extraTime = settingsService.get('relaxedTimer') ? 60 : 0;
    this.timerManager.setLevel(level, extraTime);
    this.puzzleManager.setDifficulty(level.difficultySettings.fishPuzzleComplexity);
    this.puzzleManager.reset();
    this.scoringSystem.reset();

    this.state.currentLevel = level;
    this.state.nextLevelId = null;
    this.state.completedLevelScore = 0;
    this.state.pearlsEarnedThisLevel = 0;
    this.state.hintsRemaining = level.difficultySettings.maxHints;
    this.state.highlightedCoords = null;
    this.state.chestFeedbackMessage = null;
    this.state.chestFeedbackIsError = false;
    this.state.axoSpeech = `Welcome to ${level.realm.name} - ${capitalize(level.difficulty)}! Look for glimmers!`;
    this.state.hasActiveRun = true;
    this.state.currentScreen = 'exploration';
    this.state.isFishOverlayOpen = false;
    this.state.isChestModalOpen = false;
    this.state.isPauseOverlayOpen = false;
    void playerProgressManager.setCurrentLevel(level.id);

    audioService.play(level.realm.ambientAudio);

    // Start timer
    this.timerManager.start(
      (_remaining, formatted, fraction) => {
        this.state.timeRemainingStr = formatted;
        this.state.timeFraction = fraction;
        this.emitChange();
      },
      () => {
        // Time is up
        audioService.play('timeUp');
        this.setAxoSpeech('Time’s up! Pip needs a tiny breather.');
        this.state.confirmDialog = {
          isOpen: true,
          title: 'Time swam by!',
          message: 'Pip got distracted by a bubble. Want another go?',
          confirmLabel: 'ONE MORE GO',
          confirmAction: 'retry-current-level',
          cancelAction: 'quit-to-home',
        };
        this.emitChange();
      },
    );

    this.emitChange();
  }

  public handleObjectClick(objectId: string): void {
    if (this.state.isPauseOverlayOpen || this.state.isFishOverlayOpen || this.state.isChestModalOpen) return;

    const result = this.hiddenObjectManager.discover(objectId);
    if (!result.success) {
      this.setAxoSpeech(result.message);
      return;
    }

    if (result.clueAwardedId) {
      audioService.play('clue');
      this.chestLogic.addClue(result.clueAwardedId);
      void playerProgressManager.addClue(result.clueAwardedId);
    } else if (result.pearlsEarned > 0) {
      this.state.pearlsEarnedThisLevel += result.pearlsEarned;
      audioService.play('found');
      void playerProgressManager.addPearls(result.pearlsEarned);
    } else if (result.pointsEarned >= 10) {
      audioService.play('treasure');
    } else {
      audioService.play('found');
    }

    this.scoringSystem.applyAction(result.pointsEarned >= 10 ? 'find-treasure' : 'find-normal');
    void playerProgressManager.addScore(result.pointsEarned);

    this.setAxoSpeech(result.message);
    this.emitChange();
  }

  public async openFishPuzzle(): Promise<void> {
    if (this.state.isPauseOverlayOpen) return;
    audioService.play('bubble');
    this.state.isFishOverlayOpen = true;
    this.emitChange();

    try {
      await this.puzzleManager.loadPuzzle();
      this.emitChange();
    } catch {
      this.emitChange();
    }
  }

  public closeFishPuzzle(): void {
    audioService.play('bubble');
    this.puzzleManager.abort();
    this.state.isFishOverlayOpen = false;
    this.emitChange();
  }

  public submitFishAnswer(): void {
    const result = this.puzzleManager.submitAnswer();
    if (!result.feedback) return;

    if (result.correct) {
      audioService.play('correct');
      this.scoringSystem.applyAction('fish-correct');
      void playerProgressManager.addScore(10);
      void playerProgressManager.addPearls(1);
      this.state.pearlsEarnedThisLevel += 1;

      // Find an unassigned fish clue for this level and grant it
      const level = this.state.currentLevel;
      const ungatheredFishClue = level.clues.find(
        (c) => c.source === 'fish' && !this.chestLogic.hasClue(c.id),
      );
      if (ungatheredFishClue) {
        this.chestLogic.addClue(ungatheredFishClue.id);
        void playerProgressManager.addClue(ungatheredFishClue.id);
      }
      this.setAxoSpeech('Fish-tastic! +10 points and a clue!');
    } else {
      audioService.play('incorrect');
      this.scoringSystem.applyAction('fish-incorrect');
      void playerProgressManager.addScore(-5);
      this.setAxoSpeech('Oops, not quite! -5 points. Have another go.');
    }
    this.emitChange();
  }

  public useFishHint(): void {
    const eliminated = this.puzzleManager.useHint();
    if (eliminated !== null) {
      audioService.play('hint');
      this.emitChange();
    }
  }

  public useExplorationHint(): void {
    if (this.state.hintsRemaining <= 0) {
      this.setAxoSpeech('Pip is out of hints. Time to trust those detective fins!');
      return;
    }

    const unfound = this.hiddenObjectManager.getUnfoundObjects();
    const cluesRemaining =
      this.state.currentLevel.difficultySettings.requiredCluesCount - this.chestLogic.getCollectedClueCount();
    const result = this.hintManager.requestHint(unfound, cluesRemaining);

    if (result.success) {
      audioService.play('hint');
      this.state.hintsRemaining = result.hintsRemaining;
      this.setAxoSpeech(result.message);

      if (result.type === 'object-location' && result.targetCoords) {
        this.state.highlightedCoords = result.targetCoords;
        if (this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
        this.highlightTimeout = window.setTimeout(() => {
          this.state.highlightedCoords = null;
          this.emitChange();
        }, 5000);
      }
    } else {
      this.setAxoSpeech(result.message);
    }
    this.emitChange();
  }

  public openChestModal(): void {
    audioService.play('bubble');
    this.state.isChestModalOpen = true;
    this.state.chestFeedbackMessage = null;
    this.state.chestFeedbackIsError = false;
    this.emitChange();
  }

  public closeChestModal(): void {
    audioService.play('bubble');
    this.state.isChestModalOpen = false;
    this.emitChange();
  }

  public adjustChestDial(index: number, delta: number): void {
    audioService.play('bubble');
    this.chestLogic.adjustDial(index, delta);
    this.emitChange();
  }

  public submitChestUnlock(): void {
    if (this.chestLogic.isChestUnlocked()) return;
    const result = this.chestLogic.tryUnlock();
    if (result.success) {
      audioService.play('chestUnlock');
      setTimeout(() => audioService.play('buttonFound'), 400);
      const scoreBeforeWinBonus = this.scoringSystem.getScore();
      this.scoringSystem.applyAction('level-complete');
      const finalScore = this.scoringSystem.finalizeScore(this.state.currentLevel.difficultySettings);

      const currentLevelId = this.state.currentLevel.id;
      const nextLevelInfo = this.levelManager.completeCurrentLevel();
      this.state.nextLevelId = nextLevelInfo.nextLevelId;
      this.state.completedLevelScore = finalScore;
      void playerProgressManager.completeLevel(currentLevelId, scoreBeforeWinBonus, finalScore);

      this.state.chestFeedbackMessage = result.message;
      this.state.chestFeedbackIsError = false;
      this.timerManager.stop();
      this.setAxoSpeech('Pip’s button! You found it!');
    } else {
      audioService.play('incorrect');
      this.state.chestFeedbackMessage = result.message;
      this.state.chestFeedbackIsError = true;
    }
    this.emitChange();
  }

  public claimLevelComplete(): void {
    audioService.play('buttonFound');
    this.state.isChestModalOpen = false;
    this.state.hasActiveRun = false;
    this.state.currentScreen = 'level-complete';
    this.emitChange();
  }

  public pauseGame(): void {
    this.timerManager.pause();
    this.state.isPauseOverlayOpen = true;
    this.emitChange();
  }

  public resumeGame(): void {
    this.timerManager.resume();
    this.state.isPauseOverlayOpen = false;
    this.emitChange();
  }

  public setAxoSpeech(speech: string): void {
    this.state.axoSpeech = speech;
    if (this.speechTimeout) window.clearTimeout(this.speechTimeout);
    this.speechTimeout = window.setTimeout(() => {
      this.state.axoSpeech = 'Keep exploring! The pond has many secrets.';
      this.emitChange();
    }, 6000);
    this.emitChange();
  }

  public async openLeaderboard(difficulty: Difficulty | 'all' = 'all'): Promise<void> {
    audioService.play('bubble');
    this.state.leaderboardDifficulty = difficulty;
    const p = this.state.player;
    const entries = await leaderboardService.getLeaderboard(
      p?.playerId,
      p?.name,
      p?.totalScore,
      p?.collectedPearls,
      p?.completedLevels?.length,
      difficulty,
      p?.levelProgress,
      p?.completedLevels,
    );
    this.state.leaderboardEntries = entries;
    this.setScreen('leaderboard');
  }

  public showConfirm(dialog: ControllerState['confirmDialog']): void {
    this.state.confirmDialog = dialog;
    this.emitChange();
  }

  public dismissConfirm(): void {
    this.state.confirmDialog = null;
    this.emitChange();
  }
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const gameController = new GameController();
