import { assetUrl } from '../assets';
import type { AdventureLevelDefinition, ClueDefinition } from '../game/levelManager';
import { ArrowDown, ArrowRight, ArrowUp, Crown, Fish, KeyRound, ScrollText } from 'lucide';
import { lucideIcon } from './lucideIcon';

export interface TreasureChestModalProps {
  level: AdventureLevelDefinition;
  currentCode: [number, number, number];
  unlockedClues: ClueDefinition[];
  isChestUnlocked: boolean;
  feedbackMessage?: string | null;
  isError?: boolean;
}

export function renderTreasureChestModal(props: TreasureChestModalProps): string {
  const {
    level,
    currentCode,
    unlockedClues,
    isChestUnlocked,
    feedbackMessage,
    isError,
  } = props;

  return `
    <div class="game-dim chest-dim">
      <section class="chest-modal ${isChestUnlocked ? 'chest-unlocked-state' : ''}" role="dialog" aria-modal="true" aria-labelledby="chest-title">
        <div class="overlay-topline">
          <span>PIP’S VERY IMPORTANT CHEST</span>
          <button data-action="close-chest-modal" class="close-overlay-btn" title="Back to exploration">×</button>
        </div>

        <div class="chest-modal-heading">
          <span class="chapter-mark">CHEST BUSINESS</span>
          <h1 id="chest-title">${isChestUnlocked ? 'Pip’s button!' : 'Crack the chest'}</h1>
          <p>${isChestUnlocked ? 'Pip’s button was here the whole time. Of course it was.' : 'Use your clues to set the three dials.'}</p>
        </div>

        <div class="chest-stage-layout">
          <!-- Visual Chest & Lost Button Presentation -->
          <div class="chest-display-side">
            <div class="chest-art-container ${isChestUnlocked ? 'lid-open' : ''}">
              ${
                isChestUnlocked
                  ? `
                    <div class="lost-button-aura">
                      <div class="button-sunburst"></div>
                      <div class="lost-button-item">
                        <svg class="magical-button-svg" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="44" fill="#ff70a6" stroke="#fff" stroke-width="6"/>
                          <circle cx="50" cy="50" r="36" fill="#ff85b3" stroke="#ff4785" stroke-width="2"/>
                          <circle cx="38" cy="38" r="5" fill="#4d1933"/>
                          <circle cx="62" cy="38" r="5" fill="#4d1933"/>
                          <circle cx="38" cy="62" r="5" fill="#4d1933"/>
                          <circle cx="62" cy="62" r="5" fill="#4d1933"/>
                          <!-- Thread cross in center -->
                          <path d="M38 38L62 62M62 38L38 62" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
                        </svg>
                      </div>
                    </div>
                  `
                  : ''
              }

              <!-- The Treasure Chest SVG (Kawaii asset) -->
              <img src="${assetUrl('treasure-chest')}" class="modal-chest-svg" alt="Magical treasure chest">
            </div>

            <div class="chest-mascot-row">
              <img src="${assetUrl(isChestUnlocked ? 'axolotl-excited' : 'axolotl-happy')}" class="chest-axolotl" alt="Pip the axolotl">
              <span class="chest-speech">
                ${
                  isChestUnlocked
                    ? 'My button! I missed you.'
                    : 'Clues first. Spinny dials second.'
                }
              </span>
            </div>
          </div>

          <!-- Combination Input & Clues Panel -->
          <div class="chest-controls-side">
            ${
              !isChestUnlocked
                ? `
                  <div class="combination-dials-card ${isError ? 'shake-anim' : ''}">
                    <h3>SET THE THREE DIALS</h3>
                    <div class="dials-row">
                      ${[0, 1, 2]
                        .map((index) => {
                          const val = currentCode[index] ?? 0;
                          return `
                            <div class="dial-column">
                              <button class="dial-arrow dial-up" data-action="adjust-dial" data-index="${index}" data-delta="1" title="Increase dial ${index + 1}" aria-label="Increase dial ${index + 1}">
                                ${lucideIcon(ArrowUp, 'hud-icon')}
                              </button>
                              <div class="dial-display" aria-label="Dial ${index + 1} value ${val}">
                                <span>${val}</span>
                              </div>
                              <button class="dial-arrow dial-down" data-action="adjust-dial" data-index="${index}" data-delta="-1" title="Decrease dial ${index + 1}" aria-label="Decrease dial ${index + 1}">
                                ${lucideIcon(ArrowDown, 'hud-icon')}
                              </button>
                            </div>
                          `;
                        })
                        .join('')}
                    </div>

                    ${
                      feedbackMessage
                        ? `<p class="chest-feedback ${isError ? 'is-error' : 'is-success'}">${escapeHtml(feedbackMessage)}</p>`
                        : ''
                    }

                    <button class="game-button coral-button unlock-action-btn" data-action="submit-chest-unlock">
                      <span>${lucideIcon(KeyRound, 'hud-icon')} OPEN THE CHEST</span>
                    </button>
                  </div>
                `
                : `
                  <div class="chest-success-card">
                    <div class="success-heading">
                      <span class="badge-gem">${lucideIcon(Crown, 'hud-icon')}</span>
                      <h2>CHEST: CRACKED</h2>
                    </div>
                    <p>You found Pip’s button. Pip is trying to look surprised.</p>
                    <div class="level-reward-strip">
                      <span>+30 BONUS POINTS</span>
                    </div>
                    <button class="game-button coral-button claim-win-btn" data-action="claim-level-complete">
                      <span>GRAB POINTS &amp; GO</span>
                      ${lucideIcon(ArrowRight, 'hud-icon')}
                    </button>
                  </div>
                `
            }

            <!-- Discovered Clues Panel -->
            <div class="chest-clues-ledger">
              <h4>${lucideIcon(ScrollText, 'hud-icon')} CLUES (${unlockedClues.length} OF ${level.difficultySettings.requiredCluesCount})</h4>
              ${
                unlockedClues.length === 0
                  ? `<p class="empty-clues">No clues yet. Ask a fish or search for shiny stuff.</p>`
                  : `
                    <ul class="clues-list">
                      ${unlockedClues
                        .map(
                          (c) => `
                            <li>
                              <span class="clue-src-icon">${lucideIcon(c.source === 'fish' ? Fish : Crown, 'hud-icon')}</span>
                              <div>
                                <strong>${escapeHtml(c.description)}</strong>
                                <small>${escapeHtml(c.revealedText)}</small>
                              </div>
                            </li>
                          `,
                        )
                        .join('')}
                    </ul>
                  `
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
