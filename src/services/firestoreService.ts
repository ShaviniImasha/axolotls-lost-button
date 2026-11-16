import type { PlayerProfileData } from '../../frontend/src/services/authService';

const keyFor = (playerId: string) => `axolotl_progress_${playerId}`;

export class FirestoreService {
  private static instance: FirestoreService;

  private constructor() {}

  public static getInstance(): FirestoreService {
    return (FirestoreService.instance ??= new FirestoreService());
  }

  public async createInitialPlayerRecords(): Promise<void> {}
  public async recordPlayerLogin(): Promise<void> {}
  public async unlockAchievement(): Promise<void> {}
  public async getUserAchievements(): Promise<unknown[]> { return []; }

  public async savePlayerProgress(playerId: string, progress: Partial<PlayerProfileData>): Promise<boolean> {
    const storage = typeof window !== 'undefined' ? window.localStorage : null;
    if (!storage) return false;
    const previous = storage.getItem(keyFor(playerId));
    storage.setItem(keyFor(playerId), JSON.stringify({ ...(previous ? JSON.parse(previous) : {}), ...progress }));
    return true;
  }

  public async loadPlayerProfile(playerId: string): Promise<Partial<PlayerProfileData> | null> {
    const storage = typeof window !== 'undefined' ? window.localStorage : null;
    if (!storage) return null;
    const saved = storage.getItem(keyFor(playerId));
    return saved ? JSON.parse(saved) : null;
  }
}

export const firestoreService = FirestoreService.getInstance();
