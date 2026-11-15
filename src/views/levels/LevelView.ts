/**
 * Level View
 * Model-View-Controller (MVC) - View Layer
 * Renders individual level card or level summary widget.
 */

import type { AdventureLevelDefinition } from '../../game/levelManager';
import { assetUrl } from '../../assets';

export interface LevelViewProps {
  level: AdventureLevelDefinition;
  isUnlocked: boolean;
  isCompleted: boolean;
  bestScore?: number;
}

export class LevelView {
  public static render(props: LevelViewProps): string {
    const { level, isUnlocked, isCompleted, bestScore = 0 } = props;

    return `
      <article class="level-card ${isUnlocked ? 'is-unlocked' : 'is-locked'} ${isCompleted ? 'is-completed' : ''}" data-level-id="${level.id}">
        <div class="level-header">
          <span class="difficulty-badge ${level.difficulty}">${level.difficulty.toUpperCase()}</span>
          ${isCompleted ? `<img src="${assetUrl('star-happy')}" class="card-star" alt="Completed" />` : ''}
        </div>
        <h4>${level.realm.name}</h4>
        <p class="mission-text">${level.missionDescription}</p>
        <div class="level-meta">
          <span>Time: ${level.difficultySettings.timeLimit}s</span>
          <span>Best: ${bestScore} pts</span>
        </div>
      </article>
    `;
  }
}
