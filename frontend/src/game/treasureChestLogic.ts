import type { AdventureLevelDefinition, ChestCodeComplexity, ClueDefinition } from './levelManager';

export interface ChestState {
  isAvailable: boolean;
  isUnlocked: boolean;
  currentCode: [number, number, number];
  collectedClues: ClueDefinition[];
  feedbackMessage: string | null;
  attemptsCount: number;
}

export class TreasureChestLogic {
  private targetCode: [number, number, number] = [3, 5, 2];
  private currentCode: [number, number, number] = [0, 0, 0];
  private collectedClueIds: Set<string> = new Set();
  private isUnlocked: boolean = false;
  private attemptsCount: number = 0;
  private requiredCluesCount: number = 2;
  private codeComplexity: ChestCodeComplexity = 'direct';

  constructor(level?: AdventureLevelDefinition) {
    if (level) this.setLevelConfig(level);
  }

  public setLevelConfig(level: AdventureLevelDefinition): void {
    this.targetCode = [...level.chestCombination];
    this.requiredCluesCount = level.difficultySettings.requiredCluesCount;
    this.codeComplexity = level.difficultySettings.chestCodeComplexity;
    this.currentCode = [0, 0, 0];
    this.collectedClueIds.clear();
    this.isUnlocked = false;
    this.attemptsCount = 0;
  }

  public getCodeComplexity(): ChestCodeComplexity {
    return this.codeComplexity;
  }

  public addClue(clueId: string): boolean {
    if (!this.collectedClueIds.has(clueId)) {
      this.collectedClueIds.add(clueId);
      return true;
    }
    return false;
  }

  public getCollectedClueCount(): number {
    return this.collectedClueIds.size;
  }

  public hasClue(clueId: string): boolean {
    return this.collectedClueIds.has(clueId);
  }

  public isChestAvailable(): boolean {
    return this.collectedClueIds.size >= this.requiredCluesCount;
  }

  public getDialDigit(index: number): number {
    return this.currentCode[index] ?? 0;
  }

  public adjustDial(index: number, delta: number): number {
    if (index >= 0 && index < 3) {
      let val = this.currentCode[index] + delta;
      if (val > 9) val = 0;
      if (val < 0) val = 9;
      this.currentCode[index] = val;
      return val;
    }
    return 0;
  }

  public setDial(index: number, digit: number): void {
    if (index >= 0 && index < 3 && digit >= 0 && digit <= 9) {
      this.currentCode[index] = digit;
    }
  }

  public getCurrentCode(): [number, number, number] {
    return [...this.currentCode];
  }

  public tryUnlock(): { success: boolean; message: string; buttonFound: boolean } {
    this.attemptsCount += 1;
    const isMatch =
      this.currentCode[0] === this.targetCode[0] &&
      this.currentCode[1] === this.targetCode[1] &&
      this.currentCode[2] === this.targetCode[2];

    if (isMatch) {
      this.isUnlocked = true;
      return {
        success: true,
        message: 'Click! The chest pops open!',
        buttonFound: true,
      };
    }

    return {
      success: false,
      message: 'Not quite. Check your clues and try again.',
      buttonFound: false,
    };
  }

  public isChestUnlocked(): boolean {
    return this.isUnlocked;
  }

  public reset(): void {
    this.currentCode = [0, 0, 0];
    this.collectedClueIds.clear();
    this.isUnlocked = false;
    this.attemptsCount = 0;
  }
}
