import { assetUrl } from '../assets';
import type { RankedLeaderboardEntry } from '../services/leaderboardService';
import type { LeaderboardDifficulty } from '../services/leaderboardService';
import { renderSharedNav } from './sharedNav';

export interface LeaderboardScreenProps {
  entries: RankedLeaderboardEntry[];
  difficulty: LeaderboardDifficulty;
  currentPlayerId?: string;
  playerName?: string;
  playerAvatar?: string;
  score?: number;
  pearls?: number;
  soundMuted?: boolean;
}

export function renderLeaderboardScreen(props: LeaderboardScreenProps): string {
  const {
    entries,
    difficulty,
    currentPlayerId,
    playerName,
    playerAvatar,
    score,
    pearls,
    soundMuted = false,
  } = props;
  const currentRank = entries.find((e) => e.isCurrentPlayer || e.playerId === currentPlayerId)?.rank ?? '-';

  return `
    <main class="game-shell">
      <section class="ocean-scene cove menu-ocean">
        <div class="scene-sunlight"></div>
        <div class="scene-caustics"></div>
        <div class="menu-water-shade"></div>

        <!-- Floating bubbles -->
        <div class="scene-bubbles bubbles-a"><img src="${assetUrl('bubbles')}" alt=""></div>
        <div class="scene-bubbles bubbles-b"><img src="${assetUrl('bubbles')}" alt=""></div>

        <!-- Unified Top Navigation Bar -->
        ${renderSharedNav({
          backAction: 'go-home',
          backLabel: 'Back to Pond',
          subtitle: 'LEADERBOARD',
          playerName,
          playerAvatar,
          pearls,
          score,
          soundMuted,
          currentScreen: 'leaderboard',
        })}

        <section class="leaderboard-panel" aria-labelledby="leaderboard-title">
          <div class="leaderboard-heading">
            <span class="chapter-mark">THE FISHY FAME LIST</span>
            <h1 id="leaderboard-title">Pond champions</h1>
            <p>Who found the most shiny stuff? Let’s see.</p>
            <div class="user-rank-strip">
              <span>YOUR RANK: <strong>#${currentRank}</strong></span>
            </div>
            <div class="leaderboard-difficulty-filter" role="group" aria-label="Filter leaderboard by difficulty">
              ${(['all', 'easy', 'medium', 'hard'] as const).map((levelDifficulty) => `
                <button class="game-button secondary-button ${difficulty === levelDifficulty ? 'is-selected' : ''}"
                  data-action="filter-leaderboard" data-difficulty="${levelDifficulty}"
                  aria-pressed="${difficulty === levelDifficulty}">
                  ${levelDifficulty === 'all' ? 'All difficulties' : `${levelDifficulty.charAt(0).toUpperCase()}${levelDifficulty.slice(1)}`}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="leaderboard-list" role="list">
            ${entries.length === 0
              ? '<p class="leaderboard-empty">No pond pals yet. Be the first to find a shiny thing!</p>'
              : entries
                  .map((player) => {
                const isPodium = player.rank <= 3;
                const podiumClass = isPodium ? `podium-row podium-${player.rank}` : '';
                const currentClass = player.isCurrentPlayer ? 'current-player-row' : '';

                return `
                  <article class="leaderboard-row ${podiumClass} ${currentClass}" role="listitem">
                    <span class="leaderboard-rank" aria-label="Rank ${player.rank}">
                      ${isPodium
                        ? `<img src="${assetUrl('badge-gold')}" alt="Rank ${player.rank}" class="podium-icon"><span>${player.rank}</span>`
                        : `#${player.rank}`}
                    </span>
                    <span class="leaderboard-avatar">
                      <img src="${assetUrl(player.avatar || 'axolotl-happy')}" alt="${player.name}">
                    </span>
                    <span class="leaderboard-name">
                      <strong>${escapeHtml(player.name)}</strong>
                      ${player.isCurrentPlayer ? '<small class="you-tag">YOU</small>' : ''}
                      <small class="levels-cleared-tag">${player.completedLevelsCount} level${player.completedLevelsCount === 1 ? '' : 's'} cleared</small>
                    </span>
                    <span class="leaderboard-pearls">
                      <svg class="pearl-svg mini" viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" fill="#fff" stroke="#d4b8db" stroke-width="2"/><ellipse cx="17" cy="15" rx="5" ry="3" fill="#fff"/></svg>
                      <strong>${player.pearls}</strong>
                    </span>
                    <span class="leaderboard-score">
                      <strong>${player.score.toLocaleString()}</strong>
                      <small>SCORE</small>
                    </span>
                  </article>
                `;
                  })
                  .join('')}
          </div>

          <button class="game-button coral-button leaderboard-back-button" data-action="go-home">
            <span>BACK TO PIP</span>
            <span>→</span>
          </button>
        </section>
      </section>
    </main>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
