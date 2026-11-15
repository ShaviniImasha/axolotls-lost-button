import { assetUrl } from '../assets';
import type { PlayerProfileData } from '../services/authService';
import { ADVENTURE_LEVELS, REALMS, type Difficulty, type LevelId, type RealmId } from '../game/levelManager';

export interface HomePageProps {
  player: PlayerProfileData;
  hasActiveRun?: boolean;
  selectedLevelId?: LevelId;
  unlockedLevels?: readonly LevelId[];
}

const REALM_ART: Record<RealmId, 'coral-round' | 'shell-scallop' | 'rune-tablet'> = {
  pond: 'coral-round',
  coral: 'shell-scallop',
  cave: 'rune-tablet',
};

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export function renderHomePage(props: HomePageProps): string {
  const {
    player,
    hasActiveRun = false,
    selectedLevelId = 'pond-easy',
    unlockedLevels = ['pond-easy'],
  } = props;
  const selectedLevel = ADVENTURE_LEVELS.find((level) => level.id === selectedLevelId) ?? ADVENTURE_LEVELS[0];
  const selectedRealm = selectedLevel.realm;
  const completedLevels = player.completedLevels ?? [];
  const unlocked = new Set(unlockedLevels);
  const completed = new Set(completedLevels);
  const isComplete = completed.has(selectedLevel.id);
  const isUnlocked = unlocked.has(selectedLevel.id);
  const cluesFound = Math.min(
    selectedLevel.difficultySettings.requiredCluesCount,
    (player.collectedClues ?? []).filter((id) => id.startsWith(`${selectedLevel.id}-clue-`)).length,
  );
  const completedCount = completedLevels.length;
  const levelStatus = isComplete ? 'Done' : isUnlocked ? 'New' : 'Locked';
  const statusLabel = isComplete ? 'Done!' : isUnlocked ? 'New adventure' : 'Unlock this level first';
  const playLabel = hasActiveRun ? 'Keep Exploring!' : "Let's Play!";

  return `
    <main class="lobby-viewport">
      <section class="lobby-canvas" aria-label="Pip's Pond Adventure lobby">
        <div class="lobby-light-rays" aria-hidden="true"></div>
        <div class="lobby-water-glow" aria-hidden="true"></div>
        <div class="lobby-bubble lobby-bubble-one" aria-hidden="true"></div>
        <div class="lobby-bubble lobby-bubble-two" aria-hidden="true"></div>
        <div class="lobby-bubble lobby-bubble-three" aria-hidden="true"></div>
        <div class="lobby-fish lobby-fish-one" aria-hidden="true"><img src="${assetUrl('fish-golden')}" alt=""></div>
        <div class="lobby-fish lobby-fish-two" aria-hidden="true"><img src="${assetUrl('fish-peach')}" alt=""></div>
        <div class="lobby-fish lobby-fish-three" aria-hidden="true"><img src="${assetUrl('fish-lavender')}" alt=""></div>

        <header class="lobby-hud">
          <div class="lobby-player">
            <div class="lobby-avatar"><img src="${assetUrl(player.avatar || 'axolotl-happy')}" alt=""></div>
            <div class="lobby-player-copy">
              <strong>${escapeHtml(player.name)}</strong>
              <span>Pond Explorer</span>
            </div>
          </div>
          <div class="lobby-hud-actions">
            <div class="lobby-counter" aria-label="${player.collectedPearls || 0} pearls">
              <img src="${assetUrl('pearl')}" alt="">
              <span><small>PEARLS</small><strong>${player.collectedPearls || 0}</strong></span>
            </div>
            <div class="lobby-counter lobby-score" aria-label="${player.totalScore || 0} score">
              <img src="${assetUrl('star-gold')}" alt="">
              <span><small>Score</small><strong>${player.totalScore || 0}</strong></span>
            </div>
            <button class="lobby-profile-button" data-action="go-profile">
              <img src="${assetUrl('profile-icon')}" alt="" class="lobby-profile-icon"><span>Profile</span>
            </button>
          </div>
        </header>

        <section class="lobby-greeting">
          <span class="lobby-kicker">PIP'S POND ADVENTURE</span>
          <h1>Ready to splash, <span>${escapeHtml(player.name)}</span>?</h1>
          <p>Pip found a clue! Tap a pond to dive in.</p>
        </section>

        <section class="pond-map" aria-label="Choose a pond">
          <div class="pond-trail" aria-hidden="true"></div>
          ${REALMS.map((realm, index) => {
            const realmCompleted = ADVENTURE_LEVELS.filter(
              (level) => level.realmId === realm.id && completed.has(level.id),
            ).length;
            const isSelected = selectedRealm.id === realm.id;
            return `
              <button
                class="pond-island pond-island-${index + 1} ${isSelected ? 'selected' : ''}"
                data-action="select-home-pond"
                data-realm-id="${realm.id}"
                data-difficulty="${selectedLevel.difficulty}"
                aria-pressed="${isSelected}"
                aria-label="${realm.name}, ${realmCompleted} of 3 levels completed"
              >
                <span class="pond-island-art"><img src="${assetUrl(REALM_ART[realm.id])}" alt=""></span>
                <span class="pond-island-name">${realm.name}</span>
                <span class="pond-island-progress">${realmCompleted} / 3 levels</span>
              </button>
            `;
          }).join('')}
        </section>

        <section class="adventure-panel" aria-live="polite" aria-label="Selected adventure">
          <span class="adventure-eyebrow">YOUR NEXT ADVENTURE</span>
          <h2>${selectedRealm.name}</h2>
          <p class="adventure-blurb">${selectedRealm.subtitle}</p>

          <div class="difficulty-switch" role="group" aria-label="Choose a difficulty">
            ${DIFFICULTIES.map((difficulty) => {
              return `
                <button
                  class="difficulty-button difficulty-${difficulty} ${selectedLevel.difficulty === difficulty ? 'selected' : ''}"
                  data-action="select-home-difficulty"
                  data-realm-id="${selectedRealm.id}"
                  data-difficulty="${difficulty}"
                  aria-pressed="${selectedLevel.difficulty === difficulty}"
                >${capitalize(difficulty)}</button>
              `;
            }).join('')}
          </div>

          <div class="adventure-stats">
            <div class="adventure-stat"><small>TIME</small><strong>${selectedLevel.difficultySettings.timeLimit}s</strong></div>
            <div class="adventure-stat"><small>CLUES</small><strong>${cluesFound} / ${selectedLevel.difficultySettings.requiredCluesCount}</strong></div>
            <div class="adventure-stat"><small>STATUS</small><strong class="status-${levelStatus.toLowerCase()}">${statusLabel}</strong></div>
          </div>

          <button
            class="lobby-play-button ${isUnlocked ? '' : 'is-locked'}"
            data-action="start-game"
            data-level-id="${selectedLevel.id}"
            ${isUnlocked ? '' : 'disabled'}
          >
            <span class="lobby-play-label">${isUnlocked ? playLabel : 'Unlock this level'}</span>
            <span class="lobby-play-arrow" aria-hidden="true">➜</span>
          </button>

          <div class="panel-goal-banner">
            <img src="${assetUrl('button-lost')}" alt="" class="panel-goal-icon">
            <p><strong>Goal:</strong> Help Pip find his favourite button by solving fish challenges.</p>
          </div>
        </section>

        <section class="treasure-trail-card" aria-label="${completedCount} of 9 levels completed">
          <div class="trail-pip-companion">
            <div class="pip-speech">The button is out there!</div>
            <img src="${assetUrl('axolotl-happy')}" alt="Pip the axolotl" class="pip-mascot-img">
          </div>
          <div class="trail-content">
            <div class="treasure-trail-heading">
              <img src="${assetUrl('treasure-chest')}" alt="">
              <strong>Treasure trail</strong>
              <span>${completedCount} / 9 levels</span>
            </div>
            <div class="trail-pearls">
              ${ADVENTURE_LEVELS.map((level) => {
                const isLevelComplete = completed.has(level.id);
                return `
                  <span class="trail-pearl ${isLevelComplete ? 'collected' : ''}" aria-label="${level.realm.name} ${capitalize(level.difficulty)}: ${isLevelComplete ? 'complete' : 'not completed'}">
                    ${isLevelComplete
                      ? `<img src="${assetUrl('treasure-chest')}" alt=""><b aria-hidden="true">✓</b>`
                      : `<img src="${assetUrl('pearl')}" alt="">`}
                  </span>
                `;
              }).join('')}
            </div>
          </div>
        </section>

        <div class="lobby-seabed" aria-hidden="true">
          <img class="lobby-seaweed lobby-seaweed-left" src="${assetUrl('seaweed-wave')}" alt="">
          <img class="lobby-seaweed lobby-seaweed-right" src="${assetUrl('seaweed-leafy')}" alt="">
          <img class="lobby-shell lobby-shell-left" src="${assetUrl('shell-scallop')}" alt="">
          <img class="lobby-shell lobby-shell-right" src="${assetUrl('shell-spiral')}" alt="">
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
