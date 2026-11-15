import { assetUrl } from '../assets';
import type { GameSettings } from '../services/settingsService';

export interface SettingsModalProps {
  settings: GameSettings;
}

export function renderSettingsModal(props: SettingsModalProps): string {
  const { settings } = props;

  return `
    <div class="game-dim settings-dim">
      <!-- Clickable backdrop to dismiss -->
      <div class="settings-backdrop-hitbox" data-action="close-settings" title="Close Settings"></div>

      <!-- Kawaii Modal Card -->
      <section class="settings-modal kawaii-settings-card" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        
        <!-- Pip Peeker sitting happily on top -->
        <div class="settings-pip-peeker-wrap">
          <img src="${assetUrl('axolotl-love')}" alt="Pip" class="settings-pip-mascot">
          <div class="settings-pip-chat">Cozy pond time!</div>
        </div>

        <!-- Header -->
        <header class="settings-modal-header">
          <div class="settings-header-title-group">
            <div class="settings-icon-badge">
              <img src="${assetUrl('icon-settings')}" alt="" class="settings-modal-icon">
            </div>
            <div>
              <span class="settings-kicker-tag">UNDERSEA PREFERENCES</span>
              <h2 id="settings-title" class="settings-modal-title">Pond Settings</h2>
            </div>
          </div>
          <button class="settings-close-circle" data-action="close-settings" title="Close Settings" aria-label="Close Settings">
            Close
          </button>
        </header>

        <!-- Settings Items List -->
        <div class="settings-modal-body">
          <!-- 1. Sound Effects -->
          <div class="settings-item card-coral">
            <div class="settings-item-badge badge-coral">
              <img src="${assetUrl('icon-sound')}" alt="" class="settings-item-icon">
            </div>
            <div class="settings-item-info">
              <strong class="settings-item-label">Sound Effects</strong>
              <small class="settings-item-desc">Bubbles, clicks, clues &amp; chimes</small>
            </div>
            <button class="kawaii-switch ${settings.soundEffects ? 'active' : ''}"
              data-action="toggle-setting" data-setting="soundEffects"
              title="Toggle Sound Effects" aria-pressed="${settings.soundEffects}">
              <span class="kawaii-switch-track">
                <span class="kawaii-switch-thumb"></span>
              </span>
            </button>
          </div>

          <!-- 2. Ocean Ambience -->
          <div class="settings-item card-sky">
            <div class="settings-item-badge badge-sky">
              <img src="${assetUrl('bubbles')}" alt="" class="settings-item-icon">
            </div>
            <div class="settings-item-info">
              <strong class="settings-item-label">Ocean Ambience</strong>
              <small class="settings-item-desc">Gentle underwater soothing waves</small>
            </div>
            <button class="kawaii-switch ${settings.musicEnabled ? 'active' : ''}"
              data-action="toggle-setting" data-setting="musicEnabled"
              title="Toggle Ocean Ambience" aria-pressed="${settings.musicEnabled}">
              <span class="kawaii-switch-track">
                <span class="kawaii-switch-thumb"></span>
              </span>
            </button>
          </div>

          <!-- 3. Floating Bubbles -->
          <div class="settings-item card-mint">
            <div class="settings-item-badge badge-mint">
              <img src="${assetUrl('pearl')}" alt="" class="settings-item-icon">
            </div>
            <div class="settings-item-info">
              <strong class="settings-item-label">Floating Bubbles</strong>
              <small class="settings-item-desc">Sparkly sunlight &amp; bubble streams</small>
            </div>
            <button class="kawaii-switch ${settings.ambientBubbles ? 'active' : ''}"
              data-action="toggle-setting" data-setting="ambientBubbles"
              title="Toggle Floating Bubbles" aria-pressed="${settings.ambientBubbles}">
              <span class="kawaii-switch-track">
                <span class="kawaii-switch-thumb"></span>
              </span>
            </button>
          </div>

          <!-- 4. Calm Motion -->
          <div class="settings-item card-lavender">
            <div class="settings-item-badge badge-lavender">
              <img src="${assetUrl('axolotl-sleeping')}" alt="" class="settings-item-icon">
            </div>
            <div class="settings-item-info">
              <strong class="settings-item-label">Calm Motion</strong>
              <small class="settings-item-desc">Gentle sway &amp; calmer screen movement</small>
            </div>
            <button class="kawaii-switch ${settings.reducedMotion ? 'active' : ''}"
              data-action="toggle-setting" data-setting="reducedMotion"
              title="Toggle Calm Motion" aria-pressed="${settings.reducedMotion}">
              <span class="kawaii-switch-track">
                <span class="kawaii-switch-thumb"></span>
              </span>
            </button>
          </div>

          <!-- 5. Pip's Guidance -->
          <div class="settings-item card-sunshine">
            <div class="settings-item-badge badge-sunshine">
              <img src="${assetUrl('icon-hint')}" alt="" class="settings-item-icon">
            </div>
            <div class="settings-item-info">
              <strong class="settings-item-label">Pip's Guidance</strong>
              <small class="settings-item-desc">Helpful sparkle clues when searching</small>
            </div>
            <button class="kawaii-switch ${settings.autoHints ? 'active' : ''}"
              data-action="toggle-setting" data-setting="autoHints"
              title="Toggle Pip's Guidance" aria-pressed="${settings.autoHints}">
              <span class="kawaii-switch-track">
                <span class="kawaii-switch-thumb"></span>
              </span>
            </button>
          </div>

          <!-- 6. Relaxed Timer -->
          <div class="settings-item card-peach">
            <div class="settings-item-badge badge-peach">
              <img src="${assetUrl('star-gold')}" alt="" class="settings-item-icon">
            </div>
            <div class="settings-item-info">
              <strong class="settings-item-label">Relaxed Timer</strong>
              <small class="settings-item-desc">Extra +60 seconds to explore ponds</small>
            </div>
            <button class="kawaii-switch ${settings.relaxedTimer ? 'active' : ''}"
              data-action="toggle-setting" data-setting="relaxedTimer"
              title="Toggle Relaxed Timer" aria-pressed="${settings.relaxedTimer}">
              <span class="kawaii-switch-track">
                <span class="kawaii-switch-thumb"></span>
              </span>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <footer class="settings-modal-footer">
          <button class="settings-reset-btn" data-action="reset-settings" title="Restore all default settings">
            <span>↺ Reset Defaults</span>
          </button>
          <button class="bouncy-pill-btn btn-play-pond settings-splash-btn" data-action="close-settings" title="Save & Close">
            <span>Save &amp; Splash!</span>
          </button>
        </footer>
      </section>
    </div>
  `;
}
