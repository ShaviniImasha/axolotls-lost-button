import { beforeEach, describe, expect, it } from 'vitest';

describe('SettingsService', () => {
  let simulatedStore: Record<string, string> = {};

  beforeEach(() => {
    simulatedStore = {};
    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => simulatedStore[k] || null,
        setItem: (k: string, v: string) => {
          simulatedStore[k] = v;
        },
        removeItem: (k: string) => {
          delete simulatedStore[k];
        },
        clear: () => {
          simulatedStore = {};
        },
      },
    };
    (globalThis as any).document = {
      body: {
        classList: {
          add: () => {},
          remove: () => {},
        },
      },
    };
  });

  it('initializes with default settings', async () => {
    const { settingsService } = await import('../../src/services/settingsService');
    settingsService.resetToDefaults();
    const settings = settingsService.getSettings();
    expect(settings.soundEffects).toBe(true);
    expect(settings.musicEnabled).toBe(true);
    expect(settings.ambientBubbles).toBe(true);
    expect(settings.reducedMotion).toBe(false);
  });

  it('toggles settings correctly and persists', async () => {
    const { settingsService } = await import('../../src/services/settingsService');
    const result = settingsService.toggle('reducedMotion');
    expect(result).toBe(true);
    expect(settingsService.get('reducedMotion')).toBe(true);

    // Toggle back
    const result2 = settingsService.toggle('reducedMotion');
    expect(result2).toBe(false);
    expect(settingsService.get('reducedMotion')).toBe(false);
  });

  it('resets to defaults when requested', async () => {
    const { settingsService } = await import('../../src/services/settingsService');
    settingsService.set('ambientBubbles', false);
    settingsService.set('soundEffects', false);
    expect(settingsService.get('ambientBubbles')).toBe(false);

    settingsService.resetToDefaults();
    expect(settingsService.get('ambientBubbles')).toBe(true);
    expect(settingsService.get('soundEffects')).toBe(true);
  });
});
