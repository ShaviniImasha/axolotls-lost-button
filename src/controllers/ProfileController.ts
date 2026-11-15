// src/controllers/ProfileController.ts
import { authService } from '../services/authService';
import { firestoreService } from '../services/firestoreService';
import type { PlayerProfileData } from '../services/authService';

/**
 * Initializes event listeners for profile editing actions.
 * Listens for clicks on elements with a `data-action` attribute and dispatches the appropriate handler.
 */
export function initProfileController(): void {
  document.addEventListener('click', async (e) => {
    const target = (e.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
    if (!target) return;
    const action = target.dataset.action;
    if (!action) return;

    switch (action) {
      case 'toggle-edit-profile':
        toggleEditProfile();
        break;
      case 'toggle-pond-settings':
        togglePondSettings();
        break;
      case 'toggle-ocean':
      case 'toggle-bubbles':
      case 'toggle-motion':
      case 'toggle-guidance':
      case 'toggle-timer':
        toggleSwitch(action);
        break;
      case 'reset-pond-settings':
        resetPondSettings();
        break;
      case 'save-username':
        await saveUsername();
        break;
      case 'save-email':
        await saveEmail();
        break;
      case 'save-password':
        await savePassword();
        break;
      default:
        // unknown action – ignore
        break;
    }
  });
}

function togglePondSettings(): void {
  const panel = document.getElementById('pond-settings-panel');
  if (!panel) return;
  const isVisible = panel.style.display === 'flex';
  panel.style.display = isVisible ? 'none' : 'flex';
  panel.setAttribute('aria-hidden', isVisible ? 'true' : 'false');
}

function toggleSwitch(action: string): void {
  const idMap: Record<string, string> = {
    'toggle-ocean': 'toggle-ocean',
    'toggle-bubbles': 'toggle-bubbles',
    'toggle-motion': 'toggle-motion',
    'toggle-guidance': 'toggle-guidance',
    'toggle-timer': 'toggle-timer',
  };
  const btn = document.getElementById(idMap[action]) as HTMLButtonElement | null;
  if (!btn) return;
  const isOn = btn.getAttribute('aria-checked') === 'true';
  btn.setAttribute('aria-checked', isOn ? 'false' : 'true');
  btn.classList.toggle('off', isOn);
}

function resetPondSettings(): void {
  const defaults: Record<string, boolean> = {
    'toggle-ocean': true,
    'toggle-bubbles': true,
    'toggle-motion': false,
    'toggle-guidance': true,
    'toggle-timer': false,
  };
  for (const [id, state] of Object.entries(defaults)) {
    const btn = document.getElementById(id) as HTMLButtonElement | null;
    if (!btn) continue;
    btn.setAttribute('aria-checked', String(state));
    btn.classList.toggle('off', !state);
  }
}

function toggleEditProfile(): void {
  const panel = document.getElementById('edit-profile-panel');
  if (!panel) return;
  const isVisible = panel.style.display === 'flex';
  panel.style.display = isVisible ? 'none' : 'flex';
  if (!isVisible) {
    // focus first input when opening
    const firstInput = panel.querySelector('input');
    (firstInput as HTMLElement)?.focus();
  }
}

async function saveUsername(): Promise<void> {
  const input = document.getElementById('edit-username') as HTMLInputElement;
  const statusEl = document.getElementById('edit-profile-status');
  if (!input || !statusEl) return;
  const newName = input.value.trim();
  if (!newName) {
    statusEl.textContent = 'Username cannot be empty.';
    return;
  }
  try {
    await authService.updateUsername(newName);
    statusEl.textContent = 'Username updated.';
  } catch (err) {
    statusEl.textContent = (err as Error).message;
  }
}

async function saveEmail(): Promise<void> {
  const emailInput = document.getElementById('edit-email') as HTMLInputElement;
  const passwordInput = document.getElementById('edit-email-password') as HTMLInputElement;
  const statusEl = document.getElementById('edit-profile-status');
  if (!emailInput || !passwordInput || !statusEl) return;
  const newEmail = emailInput.value.trim();
  const password = passwordInput.value;
  if (!newEmail || !password) {
    statusEl.textContent = 'Both email and current password are required.';
    return;
  }
  try {
    await authService.updateUserEmail(newEmail, password);
    statusEl.textContent = 'Email updated.';
    passwordInput.value = '';
  } catch (err) {
    statusEl.textContent = (err as Error).message;
  }
}

async function savePassword(): Promise<void> {
  const currentInput = document.getElementById('edit-current-password') as HTMLInputElement;
  const newInput = document.getElementById('edit-new-password') as HTMLInputElement;
  const confirmInput = document.getElementById('edit-confirm-password') as HTMLInputElement;
  const statusEl = document.getElementById('edit-profile-status');
  if (!currentInput || !newInput || !confirmInput || !statusEl) return;
  const current = currentInput.value;
  const newPass = newInput.value;
  const confirm = confirmInput.value;
  if (!current || !newPass) {
    statusEl.textContent = 'Current and new passwords are required.';
    return;
  }
  if (newPass !== confirm) {
    statusEl.textContent = 'New passwords do not match.';
    return;
  }
  try {
    await authService.updateUserPassword(current, newPass);
    statusEl.textContent = 'Password updated.';
    currentInput.value = '';
    newInput.value = '';
    confirmInput.value = '';
  } catch (err) {
    statusEl.textContent = (err as Error).message;
  }
}
