import { assetUrl } from '../assets';
import { House, Pause, Play, Volume2, VolumeX } from 'lucide';
import { lucideIcon } from './lucideIcon';

export interface PauseOverlayProps {
  soundMuted: boolean;
  levelLabel: string;
}

export function renderPauseOverlay(props: PauseOverlayProps): string {
  const { soundMuted, levelLabel } = props;

  return `
    <div class="game-dim pause-dim">
      <section class="pause-scene" role="dialog" aria-modal="true" aria-labelledby="pause-title">
        <div class="pause-bubbles"><span></span><span></span><span></span></div>
        <img src="${assetUrl('axolotl-sleeping')}" class="pause-mascot" alt="Pip taking a nap">
        <span class="chapter-mark">${lucideIcon(Pause, 'hud-icon')} PAUSED ADVENTURE</span>
        <h1 id="pause-title">Pip’s on a break</h1>
        <p>${levelLabel}. The button can wait. Pip is excellent at napping.</p>

        <div class="pause-actions">
          <button class="game-button coral-button pause-resume" data-action="resume-game">
            ${lucideIcon(Play, 'mini-icon hud-icon')}
            <span>BACK TO THE HUNT</span>
          </button>

          <button class="game-button secondary-button" data-action="toggle-sound">
            ${lucideIcon(soundMuted ? Volume2 : VolumeX, 'mini-icon hud-icon')}
            <span>${soundMuted ? 'UNMUTE SOUNDS' : 'MUTE SOUNDS'}</span>
          </button>

          <button class="pause-home" data-action="confirm-quit-to-home">
            ${lucideIcon(House, 'hud-icon')} BACK TO PIP
          </button>
        </div>
      </section>
    </div>
  `;
}
