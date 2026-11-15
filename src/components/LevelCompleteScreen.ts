import { assetUrl } from '../assets';
import type { AdventureLevelDefinition } from '../game/levelManager';

export interface LevelCompleteScreenProps {
  level: AdventureLevelDefinition;
  totalScore: number;
  pearlsEarned: number;
  hasNextLevel: boolean;
  nextLevelId: string | null;
}

export function renderLevelCompleteScreen(props: LevelCompleteScreenProps): string {
  const { level, totalScore, pearlsEarned, hasNextLevel, nextLevelId } = props;

  return `
    <main class="game-shell reward-shell">
      <section class="reward-scene ${level.realm.accentClass}">
        <!-- Floating bubbles in the background -->
        <div class="scene-bubbles bubbles-a"><img src="${assetUrl('bubbles')}" alt=""></div>
        <div class="scene-bubbles bubbles-b"><img src="${assetUrl('bubbles')}" alt=""></div>

        <!-- Kawaii Reward Card -->
        <div class="reward-card kawaii-reward-card" role="dialog" aria-labelledby="complete-title">
          
          <!-- Hero Axolotl with Recovered Button -->
          <div class="celebration-hero">
            <img src="${assetUrl('axolotl-excited')}" class="reward-axo float-bob" alt="Pip cheering">
            <div class="recovered-button-badge">
              <img src="${assetUrl('button-lost')}" class="mini-lost-button" alt="The recovered magical button">
              <span>Pip's Button Rescued!</span>
            </div>
          </div>

          <!-- Kicker & Title -->
          <div class="reward-kicker-pill">
            <span>SPLASH-TACULAR!</span>
          </div>
          <h1 id="complete-title" class="reward-title">${escapeHtml(level.realm.name)} - ${capitalize(level.difficulty)} Cleared!</h1>
          <p class="reward-subtitle">You found all the clues and rescued Pip's lost button! Pip is so proud of you.</p>

          <!-- 3 Cute Smiling Stars -->
          <div class="star-rating-row kawaii-star-row">
            <img src="${assetUrl('star-happy')}" alt="Happy Star 1" class="win-star-kawaii star-1">
            <img src="${assetUrl('star-happy')}" alt="Happy Star 2" class="win-star-kawaii star-2">
            <img src="${assetUrl('star-happy')}" alt="Happy Star 3" class="win-star-kawaii star-3">
          </div>

          <!-- Pastel Candy Stat Cards -->
          <div class="reward-candy-grid">
            <div class="reward-candy-pill pill-peach">
              <span class="rc-label">BONUS</span>
              <strong class="rc-val">+30</strong>
            </div>

            <div class="reward-candy-pill pill-lavender">
              <div class="rc-icon-row">
                <img src="${assetUrl('pearl')}" alt="Pearls" class="rc-mini-icon">
                <span class="rc-label">PEARLS</span>
              </div>
              <strong class="rc-val">+${pearlsEarned}</strong>
            </div>

            <div class="reward-candy-pill pill-gold">
              <div class="rc-icon-row">
                <img src="${assetUrl('star-gold')}" alt="Score" class="rc-mini-icon">
                <span class="rc-label">SCORE</span>
              </div>
              <strong class="rc-val">${totalScore.toLocaleString()}</strong>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="reward-actions-row">
            ${
              hasNextLevel && nextLevelId
                ? `
                  <button class="bouncy-pill-btn btn-play-pond reward-action-btn" data-action="go-next-level" data-level-id="${nextLevelId}">
                    <img src="${assetUrl('icon-play')}" alt="" class="p-btn-icon">
                    <span>Next Adventure</span>
                  </button>
                `
                : `
                  <button class="bouncy-pill-btn btn-play-pond reward-action-btn" data-action="go-home">
                    <img src="${assetUrl('icon-home')}" alt="" class="p-btn-icon">
                    <span>Pond Cleared!</span>
                  </button>
                `
            }

            <button class="bouncy-pill-btn btn-settings reward-action-btn" data-action="go-home" title="Back to Pond Home">
              <img src="${assetUrl('icon-home')}" alt="" class="p-btn-icon">
              <span>Back to Pond</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  `;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]!);
}
