import { assetUrl } from '../assets';
import { renderSharedNav } from './sharedNav';

export interface LoginPageProps {
  rememberedIdentity?: string | null;
  errorMessage?: string;
  successMessage?: string;
  configNotice?: string | null;
  googleAuthAvailable?: boolean;
  isResetMode?: boolean;
}

export function renderLoginPage(props: LoginPageProps = {}): string {
  const identity = props.rememberedIdentity || '';
  const rememberChecked = props.rememberedIdentity ? 'checked' : '';
  const googleAuthAvailable = props.googleAuthAvailable ?? true;
  const isResetMode = props.isResetMode ?? false;

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
        backAction: 'go-landing',
        backLabel: 'Welcome',
        subtitle: isResetMode ? 'RESET PASSWORD' : 'SIGN IN',
        currentScreen: 'login',
      })}

      <div class="auth-composition">
        <div class="auth-mascot-stage">
          <div class="start-moon"></div>
          <img src="${assetUrl('axolotl-mascot')}" class="auth-mascot" alt="Pip welcoming you back">
          <span class="auth-speech">${
            isResetMode
              ? 'Lost your key?<br>Pip’s on it!'
              : 'You’re back!<br>Pip saved you a spot.'
          }</span>
          <img src="${assetUrl('bubbles')}" class="auth-bubbles" alt="Bubbles">
        </div>

        <section class="auth-card" aria-labelledby="login-title">
          <span class="game-overline">${isResetMode ? 'PASSWORD RECOVERY' : 'GOOD TO SEE YOU'}</span>
          <h1 id="login-title">${isResetMode ? 'Reset your password' : 'Back to the pond'}</h1>
          <p class="auth-subtitle">${
            isResetMode
              ? 'Enter your email address and we’ll send you a password reset link.'
              : 'Sign in and help Pip find that button.'
          }</p>

          ${
            props.configNotice
              ? `<div class="auth-notice-box" role="status">
                  <small><strong>Note:</strong> ${escapeHtml(props.configNotice)}</small>
                </div>`
              : ''
          }

          ${
            props.successMessage
              ? `<p class="auth-success" role="status" style="background:#e0f7f1;color:#116859;padding:10px 14px;border-radius:10px;font-size:0.85rem;border:1px solid #b7ecdf;margin:10px 0;">
                  ${escapeHtml(props.successMessage)}
                </p>`
              : ''
          }

          ${
            props.errorMessage
              ? `<p class="auth-error" role="alert">${escapeHtml(props.errorMessage)}</p>`
              : ''
          }

          ${
            isResetMode
              ? `
              <form class="game-entry-form" id="forgot-password-form" novalidate>
                <label>
                  YOUR ACCOUNT EMAIL
                  <input name="email" type="email" autocomplete="email" value="${escapeAttr(identity)}" placeholder="you@thepond.com" required>
                </label>

                <button class="play-button auth-submit" type="submit" style="margin-top:14px;">
                  <span class="play-gem"><img src="${assetUrl('icon-play')}" alt="Send"></span>
                  <span>SEND RESET LINK</span>
                  <span class="play-arrow">→</span>
                </button>
              </form>

              <button class="auth-switch" data-action="toggle-reset-mode" type="button" style="margin-top:12px;">
                Remembered it? <strong>BACK TO SIGN IN</strong>
              </button>
            `
              : `
              <form class="game-entry-form" id="login-form" novalidate>
                <label>
                  EMAIL ADDRESS
                  <input name="email" type="email" autocomplete="username" value="${escapeAttr(identity)}" placeholder="you@thepond.com" required>
                </label>
                <label>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span>PASSWORD</span>
                    <button type="button" data-action="toggle-reset-mode" style="background:none;border:none;color:#1e6a75;font-size:0.75rem;cursor:pointer;text-decoration:underline;">Forgot?</button>
                  </div>
                  <input name="password" type="password" autocomplete="current-password" placeholder="Your password" required>
                </label>

                <label class="remember-choice">
                  <input name="remember" type="checkbox" ${rememberChecked}>
                  <span>Remember me on this device</span>
                </label>

                <button class="play-button auth-submit" type="submit">
                  <span class="play-gem"><img src="${assetUrl('icon-play')}" alt="Play"></span>
                  <span>LET’S GO</span>
                  <span class="play-arrow">→</span>
                </button>
              </form>

              ${
                googleAuthAvailable
                  ? `
                    <div class="auth-divider"><span>OR</span></div>
                    <button class="google-auth-button" data-action="login-google" type="button">
                      <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                  `
                  : ''
              }

              <button class="auth-switch" data-action="go-register">
                New around here? <strong>CREATE ACCOUNT</strong>
              </button>
            `
          }
        </section>
      </div>

      <div class="start-footer">
        <span>Your pond progress is saved as you go.</span>
      </div>
    </main>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttr(text: string): string {
  return text.replace(/"/g, '&quot;');
}
