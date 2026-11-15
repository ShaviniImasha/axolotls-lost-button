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
                <button class="bouncy-pill-btn icon-only-pill btn-edit-profile" data-action="toggle-pond-settings"
                  title="Pond Settings" aria-label="Pond Settings">
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

          <!-- Direct Below Account Details Section -->
          <div class="profile-account-settings-card">
            <div class="profile-account-header">
              <span class="account-pill-tag">ACCOUNT SETTINGS</span>
              <h2 class="profile-account-title">Update Explorer Details</h2>
            </div>

            <div class="profile-settings-grid">
              <!-- Change Username Box -->
              <div class="profile-mini-box box-username">
                <div class="mini-box-title">
                  <strong>Username</strong>
                </div>
                <div class="profile-input-btn-row">
                  <input class="profile-inline-input" id="edit-username" type="text"
                    value="${escapeHtml(player.name)}" placeholder="Enter cute name..." maxlength="30" autocomplete="username">
                  <button class="bouncy-pill-btn save-pill-btn" data-action="save-username">Save</button>
                </div>
              </div>

              <!-- Change Email Box -->
              <div class="profile-mini-box box-email">
                <div class="mini-box-title">
                  <strong>Email Address</strong>
                </div>
                <div class="profile-input-btn-row">
                  <input class="profile-inline-input" id="edit-email" type="email"
                    value="${player.email ? escapeHtml(player.email) : ''}" placeholder="your@email.com" autocomplete="email">
                  <button class="bouncy-pill-btn save-pill-btn" data-action="save-email">Save</button>
                </div>
                <input class="profile-inline-input password-confirm-field" id="edit-email-password" type="password"
                  placeholder="Current password (required for email)" autocomplete="current-password">
              </div>
            </div>

            <p class="edit-profile-status" id="edit-profile-status" aria-live="polite"></p>
          </div>
        </section>
      </section>
    </main>

    <!-- Pond Settings Panel — outside game-shell so overflow:hidden doesn't clip it -->
    <div class="pond-settings-panel" id="pond-settings-panel" style="display:none;" aria-hidden="true">
      <div class="pond-settings-card">
        <!-- Header -->
        <div class="pond-settings-header">
          <div class="pond-settings-icon-wrap">
            <img src="${assetUrl('icon-settings')}" alt="" class="pond-settings-gear">
          </div>
          <div class="pond-settings-titles">
            <h2 class="pond-settings-title">Pond Settings</h2>
            <p class="pond-settings-sub">Customize Pip's undersea world</p>
          </div>
          <button class="pond-settings-close" data-action="toggle-pond-settings" aria-label="Close">Close</button>
        </div>

        <div class="pond-settings-divider"></div>

        <!-- Section: Sound -->
        <div class="pond-toggle-row" id="toggle-row-ocean">
          <div class="pond-toggle-info">
            <strong>Ocean Ambience</strong>
            <span>Calm underwater atmospheric tones</span>
          </div>
          <button class="pond-toggle-btn" id="toggle-ocean" data-action="toggle-ocean" role="switch" aria-checked="true">
            <span class="pond-toggle-thumb"></span>
          </button>
        </div>

        <!-- Section: Visuals -->
        <p class="pond-section-label">VISUALS &amp; ANIMATION</p>

        <div class="pond-toggle-row">
          <div class="pond-toggle-info">
            <strong>Floating Bubbles</strong>
            <span>Undersea bubbles and gentle sunbeam effects</span>
          </div>
          <button class="pond-toggle-btn" id="toggle-bubbles" data-action="toggle-bubbles" role="switch" aria-checked="true">
            <span class="pond-toggle-thumb"></span>
          </button>
        </div>

        <div class="pond-toggle-row">
          <div class="pond-toggle-info">
            <strong>Reduced Motion</strong>
            <span>Minimize screen floating &amp; fast transitions</span>
          </div>
          <button class="pond-toggle-btn off" id="toggle-motion" data-action="toggle-motion" role="switch" aria-checked="false">
            <span class="pond-toggle-thumb"></span>
          </button>
        </div>

        <!-- Section: Gameplay -->
        <p class="pond-section-label">GAMEPLAY ASSISTANCE</p>

        <div class="pond-toggle-row">
          <div class="pond-toggle-info">
            <strong>Pip's Guidance</strong>
            <span>Subtle sparkling nudges when searching</span>
          </div>
          <button class="pond-toggle-btn" id="toggle-guidance" data-action="toggle-guidance" role="switch" aria-checked="true">
            <span class="pond-toggle-thumb"></span>
          </button>
        </div>

        <div class="pond-toggle-row">
          <div class="pond-toggle-info">
            <strong>Relaxed Timer</strong>
            <span>Extra time to search for hidden treasures</span>
          </div>
          <button class="pond-toggle-btn off" id="toggle-timer" data-action="toggle-timer" role="switch" aria-checked="false">
            <span class="pond-toggle-thumb"></span>
          </button>
        </div>

        <div class="pond-settings-divider"></div>

        <!-- Footer -->
        <div class="pond-settings-footer">
          <button class="pond-reset-btn" data-action="reset-pond-settings">Reset to Defaults</button>
          <button class="pond-done-btn bouncy-pill-btn" data-action="toggle-pond-settings">Done</button>
        </div>
      </div>
    </div>
  `;
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
