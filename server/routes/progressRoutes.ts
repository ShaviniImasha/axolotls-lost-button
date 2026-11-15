import { Router, type Response } from 'express';
import { adminDb, isFirebaseAdminInitialized } from '../firebaseAdmin';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();
const inMemoryProgress = new Map<string, Record<string, unknown>>();
const VALID_LEVEL_IDS = new Set([
  'pond-easy', 'pond-medium', 'pond-hard',
  'coral-easy', 'coral-medium', 'coral-hard',
  'cave-easy', 'cave-medium', 'cave-hard',
]);

export function isValidProgressPayload(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const progress = value as Record<string, unknown>;
  if (
    'currentLevel' in progress &&
    (typeof progress.currentLevel !== 'string' || !VALID_LEVEL_IDS.has(progress.currentLevel))
  ) return false;
  for (const field of ['unlockedLevels', 'completedLevels'] as const) {
    if (
      field in progress &&
      (!Array.isArray(progress[field]) ||
        !(progress[field] as unknown[]).every((id) => typeof id === 'string' && VALID_LEVEL_IDS.has(id)))
    ) return false;
  }
  if ('totalScore' in progress && !isValidScore(progress.totalScore)) return false;
  if ('levelProgress' in progress) {
    if (!progress.levelProgress || typeof progress.levelProgress !== 'object' || Array.isArray(progress.levelProgress)) {
      return false;
    }
    for (const [levelId, item] of Object.entries(progress.levelProgress)) {
      if (!VALID_LEVEL_IDS.has(levelId) || !item || typeof item !== 'object' || Array.isArray(item)) return false;
      const bestScore = (item as Record<string, unknown>).bestScore;
      if (!isValidScore(bestScore)) return false;
    }
  }
  return true;
}

function isValidScore(score: unknown): boolean {
  return typeof score === 'number' && Number.isFinite(score) && score >= 0;
}

// GET progress for player
router.get('/:userId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;

  if (isFirebaseAdminInitialized && adminDb) {
    try {
      const docSnap = await adminDb.collection('players').doc(userId).get();
      if (docSnap.exists) {
        return res.json({ profile: docSnap.data() });
      }
      return res.status(404).json({ error: 'Player progress not found' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to read progress from Firestore' });
    }
  }

  const local = inMemoryProgress.get(userId);
  if (local) {
    return res.json({ profile: local });
  }
  return res.status(404).json({ error: 'No progress found' });
});

// POST progress for player
router.post('/:userId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;
  const progressData = req.body;

  if (!isValidProgressPayload(progressData)) {
    return res.status(400).json({ error: 'Invalid progress data: level IDs and scores must be valid' });
  }

  const payload = {
    ...progressData,
    playerId: userId,
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseAdminInitialized && adminDb) {
    try {
      await adminDb.collection('players').doc(userId).set(payload, { merge: true });
      return res.json({ success: true, message: 'Saved to Firestore' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save progress to Firestore' });
    }
  }

  inMemoryProgress.set(userId, payload);
  return res.json({ success: true, message: 'Saved to memory (emulated)' });
});

export default router;
