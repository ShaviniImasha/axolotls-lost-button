import { audioService } from './audioService';

export interface GameSettings {
  soundEffects: boolean;
  musicEnabled: boolean;
  ambientBubbles: boolean;
  reducedMotion: boolean;
  autoHints: boolean;
  relaxedTimer: boolean;
}

const STORAGE_KEY = 'axolotl_game_settings';

const DEFAULT_SETTINGS: GameSettings = {
  soundEffects: true,
  musicEnabled: true,
  ambientBubbles: true,
  reducedMotion: false,
  autoHints: true,
  relaxedTimer: false,
};

export class SettingsService {
  private static instance: SettingsService;
  private settings: GameSettings;

  private constructor() {
    this.settings = this.loadSettings();
    this.applySideEffects();
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  private loadSettings(): GameSettings {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback to defaults
    }
    return { ...DEFAULT_SETTINGS };
  }

  private saveSettings(): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // Ignore write errors
    }
    this.applySideEffects();
  }

  private applySideEffects(): void {
    // Sync sound effects mute status & ocean ambience
    audioService.setMuted(!this.settings.soundEffects);
    audioService.setAmbienceEnabled(this.settings.musicEnabled);

    // Apply reduced motion to document
    if (typeof document !== 'undefined') {
      if (this.settings.reducedMotion) {
        document.body.classList.add('reduce-motion');
      } else {
        document.body.classList.remove('reduce-motion');
      }

      if (!this.settings.ambientBubbles) {
        document.body.classList.add('hide-bubbles');
      } else {
        document.body.classList.remove('hide-bubbles');
      }
    }
  }

  public getSettings(): GameSettings {
    return { ...this.settings };
  }

  public get<K extends keyof GameSettings>(key: K): GameSettings[K] {
    return this.settings[key];
  }

  public toggle<K extends keyof GameSettings>(key: K): boolean {
    if (typeof this.settings[key] === 'boolean') {
      (this.settings[key] as boolean) = !this.settings[key];
      this.saveSettings();
      return this.settings[key] as boolean;
    }
    return false;
  }

  public set<K extends keyof GameSettings>(key: K, value: GameSettings[K]): void {
    this.settings[key] = value;
    this.saveSettings();
  }

  public resetToDefaults(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
  }
}

export const settingsService = SettingsService.getInstance();
