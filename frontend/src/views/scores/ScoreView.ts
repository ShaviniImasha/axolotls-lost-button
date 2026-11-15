/**
 * Score View
 * Model-View-Controller (MVC) - View Layer
 * Renders score badges, score pills, and calculation breakdowns.
 */

import type { ScoreBreakdown } from '../../models/ScoreModel';

export interface ScoreViewProps {
  score: number;
  breakdown?: ScoreBreakdown;
}

export class ScoreView {
  public static render(props: ScoreViewProps): string {
    return `
      <div class="score-display-container">
        <span class="score-label">POINTS</span>
        <strong class="score-numeric">${props.score}</strong>
        ${
          props.breakdown
            ? `
              <div class="score-breakdown-tooltip">
                <div>Items: +${props.breakdown.foundItemsBonus}</div>
                <div>Chest: +${props.breakdown.chestBonus}</div>
                <div>Multiplier: x${props.breakdown.multiplier}</div>
              </div>
            `
            : ''
        }
      </div>
    `;
  }
}
