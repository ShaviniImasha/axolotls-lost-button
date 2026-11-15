import { assetUrl } from '../assets';
import { renderSharedNav } from './sharedNav';

export interface RegisterPageProps {
  errorMessage?: string;
}

export function renderRegisterPage(props: RegisterPageProps = {}): string {
  return `
    <main class="start-screen auth-screen">
      <div class="start-water"></div>
      <div class="start-rays"></div>
      <div class="start-coral start-coral-left">
        <img src="${assetUrl('coral-fan')}" alt="Coral">
        <img src="${assetUrl('coral-round')}" alt="Coral">
      </div>
      <div class="start-coral start-coral-right">
        <img src="${assetUrl('coral-branch')}" alt="Coral">
        <img src="${assetUrl('shell-scallop')}" alt="Shell">
      </div>

      <!-- Unified Top Navigation Bar -->
      ${renderSharedNav({
        backAction: 'go-login',
        backLabel: 'Sign In',
        subtitle: 'CREATE ACCOUNT',
        currentScreen: 'register',
      })}

      <div class="auth-composition">
        <div class="auth-mascot-stage">
          <div class="start-moon"></div>
          <img src="${assetUrl('axolotl-happy')}" class="auth-mascot" alt="Pip smiling">
          <span class="auth-speech">New pal!<br>Button hunt?</span>
          <img src="${assetUrl('bubbles')}" class="auth-bubbles" alt="Bubbles">
        </div>

        <section class="auth-card" aria-labelledby="register-title">
          <span class="game-overline">NEW POND PAL</span>
          <h1 id="register-title">Join Pip’s crew</h1>
          <p class="auth-subtitle">Make a player profile. The button won’t find itself.</p>

          <form class="game-entry-form" id="register-form" novalidate>
            <label>
              YOUR NAME
              <input name="name" type="text" maxlength="24" autocomplete="nickname" placeholder="e.g. Shellby" required>
            </label>
            <label>
              EMAIL
              <input name="email" type="email" autocomplete="email" placeholder="you@thepond.com" required>
            </label>
            <label>
              PASSWORD
              <input name="password" type="password" autocomplete="new-password" placeholder="At least 6 characters" required>
            </label>
            <label>
              CONFIRM PASSWORD
              <input name="confirmation" type="password" autocomplete="new-password" placeholder="One more time" required>
            </label>

            ${
              props.errorMessage
                ? `<p class="auth-error" role="alert">${escapeHtml(props.errorMessage)}</p>`
                : ''
            }

            <button class="play-button auth-submit" type="submit">
              <span class="play-gem"><img src="${assetUrl('icon-heart')}" alt="Heart"></span>
              <span>LET’S PLAY</span>
            </button>
          </form>

          <button class="auth-switch" data-action="go-login">
            Already have an account? <strong>SIGN IN</strong>
          </button>
        </section>
      </div>

      <div class="start-footer">
        <span>Small axolotl. Big button hunt.</span>
      </div>
    </main>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
