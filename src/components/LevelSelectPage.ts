import { assetUrl } from '../assets';
import { ADVENTURE_LEVELS, REALMS, type Difficulty, type LevelId } from '../game/levelManager';
import { renderSharedNav } from './sharedNav';

export interface LevelSelectPageProps {
  unlockedLevels: LevelId[];
  completedLevels: LevelId[];
  bestScores?: Partial<Record<LevelId, number>>;
  playerName?: string;
  playerAvatar?: string;
  score?: number;
  pearls?: number;
  soundMuted?: boolean;
}

export function renderLevelSelectPage(props: LevelSelectPageProps): string {
  const {
    unlockedLevels,
    completedLevels,
    bestScores = {},
    playerName,
    playerAvatar,
    score,
    pearls,
    soundMuted = false,
  } = props;

  return `
    <main class="game-shell">
      <section class="ocean-scene bay menu-ocean">
        <div class="scene-sunlight"></div>
        <div class="scene-caustics"></div>
        <div class="menu-water-shade"></div>
        <div class="scene-bubbles bubbles-a"><img src="${assetUrl('bubbles')}" alt=""></div>
        <div class="scene-bubbles bubbles-b"><img src="${assetUrl('bubbles')}" alt=""></div>

        ${renderSharedNav({
          backAction: 'go-home',
          backLabel: 'Back to Pip',
          subtitle: 'CHOOSE A REALM & DIFFICULTY',
          playerName,
          playerAvatar,
          pearls,
          score,
          soundMuted,
          currentScreen: 'level-select',
        })}

        <section class="level-select-container">
          <div class="level-select-heading">
            <span class="chapter-mark">THREE REALMS. THREE CHALLENGES EACH.</span>
            <h1>Where to, Pip?</h1>
            <p>Every realm can be explored at Easy, Medium, or Hard.</p>
            <p class="level-unlock-rules">Easy opens with the first realm. Beat each realm’s Easy to open its Medium, then beat Medium to open Hard. The next realm’s Easy opens after the previous realm’s Easy.</p>
          </div>

          <div class="pond-selection-grid">
            ${REALMS.map((realm, index) => {
              const levels = ADVENTURE_LEVELS.filter((level) => level.realmId === realm.id);
              const art = realm.hiddenObjectArtTypes.clue;
              return `
                <article class="pond-selection-card">
                  <div class="pond-selection-heading">
                    <span class="level-num">POND 0${index + 1}</span>
                    <div class="pond-selection-art"><img src="${assetUrl(art)}" alt=""></div>
                    <h2>${realm.name}</h2>
                    <p class="level-card-desc">${realm.subtitle}</p>
                  </div>
                  <div class="pond-difficulty-list" aria-label="${realm.name} difficulty levels">
                    ${levels.map((level) => {
                      const isUnlocked = unlockedLevels.includes(level.id);
                      const isCompleted = completedLevels.includes(level.id);
                      const difficultyLabel = capitalize(level.difficulty);
                      const status = isCompleted ? 'COMPLETED' : isUnlocked ? 'UNLOCKED' : 'LOCKED';
                      return `
                        <div class="pond-difficulty-option ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}">
                          <div class="pond-difficulty-info">
                            <span class="level-diff badge-${level.difficulty}">${difficultyLabel}</span>
                            <span class="pond-difficulty-stats">${level.difficultySettings.timeLimit}s · ${level.difficultySettings.maxHints} hints</span>
                            <span class="pond-difficulty-status">${status}</span>
                          </div>
                          ${
                            isUnlocked
                              ? `<button class="game-button coral-button pond-difficulty-btn" data-action="play-level" data-level-id="${level.id}" aria-label="Play ${realm.name} ${difficultyLabel}">
                                  <span>${isCompleted ? 'PLAY AGAIN' : 'PLAY'}</span><span>→</span>
                                </button>`
                              : `<button class="game-button locked-btn pond-difficulty-btn" data-level-id="${level.id}" disabled aria-label="${difficultyLabel} locked">
                                  <img src="${assetUrl('icon-lock')}" alt="" class="mini-icon">
                                  <span>LOCKED</span>
                                </button>`
                          }
                          <span class="pond-best-score">BEST ${bestScores[level.id] ?? 0}</span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </article>
              `;
            }).join('')}
          </div>

          <button class="game-button secondary-button back-center-btn" data-action="go-home">
            <img src="${assetUrl('icon-home')}" alt="" class="mini-icon"><span>BACK TO PIP</span>
          </button>

          ${() => {
            const firstUnlocked = ADVENTURE_LEVELS.filter((l) => unlockedLevels.includes(l.id))[0];
            if (!firstUnlocked) return '';
            return `
            <button class="game-button coral-button dive-in-btn" data-action="play-level" data-level-id="${firstUnlocked.id}" aria-label="Dive into ${firstUnlocked.realm.name} ${capitalize(firstUnlocked.difficulty)}">
              <span>DIVE IN</span><span>→</span>
            </button>
            `;
          }}()
        </section>
      </section>
    </main>
  `;
}

function capitalize(value: Difficulty): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
