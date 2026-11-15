import { assetUrl } from '../assets';

export interface SharedNavProps {
  backAction?: string;
  backLabel?: string;
  subtitle?: string;
  playerName?: string;
  playerAvatar?: string;
  pearls?: number;
  score?: number;
  soundMuted?: boolean;
  currentScreen?: string;
  extraRightHtml?: string;
}

export function renderSharedNav(props: SharedNavProps): string {
  const {
    backAction,
    backLabel = 'Back',
    subtitle = "Pip's Pond",
    playerName,
    playerAvatar = 'axolotl-happy',
    pearls,
    score,
    soundMuted = false,
    currentScreen,
    extraRightHtml = '',
  } = props;

  return `
    <header class="unified-navbar" role="banner">
      <!-- Left side: Brand or Back -->
      <div class="unav-left">
        ${
          backAction
            ? `
            <button class="unav-btn unav-back-btn" data-action="${backAction}" title="${backLabel}" aria-label="${backLabel}">
              <img src="${assetUrl('icon-home')}" alt="Back" class="unav-icon">
            </button>
          `
            : `
            <button class="unav-brand-btn" data-action="go-home" title="Axolotl's Lost Button - Home" aria-label="Home">
              <span class="unav-brand-icon">
                <img src="${assetUrl('icon-home')}" alt="Home" class="unav-home-img">
              </span>
              <div class="unav-brand-text">
                <span class="unav-title">AXOLOTL’S LOST BUTTON</span>
                <span class="unav-subtitle">${subtitle}</span>
              </div>
            </button>
          `
        }
      </div>

      <!-- Center navigation shortcuts -->
      <div class="unav-center">
        <button class="unav-btn unav-nav-btn ${currentScreen === 'profile' ? 'active' : ''}" data-action="go-profile" title="Player Profile" aria-label="Profile">
          <img src="${assetUrl('profile-icon')}" alt="Profile" class="unav-icon">
        </button>

        <button class="unav-btn unav-nav-btn ${currentScreen === 'leaderboard' ? 'active' : ''}" data-action="go-leaderboard" title="Leaderboard Rankings" aria-label="Leaderboard">
          <img src="${assetUrl('badge-gold')}" alt="Leaderboard" class="unav-icon">
        </button>

        <button class="unav-btn unav-nav-btn" data-action="go-level-select" title="Choose Pond" aria-label="Choose Pond">
          <img src="${assetUrl('icon-play')}" alt="Level Select" class="unav-icon">
        </button>

        ${
          playerName
            ? `
          <button class="unav-btn unav-nav-btn unav-signout-btn" data-action="logout" title="Sign Out" aria-label="Sign Out">
            <img src="${assetUrl('sign-out-icon')}" alt="Sign Out" class="unav-icon">
          </button>
        `
            : `
          <button class="unav-btn unav-nav-btn" data-action="go-login" title="Sign In" aria-label="Sign In">
            <img src="${assetUrl('icon-lock')}" alt="Sign In" class="unav-icon">
          </button>
        `
        }
      </div>

      <!-- Right stats & controls -->
      <div class="unav-right">
        ${
          playerName
            ? `
          <div class="unav-player-chip" title="Player: ${playerName}">
            <img src="${assetUrl(playerAvatar as any)}" alt="Avatar" class="unav-avatar">
            <div class="unav-player-info">
              <small>POND PAL</small>
              <strong>${playerName}</strong>
            </div>
          </div>
        `
            : ''
        }

        ${
          typeof pearls === 'number'
            ? `
          <div class="unav-stat-pill unav-pearls-pill" title="${pearls} Pearls Collected">
            <svg class="pearl-svg mini" viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" fill="#fff" stroke="#d4b8db" stroke-width="2"/><ellipse cx="17" cy="15" rx="5" ry="3" fill="#fff"/></svg>
            <strong>${pearls}</strong>
            <small>PEARLS</small>
          </div>
        `
            : ''
        }

        ${
          typeof score === 'number'
            ? `
          <div class="unav-stat-pill unav-score-pill" title="Score: ${score}">
            <img src="${assetUrl('star-gold')}" alt="Score" class="unav-icon">
            <strong class="hud-score-value">${score}</strong>
            <small>SCORE</small>
          </div>
        `
            : ''
        }

        <button class="unav-btn unav-icon-only-btn ${soundMuted ? 'muted' : ''}" data-action="toggle-sound" title="${soundMuted ? 'Unmute' : 'Mute'} Sound" aria-label="${soundMuted ? 'Unmute sound' : 'Mute sound'}">
          <img src="${assetUrl('icon-sound')}" alt="Sound" class="unav-icon">
        </button>

        ${extraRightHtml}
      </div>
    </header>
  `;
}

