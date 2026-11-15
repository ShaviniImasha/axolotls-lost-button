import { ASSET_GROUPS, loadAssetImage, type AssetName } from './assets';
import { authService, formatAuthError } from './services/authService';
import { audioService } from './services/audioService';
import { gameController, type ControllerState } from './game/gameController';
import { renderLandingPage } from './components/LandingPage';
import { renderLoginPage } from './components/LoginPage';
import { renderRegisterPage } from './components/RegisterPage';
import { renderHomePage } from './components/HomePage';
import { renderLevelSelectPage } from './components/LevelSelectPage';
import { renderExplorationScreen } from './components/ExplorationScreen';
import { renderFishPuzzleOverlay } from './components/FishPuzzleOverlay';
import { renderTreasureChestModal } from './components/TreasureChestModal';
import { renderLevelCompleteScreen } from './components/LevelCompleteScreen';
import { renderLeaderboardScreen } from './components/LeaderboardScreen';
import { renderProfileScreen } from './components/ProfileScreen';
import { renderPauseOverlay } from './components/PauseOverlay';
import { renderConfirmDialog } from './components/ConfirmDialog';
import { renderSettingsModal } from './components/SettingsModal';
import { CookieBanner } from './components/CookieBanner';
import { CookieService } from './services/cookieService';
import { settingsService } from './services/settingsService';
import { buildLevelId, REALMS, type Difficulty } from './game/levelManager';
import './style.css';
import './style-pond-settings.css';
import { initProfileController } from './controllers/ProfileController';

const mount = document.querySelector<HTMLDivElement>('#app');
if (!mount) throw new Error('The game mount point #app was not found.');
const app = mount;

// Two persistent child layers so overlays are never rebuilt by timer ticks.
const screenLayer = document.createElement('div');
screenLayer.id = 'screen-layer';
const overlayLayer = document.createElement('div');
overlayLayer.id = 'overlay-layer';
app.appendChild(screenLayer);
app.appendChild(overlayLayer);

// Track what was last rendered so we skip identical re-renders.
let lastScreen = '';
let lastOverlayKey = '';  // a short key that changes when overlay state changes

const ALL_ASSET_NAMES: AssetName[] = Object.values(ASSET_GROUPS).flatMap((names) => names);
let artLoaded = false;
let artProgress = 0;
let artError = '';
let authErrorMessage: string | null = null;
let authSuccessMessage: string | null = null;
let isResetMode = false;
let isSettingsModalOpen = false;

type PondSettings = {
  oceanAmbience: boolean;
  floatingBubbles: boolean;
  reducedMotion: boolean;
  pipGuidance: boolean;
  relaxedTimer: boolean;
};

const DEFAULT_POND_SETTINGS: PondSettings = {
  oceanAmbience: true,
  floatingBubbles: true,
  reducedMotion: false,
  pipGuidance: true,
  relaxedTimer: false,
};
const POND_SETTINGS_STORAGE_KEY = 'axolotl-pond-settings';

function getPondSettings(): PondSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(POND_SETTINGS_STORAGE_KEY) || 'null') as Partial<PondSettings> | null;
    return { ...DEFAULT_POND_SETTINGS, ...(saved || {}) };
  } catch {
    return { ...DEFAULT_POND_SETTINGS };
  }
}

function applyPondSettings(): void {
  const settings = getPondSettings();
  document.body.classList.toggle('pond-reduced-motion', settings.reducedMotion);
  document.body.classList.toggle('pond-hide-bubbles', !settings.floatingBubbles);
  document.body.classList.toggle('pond-calm-water', !settings.oceanAmbience);
}

function syncPondSettingsPanel(): void {
  const settings = getPondSettings();
  const controls: Array<[keyof PondSettings, string]> = [
    ['oceanAmbience', 'toggle-ocean'],
    ['floatingBubbles', 'toggle-bubbles'],
    ['reducedMotion', 'toggle-motion'],
    ['pipGuidance', 'toggle-guidance'],
    ['relaxedTimer', 'toggle-timer'],
  ];
  for (const [key, id] of controls) {
    const button = document.getElementById(id);
    if (!button) continue;
    button.classList.toggle('off', !settings[key]);
    button.setAttribute('aria-checked', String(settings[key]));
  }
}

function togglePondSetting(key: keyof PondSettings): void {
  const settings = getPondSettings();
  settings[key] = !settings[key];
  localStorage.setItem(POND_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  applyPondSettings();
  syncPondSettingsPanel();
}

applyPondSettings();

// Preload SVG assets
async function preloadArtwork(): Promise<void> {
  artError = '';
  artProgress = 0;
  render();

  const results = await Promise.allSettled(
    ALL_ASSET_NAMES.map(async (name) => {
      try {
        await loadAssetImage(name);
      } finally {
        artProgress += 1;
        if (!artLoaded) render();
      }
    }),
  );

  const failed = results.flatMap((r, i) => (r.status === 'rejected' ? [ALL_ASSET_NAMES[i]] : []));
  if (failed.length > 0) {
    artError = `Some artwork could not be loaded: ${failed.join(', ')}. Please refresh.`;
    render();
    return;
  }

  artLoaded = true;
  render();
}

function render(): void {
  if (!artLoaded) {
    screenLayer.innerHTML = `
      <main class="art-loading">
        <span>GATHERING LITTLE OCEAN MAGIC</span>
        <progress value="${artProgress}" max="${ALL_ASSET_NAMES.length}"></progress>
        <small>${artError || `${artProgress} / ${ALL_ASSET_NAMES.length} illustrations ready`}</small>
      </main>
    `;
    return;
  }

  const state = gameController.getState();
  const hiddenObjMgr = gameController.getHiddenObjectManager();
  const levelMgr = gameController.getLevelManager();
  const chestLogic = gameController.getChestLogic();
  const puzzleMgr = gameController.getPuzzleManager();
  const scoring = gameController.getScoringSystem();

  // ── OVERLAY LAYER ────────────────────────────────────────────────────────────
  // Build a short key that captures every piece of overlay state that can change.
  // Timer values are intentionally excluded so a tick never rebuilds the overlay.
  const puzzleState = puzzleMgr.getState();
  const overlayKey = [
    state.isFishOverlayOpen ? 1 : 0,
    state.isChestModalOpen ? 1 : 0,
    state.isPauseOverlayOpen ? 1 : 0,
    state.confirmDialog?.isOpen ? state.confirmDialog.confirmAction : 'x',
    // Fish puzzle: track loading/error/answer/feedback — but NOT the score (timer-driven)
    puzzleState.loading ? 'L' : puzzleState.error ? 'E' : puzzleState.current?.imageUrl ?? '',
    puzzleState.selectedAnswer ?? 'n',
    puzzleState.feedback ?? 'n',
    puzzleState.submitted ? 1 : 0,
    puzzleState.hintUsed ? 1 : 0,
    puzzleState.eliminatedOption ?? 'n',
    // Chest: track dial positions and feedback
    state.isChestModalOpen ? chestLogic.getCurrentCode().join(',') : '',
    state.chestFeedbackMessage ?? '',
    // Settings modal
    isSettingsModalOpen ? JSON.stringify(settingsService.getSettings()) : '0',
    // Cookie banner consent status
    CookieService.getInstance().getConsent() ?? 'none',
  ].join('|');

  if (overlayKey !== lastOverlayKey) {
    lastOverlayKey = overlayKey;

    let overlayHtml = '';

    if (state.isFishOverlayOpen) {
      overlayHtml += renderFishPuzzleOverlay({
        puzzle: puzzleState,
        score: scoring.getScore(),
      });
    }

    if (state.isChestModalOpen) {
      const gatheredClues = state.currentLevel.clues.filter((c) => chestLogic.hasClue(c.id));
      overlayHtml += renderTreasureChestModal({
        level: state.currentLevel,
        currentCode: chestLogic.getCurrentCode(),
        unlockedClues: gatheredClues,
        isChestUnlocked: chestLogic.isChestUnlocked(),
        feedbackMessage: state.chestFeedbackMessage,
        isError: state.chestFeedbackIsError,
      });
    }

    if (state.isPauseOverlayOpen) {
      overlayHtml += renderPauseOverlay({
        soundMuted: audioService.isMuted(),
        levelLabel: `${state.currentLevel.realm.name} - ${capitalize(state.currentLevel.difficulty)}`,
      });
    }

    if (state.confirmDialog?.isOpen) {
      overlayHtml += renderConfirmDialog({
        title: state.confirmDialog.title,
        message: state.confirmDialog.message,
        confirmLabel: state.confirmDialog.confirmLabel,
        confirmAction: state.confirmDialog.confirmAction,
        cancelAction: state.confirmDialog.cancelAction,
      });
    }

    if (isSettingsModalOpen) {
      overlayHtml += renderSettingsModal({
        settings: settingsService.getSettings(),
      });
    }

    // Display Cookie Consent Banner if user hasn't made a decision yet
    const cookieConsent = CookieService.getInstance().getConsent();
    if (cookieConsent === null) {
      overlayHtml += CookieBanner.render();
    }

    overlayLayer.innerHTML = overlayHtml;
  }

  // ── SCREEN LAYER ─────────────────────────────────────────────────────────────
  // If an overlay is open and all that changed is the timer, just patch the HUD
  // text in-place rather than rebuilding the entire exploration screen.
  const anyOverlayOpen =
    state.isFishOverlayOpen ||
    state.isChestModalOpen ||
    state.isPauseOverlayOpen ||
    isSettingsModalOpen ||
    !!state.confirmDialog?.isOpen;

  if (anyOverlayOpen && state.currentScreen === 'exploration' && lastScreen === 'exploration') {
    // Patch only the timer / score text without touching the DOM structure.
    const timerEl = screenLayer.querySelector<HTMLElement>('.hud-timer-value');
    if (timerEl && timerEl.textContent !== state.timeRemainingStr) {
      timerEl.textContent = state.timeRemainingStr;
    }
    const bar = screenLayer.querySelector<HTMLElement>('.timer-bar-fill');
    if (bar) {
      bar.style.setProperty('--fraction', String(state.timeFraction));
      bar.style.width = `${Math.max(0, Math.min(1, state.timeFraction)) * 100}%`;
    }
    // Score in HUD
    const scoreEl = screenLayer.querySelector<HTMLElement>('.hud-score-value');
    if (scoreEl) {
      const s = String(scoring.getScore());
      if (scoreEl.textContent !== s) scoreEl.textContent = s;
    }
    return;
  }

  let screenHtml = '';

  switch (state.currentScreen) {
    case 'landing':
      screenHtml = renderLandingPage();
      break;

    case 'login':
      screenHtml = renderLoginPage({
        rememberedIdentity: authService.getRememberedIdentity(),
        errorMessage: authErrorMessage || undefined,
        successMessage: authSuccessMessage || undefined,
        configNotice: authService.getConfigNotice(),
        googleAuthAvailable: authService.isOnline(),
        isResetMode,
      });
      break;

    case 'register':
      screenHtml = renderRegisterPage({
        errorMessage: authErrorMessage || undefined,
      });
      break;

    case 'home':
      if (state.player) {
        screenHtml = renderHomePage({
          player: state.player,
          hasActiveRun: state.hasActiveRun,
          selectedLevelId: state.currentLevel.id,
          unlockedLevels: levelMgr.getUnlockedLevels(),
        });
      } else {
        screenHtml = renderLandingPage();
      }
      break;

    case 'level-select':
      screenHtml = renderLevelSelectPage({
        unlockedLevels: levelMgr.getUnlockedLevels(),
        completedLevels: levelMgr.getCompletedLevels(),
        bestScores: state.player?.levelProgress
          ? Object.fromEntries(
              Object.entries(state.player.levelProgress).map(([id, progress]) => [id, progress.bestScore]),
            )
          : {},
        playerName: state.player?.name,
        playerAvatar: state.player?.avatar,
        score: state.player?.totalScore || 0,
        pearls: state.player?.collectedPearls || 0,
        soundMuted: audioService.isMuted(),
      });
      break;

    case 'exploration':
      screenHtml = renderExplorationScreen({
        level: state.currentLevel,
        score: scoring.getScore(),
        pearls: state.player?.collectedPearls || 0,
        timeRemainingStr: state.timeRemainingStr,
        timeFraction: state.timeFraction,
        hintsRemaining: state.hintsRemaining,
        unfoundObjects: hiddenObjMgr.getUnfoundObjects(),
        foundObjectIds: Array.from((hiddenObjMgr as any).foundObjectIds || []),
        collectedClues: Array.from((chestLogic as any).collectedClueIds || []),
        requiredFoundCount: hiddenObjMgr.getRequiredFoundCount(),
        totalRequiredCount: hiddenObjMgr.getRequiredObjectsCount(),
        isMissionComplete: hiddenObjMgr.isMissionComplete(),
        soundMuted: audioService.isMuted(),
        highlightedCoords: state.highlightedCoords,
        axoSpeech: state.axoSpeech,
        isChestUnlocked: chestLogic.isChestUnlocked(),
      });
      break;

    case 'level-complete': {
      screenHtml = renderLevelCompleteScreen({
        level: state.currentLevel,
        totalScore: state.completedLevelScore,
        pearlsEarned: state.pearlsEarnedThisLevel,
        hasNextLevel: state.nextLevelId !== null,
        nextLevelId: state.nextLevelId,
      });
      break;
    }

    case 'leaderboard':
      screenHtml = renderLeaderboardScreen({
        entries: state.leaderboardEntries,
        difficulty: state.leaderboardDifficulty,
        currentPlayerId: state.player?.playerId,
        playerName: state.player?.name,
        playerAvatar: state.player?.avatar,
        score: state.player?.totalScore || 0,
        pearls: state.player?.collectedPearls || 0,
        soundMuted: audioService.isMuted(),
      });
      break;

    case 'profile':
      if (state.player) {
        screenHtml = renderProfileScreen({
          player: state.player,
          soundMuted: audioService.isMuted(),
        });
      } else {
        gameController.setScreen('login');
      }
      break;
  }

  lastScreen = state.currentScreen;
  if (screenLayer.innerHTML !== screenHtml) {
    screenLayer.innerHTML = screenHtml;
    fitLobbyCanvas();
  }
}

function fitLobbyCanvas(): void {
  screenLayer.querySelector<HTMLElement>('.lobby-canvas')?.classList.remove('is-scaled');
}

window.addEventListener('resize', fitLobbyCanvas);

// Subscribe to game controller updates
gameController.subscribe((_state: ControllerState) => {
  render();
});

// Event Delegation for Clicks
app.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement | null;
  if (!target) return;

  const actionElement = target.closest<HTMLElement>('[data-action]');
  if (!actionElement) return;

  const action = actionElement.dataset.action;
  if (!action) return;

  switch (action) {
    // Navigation
    case 'go-landing':
      authErrorMessage = null;
      authSuccessMessage = null;
      isResetMode = false;
      gameController.setScreen('landing');
      break;

    case 'go-login':
      authErrorMessage = null;
      authSuccessMessage = null;
      isResetMode = false;
      gameController.setScreen('login');
      break;

    case 'go-register':
      authErrorMessage = null;
      authSuccessMessage = null;
      isResetMode = false;
      gameController.setScreen('register');
      break;

    case 'toggle-reset-mode':
      isResetMode = !isResetMode;
      authErrorMessage = null;
      authSuccessMessage = null;
      render();
      break;

    case 'go-home':
      authErrorMessage = null;
      authSuccessMessage = null;
      isResetMode = false;
      if (!authService.getCurrentUser()) {
        authErrorMessage = 'Please sign in to access your pond home.';
        gameController.setScreen('login');
        break;
      }
      gameController.setScreen('home');
      break;

    case 'go-level-select':
      if (!authService.getCurrentUser()) {
        authErrorMessage = 'Please sign in to select a pond.';
        gameController.setScreen('login');
        break;
      }
      gameController.setScreen('level-select');
      break;

    case 'go-leaderboard':
      await gameController.openLeaderboard();
      break;

    case 'go-profile':
      if (!authService.getCurrentUser()) {
        authErrorMessage = 'Please sign in to view your explorer profile.';
        gameController.setScreen('login');
        break;
      }
      gameController.setScreen('profile');
      break;

    case 'select-home-pond': {
      const realm = REALMS.find((item) => item.id === actionElement.dataset.realmId);
      const difficulty = actionElement.dataset.difficulty;
      if (realm && (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard')) {
        gameController.selectLevelPreview(buildLevelId(realm.id, difficulty));
      }
      break;
    }

    case 'select-home-difficulty': {
      const realm = REALMS.find((item) => item.id === actionElement.dataset.realmId);
      const difficulty = actionElement.dataset.difficulty;
      if (realm && (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard')) {
        gameController.selectLevelPreview(buildLevelId(realm.id, difficulty));
      }
      break;
    }

    case 'start-game': {
      if (!authService.getCurrentUser()) {
        authErrorMessage = 'Please sign in to start exploring with Pip!';
        gameController.setScreen('login');
        break;
      }
      const selectedId = actionElement.dataset.levelId ?? gameController.getState().currentLevel.id;
      const selectedLevel = gameController.getLevelManager().getLevelById(selectedId);
      if (selectedLevel && gameController.getLevelManager().isLevelUnlocked(selectedLevel.id)) {
        const button = actionElement as HTMLButtonElement;
        button.disabled = true;
        const label = button.querySelector<HTMLElement>('.lobby-play-label');
        if (label) label.textContent = 'Diving in...';
        button.classList.add('diving');
        await new Promise((resolve) => window.setTimeout(resolve, 550));
        await gameController.startLevel(selectedLevel.id);
      }
      break;
    }

    case 'continue-game':
      if (!authService.getCurrentUser()) {
        authErrorMessage = 'Please sign in to continue playing.';
        gameController.setScreen('login');
        break;
      }
      if (gameController.getState().hasActiveRun) {
        gameController.setScreen('exploration');
      } else {
        await gameController.startLevel(gameController.getState().currentLevel.id);
      }
      break;

    case 'play-level':
    case 'go-next-level': {
      if (!authService.getCurrentUser()) {
        authErrorMessage = 'Please sign in to play levels.';
        gameController.setScreen('login');
        break;
      }
      const levelId = actionElement.dataset.levelId;
      const level = levelId ? gameController.getLevelManager().getLevelById(levelId) : undefined;
      if (level) await gameController.startLevel(level.id);
      break;
    }

    case 'filter-leaderboard': {
      const selected = actionElement.dataset.difficulty;
      if (selected === 'all' || selected === 'easy' || selected === 'medium' || selected === 'hard') {
        await gameController.openLeaderboard(selected as Difficulty | 'all');
      }
      break;
    }

    // Cookie Consent Actions
    case 'accept-cookies': {
      CookieService.getInstance().setConsent('accepted');
      render();
      break;
    }

    case 'decline-cookies': {
      CookieService.getInstance().setConsent('declined');
      render();
      break;
    }

    // Auth actions
    case 'login-google':
      try {
        await authService.loginWithGoogle();
        authErrorMessage = null;
        authSuccessMessage = null;
        isResetMode = false;
        gameController.setScreen('home');
      } catch (err) {
        authErrorMessage = formatAuthError(err);
        authSuccessMessage = null;
        render();
      }
      break;

    case 'logout':
      gameController.showConfirm({
        isOpen: true,
        title: 'Swim off?',
        message: 'Your progress is safe. Ready to switch players?',
        confirmLabel: 'SIGN OUT',
        confirmAction: 'confirm-logout',
        cancelAction: 'cancel-dialog',
      });

      break;

    case 'confirm-logout':
      await authService.logout();
      gameController.dismissConfirm();
      gameController.setScreen('landing');
      break;

    // In-game actions
    case 'toggle-sound':
      audioService.toggleMute();
      settingsService.set('soundEffects', !audioService.isMuted());
      render();
      break;

    case 'open-settings':
      isSettingsModalOpen = true;
      render();
      break;

    case 'toggle-pond-settings': {
      const panel = document.getElementById('pond-settings-panel');
      if (!panel) break;
      const isOpen = panel.getAttribute('aria-hidden') !== 'false';
      panel.style.display = isOpen ? 'grid' : 'none';
      panel.setAttribute('aria-hidden', String(!isOpen));
      if (isOpen) syncPondSettingsPanel();
      break;
    }

    case 'toggle-ocean':
      togglePondSetting('oceanAmbience');
      break;

    case 'toggle-bubbles':
      togglePondSetting('floatingBubbles');
      break;

    case 'toggle-motion':
      togglePondSetting('reducedMotion');
      break;

    case 'toggle-guidance':
      togglePondSetting('pipGuidance');
      break;

    case 'toggle-timer':
      togglePondSetting('relaxedTimer');
      break;

    case 'reset-pond-settings':
      localStorage.setItem(POND_SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_POND_SETTINGS));
      applyPondSettings();
      syncPondSettingsPanel();
      break;

    case 'close-settings':
    case 'close-settings-dim':
      isSettingsModalOpen = false;
      render();
      break;

    case 'toggle-setting': {
      const settingKey = actionElement.dataset.setting as any;
      if (settingKey) {
        const newVal = settingsService.toggle(settingKey);
        if (newVal) {
          audioService.play('bubble');
        }
        render();
      }
      break;
    }

    case 'reset-settings':
      settingsService.resetToDefaults();
      audioService.play('bubble');
      render();
      break;

    case 'pause-game':
      gameController.pauseGame();
      break;

    case 'resume-game':
      gameController.resumeGame();
      break;

    case 'find-object': {
      const objectId = actionElement.dataset.objectId;
      if (objectId) {
        gameController.handleObjectClick(objectId);
      }
      break;
    }

    case 'use-hint':
      gameController.useExplorationHint();
      break;

    case 'open-fish-puzzle':
      await gameController.openFishPuzzle();
      break;

    case 'close-fish-puzzle':
      gameController.closeFishPuzzle();
      break;

    case 'select-fish-answer': {
      const val = Number(actionElement.dataset.value);
      if (!isNaN(val)) {
        gameController.getPuzzleManager().selectAnswer(val);
        render();
      }
      break;
    }

    case 'submit-fish-answer':
      gameController.submitFishAnswer();
      break;

    case 'retry-fish-fetch':
      await gameController.openFishPuzzle();
      break;

    case 'retry-fish-answer':
      gameController.getPuzzleManager().retryCurrentQuestion();
      render();
      break;

    case 'use-fish-hint':
      gameController.useFishHint();
      break;

    case 'open-chest-modal':
      gameController.openChestModal();
      break;

    case 'close-chest-modal':
      gameController.closeChestModal();
      break;

    case 'adjust-dial': {
      const index = Number(actionElement.dataset.index);
      const delta = Number(actionElement.dataset.delta);
      if (!isNaN(index) && !isNaN(delta)) {
        gameController.adjustChestDial(index, delta);
      }
      break;
    }

    case 'submit-chest-unlock':
      gameController.submitChestUnlock();
      break;

    case 'claim-level-complete':
      gameController.claimLevelComplete();
      break;

    case 'click-axolotl':
      audioService.play('bubble');
      gameController.setAxoSpeech('Pip likes you. You can stay.');
      break;

    case 'confirm-quit-to-home':
      gameController.showConfirm({
        isOpen: true,
        title: 'Head back to Pip?',
        message: 'Your spot is saved. You can pick up where you left off.',
        confirmLabel: 'BACK TO PIP',
        confirmAction: 'quit-to-home',
        cancelAction: 'cancel-dialog',
      });
      break;

    case 'quit-to-home':
      gameController.dismissConfirm();
      gameController.setScreen('home');
      break;

    case 'retry-current-level':
      gameController.dismissConfirm();
      await gameController.startLevel(gameController.getState().currentLevel.id);
      break;

    case 'cancel-dialog':
      gameController.dismissConfirm();
      break;

    default:
      break;
  }
});

// Event handling for Forms (Login and Registration)
app.addEventListener('submit', async (event) => {
  const form = event.target as HTMLFormElement | null;
  if (!form) return;
  event.preventDefault();

  if (form.id === 'login-form') {
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    const password = String(data.get('password') || '');
    const remember = data.get('remember') === 'on';

    if (!email || !password) {
      authErrorMessage = 'Please enter both your email address and password.';
      authSuccessMessage = null;
      render();
      return;
    }

    try {
      await authService.login(email, password, remember);
      authErrorMessage = null;
      authSuccessMessage = null;
      isResetMode = false;
      gameController.setScreen('home');
    } catch (err) {
      authErrorMessage = formatAuthError(err);
      authSuccessMessage = null;
      render();
    }
    return;
  }

  if (form.id === 'forgot-password-form') {
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      authErrorMessage = 'Please enter a valid email address.';
      authSuccessMessage = null;
      render();
      return;
    }

    try {
      await authService.resetPassword(email);
      authSuccessMessage = 'Password reset email sent! Check your inbox for instructions.';
      authErrorMessage = null;
      render();
    } catch (err) {
      authErrorMessage = formatAuthError(err);
      authSuccessMessage = null;
      render();
    }
    return;
  }

  if (form.id === 'register-form') {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const password = String(data.get('password') || '');
    const confirmation = String(data.get('confirmation') || '');

    if (!name || name.length < 2) {
      authErrorMessage = 'Player name must be at least 2 characters.';
      authSuccessMessage = null;
      render();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      authErrorMessage = 'Please enter a valid email address.';
      authSuccessMessage = null;
      render();
      return;
    }
    if (!password || password.length < 6) {
      authErrorMessage = 'Password must be at least 6 characters.';
      authSuccessMessage = null;
      render();
      return;
    }
    if (password !== confirmation) {
      authErrorMessage = 'Passwords do not match.';
      authSuccessMessage = null;
      render();
      return;
    }

    try {
      await authService.register(name, email, password);
      authErrorMessage = null;
      authSuccessMessage = null;
      isResetMode = false;
      gameController.setScreen('home');
    } catch (err) {
      authErrorMessage = formatAuthError(err);
      authSuccessMessage = null;
      render();
    }
    return;
  }
});

// Keyboard controls (Escape to pause / close modals)
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (isSettingsModalOpen) {
      isSettingsModalOpen = false;
      render();
      return;
    }
    const state = gameController.getState();
    if (state.isFishOverlayOpen) {
      gameController.closeFishPuzzle();
    } else if (state.isChestModalOpen) {
      gameController.closeChestModal();
    } else if (state.confirmDialog?.isOpen) {
      gameController.dismissConfirm();
    } else if (state.isPauseOverlayOpen) {
      gameController.resumeGame();
    } else if (state.currentScreen === 'exploration') {
      gameController.pauseGame();
    } else if (state.currentScreen === 'level-select' || state.currentScreen === 'leaderboard' || state.currentScreen === 'profile') {
      gameController.setScreen('home');
    }
  }
});

// Preload assets and initialize game
function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

initProfileController();
void preloadArtwork();
