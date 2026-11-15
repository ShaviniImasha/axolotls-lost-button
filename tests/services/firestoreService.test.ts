import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/firebase/config', () => ({
  db: null,
  isFirebaseConfigured: false,
  getFirebaseConfigStatus: () => ({ isConfigured: false, missingKeys: [] }),
}));

import { FirestoreService } from '../../src/services/firestoreService';

const storage = new Map<string, string>();

describe('FirestoreService Collections & Schema', () => {
  let service: FirestoreService;

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    });
    service = FirestoreService.getInstance();
  });

  it('defines correct collection structures for players, playerProgress, scores, and achievements', async () => {
    expect(typeof service.createInitialPlayerRecords).toBe('function');
    expect(typeof service.recordPlayerLogin).toBe('function');
    expect(typeof service.loadPlayerProfile).toBe('function');
    expect(typeof service.savePlayerProgress).toBe('function');
    expect(typeof service.unlockAchievement).toBe('function');
    expect(typeof service.getUserAchievements).toBe('function');
  });

  it('handles fallback storage and retrieval gracefully', async () => {
    const mockId = 'test_player_mock_' + Date.now();
    const testData = {
      playerId: mockId,
      name: 'TestPip',
      totalScore: 150,
      currentLevel: 'pond-easy' as const,
      completedLevels: ['pond-easy' as const],
      collectedPearls: 10,
      collectedClues: ['clue-1'],
    };

    const saved = await service.savePlayerProgress(mockId, testData);
    expect(saved).toBe(true);

    const loaded = await service.loadPlayerProfile(mockId);
    expect(loaded).toBeDefined();
    expect(loaded?.totalScore).toBe(150);
    expect(loaded?.name).toBe('TestPip');
  });
});
