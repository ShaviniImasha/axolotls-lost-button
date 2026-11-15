import { assetUrl } from '../assets';
import type { PlayerProfileData } from '../services/authService';
import { renderSharedNav } from './sharedNav';

export interface ProfileScreenProps {
  player: PlayerProfileData;
  soundMuted?: boolean;
}

const FUN_RANKS = [
  'Tadpole Splasher',
  'Bubble Blower',
  'Clue Sniffer',
  'Button Chaser',
  'Deep Reef Detective',
  'Axolotl Bestie',
  'Grand Coral Master',
];

export function renderProfileScreen(props: ProfileScreenProps): string {
  const { player, soundMuted = false } = props;
  const completedCount = (player.completedLevels ?? []).length;
  const unlockedCount = (player.unlockedLevels ?? []).length;
  const cluesCount = (player.collectedClues ?? []).length;
  const totalScore = player.totalScore || 0;
  const collectedPearls = player.collectedPearls || 0;

  const funTitle = FUN_RANKS[Math.min(completedCount, FUN_RANKS.length - 1)];

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
          subtitle: 'EXPLORER PASSPORT',
          playerName: player.name,
          playerAvatar: player.avatar,
          pearls: collectedPearls,
          score: totalScore,
          soundMuted,
          currentScreen: 'profile',
        })}

        <section class="profile-page-panel" aria-labelledby="profile-title">
          <!-- Playful Hero Passport -->
          <div class="profile-hero-bubble">
            <div class="profile-avatar-cushion">
              <img src="${assetUrl(player.avatar || 'axolotl-happy')}" alt="${player.name}" class="profile-cute-avatar">
              <span class="pip-snack-badge" title="Pip's Snack Buddy!"></span>
            </div>

            <div class="profile-hero-details">
              <div class="profile-kicker-pill">
                <span>${funTitle}</span>
              </div>
              <h1 id="profile-title" class="profile-hero-name">${escapeHtml(player.name)}</h1>
              
              <div class="profile-guest-tag">
                <span class="bubble-dot"></span>
                <span>${player.email ? escapeHtml(player.email) : 'Secret Undersea Agent (Guest)'}</span>
              </div>

              <div class="profile-button-row">
                <button class="bouncy-pill-btn icon-only-pill btn-play-pond" data-action="go-level-select"
                  title="Play Ponds" aria-label="Play Ponds">
                  <img src="${assetUrl('icon-play')}" alt="" class="p-btn-icon">
                </button>
                <button class="bouncy-pill-btn icon-only-pill btn-fame" data-action="go-leaderboard"
                  title="Leaderboard" aria-label="Leaderboard">
                  <img src="${assetUrl('badge-gold')}" alt="" class="p-btn-icon">
                </button>
                <button class="bouncy-pill-btn icon-only-pill btn-settings" data-action="open-settings"
                  title="Settings" aria-label="Settings">
                  <img src="${assetUrl('icon-settings')}" alt="" class="p-btn-icon">
                </button>
                <button class="bouncy-pill-btn icon-only-pill btn-nap" data-action="logout"
                  title="Sign Out" aria-label="Sign Out">
                  <img src="${assetUrl('sign-out-icon')}" alt="" class="p-btn-icon">
                </button>
              </div>
            </div>
          </div>

          <!-- Pastel Candy Stat Bubbles -->
          <div class="profile-candy-grid">
            <div class="candy-stat-card card-banana">
              <div class="candy-icon-ring">
                <img src="${assetUrl('star-gold')}" alt="Score" class="candy-icon">
              </div>
              <div class="candy-meta">
                <span class="candy-label">Score</span>
                <strong class="candy-val">${totalScore.toLocaleString()}</strong>
              </div>
            </div>

            <div class="candy-stat-card card-lavender">
              <div class="candy-icon-ring">
                <img src="${assetUrl('pearl')}" alt="Pearls" class="candy-icon">
              </div>
              <div class="candy-meta">
                <span class="candy-label">Glowing Pearls</span>
                <strong class="candy-val">${collectedPearls}</strong>
              </div>
            </div>

            <div class="candy-stat-card card-mint">
              <div class="candy-icon-ring">
                <img src="${assetUrl('treasure-chest')}" alt="Levels" class="candy-icon">
              </div>
              <div class="candy-meta">
                <span class="candy-label">Ponds Cleared</span>
                <strong class="candy-val">${completedCount} <small>/ 9</small></strong>
              </div>
            </div>

            <div class="candy-stat-card card-peach">
              <div class="candy-icon-ring">
                <img src="${assetUrl('button-lost')}" alt="Clues" class="candy-icon">
              </div>
              <div class="candy-meta">
                <span class="candy-label">Button Clues</span>
                <strong class="candy-val">${cluesCount}</strong>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  `;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
