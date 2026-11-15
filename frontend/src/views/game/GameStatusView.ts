/**
 * Game Status View
 * Model-View-Controller (MVC) - View Layer
 * Renders the top in-game HUD (timer, hints remaining, score, pause button).
 */

import { assetUrl } from '../../assets';

export interface GameStatusViewProps {
  score: number;
  timeRemaining: number;
  hintsRemaining: number;
  levelTitle: string;
}

export class GameStatusView {
  public static render(props: GameStatusViewProps): string {
    const minutes = Math.floor(props.timeRemaining / 60);
    const seconds = (props.timeRemaining % 60).toString().padStart(2, '0');

    return `
      <header class="game-hud-bar">
        <div class="hud-stat-pill time-pill">
          <span class="hud-label">TIME</span>
          <span class="hud-val timer-text">${minutes}:${seconds}</span>
        </div>

        <div class="hud-stat-pill score-pill">
          <span class="hud-label">SCORE</span>
          <span class="hud-val score-counter">${props.score}</span>
        </div>

        <button class="hud-action-btn hint-btn" data-action="use-hint" title="Ask Pip for a Hint">
          <img src="${assetUrl('icon-hint')}" class="hud-icon" alt="Hint" />
          <span>HINT (${props.hintsRemaining})</span>
        </button>

        <button class="hud-action-btn pause-btn" data-action="pause-game" title="Pause Game">
          <img src="${assetUrl('icon-pause')}" class="hud-icon" alt="Pause" />
        </button>
      </header>
    `;
  }
}
