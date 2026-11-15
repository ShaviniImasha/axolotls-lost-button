import { Router } from 'express';
import { adminDb, isFirebaseAdminInitialized } from '../firebaseAdmin';

const router = Router();

const SAMPLE_LEADERBOARD = [
  { playerId: 'sample-1', name: 'CoralComet', avatar: 'fish-peach', score: 320, pearls: 31, completedLevelsCount: 3 },
  { playerId: 'sample-2', name: 'BubblesAxo', avatar: 'axolotl-excited', score: 260, pearls: 27, completedLevelsCount: 3 },
  { playerId: 'sample-3', name: 'PearlSprout', avatar: 'fish-mint', score: 210, pearls: 22, completedLevelsCount: 2 },
  { playerId: 'sample-4', name: 'Moonfin', avatar: 'fish-lavender', score: 175, pearls: 18, completedLevelsCount: 2 },
  { playerId: 'sample-5', name: 'KelpScout', avatar: 'jellyfish', score: 120, pearls: 14, completedLevelsCount: 1 },
];

const VALID_DIFFICULTIES = new Set(['all', 'easy', 'medium', 'hard']);
const LEVEL_IDS = [
  'pond-easy', 'pond-medium', 'pond-hard',
  'coral-easy', 'coral-medium', 'coral-hard',
  'cave-easy', 'cave-medium', 'cave-hard',
];

function scoreForDifficulty(data: Record<string, unknown>, difficulty: string): number {
  if (difficulty === 'all') {
    return typeof data.totalScore === 'number' && Number.isFinite(data.totalScore) ? data.totalScore : 0;
  }
  const progress = data.levelProgress;
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) return 0;
  return LEVEL_IDS.filter((id) => id.endsWith(`-${difficulty}`)).reduce((total, id) => {
    const level = (progress as Record<string, unknown>)[id];
    if (!level || typeof level !== 'object' || Array.isArray(level)) return total;
    const bestScore = (level as Record<string, unknown>).bestScore;
    return total + (typeof bestScore === 'number' && Number.isFinite(bestScore) ? bestScore : 0);
  }, 0);
}

function completedCount(data: Record<string, unknown>, difficulty: string): number {
  if (!Array.isArray(data.completedLevels)) return 0;
  return data.completedLevels.filter(
    (id) => typeof id === 'string' && LEVEL_IDS.includes(id) && (difficulty === 'all' || id.endsWith(`-${difficulty}`)),
  ).length;
}

router.get('/', async (req, res) => {
  const requestedDifficulty = typeof req.query.difficulty === 'string' ? req.query.difficulty : 'all';
  if (!VALID_DIFFICULTIES.has(requestedDifficulty)) {
    return res.status(400).json({ error: 'Invalid difficulty filter' });
  }
  const difficulty = requestedDifficulty;

  if (isFirebaseAdminInitialized && adminDb) {
    try {
      const snapshot = await adminDb
        .collection('players')
        .orderBy('totalScore', 'desc')
        .limit(100)
        .get();

      const players = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          playerId: doc.id,
          name: data.name || 'Explorer',
          avatar: data.avatar || 'axolotl-happy',
          score: scoreForDifficulty(data, difficulty),
          pearls: typeof data.collectedPearls === 'number' ? data.collectedPearls : 0,
          completedLevelsCount: completedCount(data, difficulty),
        };
      });

      return res.json({ leaderboard: players });
    } catch (err) {
      console.warn('Leaderboard Firestore query error:', err);
    }
  }

  const fallback = SAMPLE_LEADERBOARD.map((player) => ({
    ...player,
    score: difficulty === 'all' ? player.score : Math.round(player.score / 3),
    completedLevelsCount: difficulty === 'all' ? player.completedLevelsCount : Math.min(player.completedLevelsCount, 1),
  }));
  res.json({ leaderboard: fallback });
});

export default router;
