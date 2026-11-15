export interface HintResult {
  success: boolean;
  type: 'object-location' | 'clue-guidance' | 'none';
  targetObjectId?: string;
  targetCoords?: { x: number; y: number };
  message: string;
  hintsRemaining: number;
}

export class HintManager {
  private maxHints: number;
  private hintsRemaining: number;

  constructor(maxHints: number = 3) {
    this.maxHints = maxHints;
    this.hintsRemaining = maxHints;
  }

  public setMaxHints(maxHints: number): void {
    this.maxHints = maxHints;
    this.hintsRemaining = maxHints;
  }

  public setLevel(level: AdventureLevelDefinition): void {
    this.setMaxHints(level.difficultySettings.maxHints);
  }

  public getHintsRemaining(): number {
    return this.hintsRemaining;
  }

  public getMaxHints(): number {
    return this.maxHints;
  }

  public requestHint(
    unfoundObjects: { id: string; name: string; x: number; y: number; required: boolean }[],
    cluesRemaining: number,
    combinationHint?: string,
  ): HintResult {
    if (this.hintsRemaining <= 0) {
      return {
        success: false,
        type: 'none',
        message: 'Pip is out of hints. Time to trust those detective fins!',
        hintsRemaining: 0,
      };
    }

    this.hintsRemaining -= 1;

    // Prefer required unfound objects first
    const requiredUnfound = unfoundObjects.filter((o) => o.required);
    const target = requiredUnfound.length > 0 ? requiredUnfound[0] : unfoundObjects[0];

    if (target) {
      return {
        success: true,
        type: 'object-location',
        targetObjectId: target.id,
        targetCoords: { x: target.x, y: target.y },
        message: `Pip spotted a shimmer near the ${target.name}!`,
        hintsRemaining: this.hintsRemaining,
      };
    }

    if (cluesRemaining > 0) {
      return {
        success: true,
        type: 'clue-guidance',
        message: 'Ask a fish for a riddle. They love to show off.',
        hintsRemaining: this.hintsRemaining,
      };
    }

    return {
      success: true,
      type: 'clue-guidance',
      message: combinationHint || 'All clues found! Go give that chest a spin.',
      hintsRemaining: this.hintsRemaining,
    };
  }

  public reset(): void {
    this.hintsRemaining = this.maxHints;
  }
}
import type { AdventureLevelDefinition } from './levelManager';
