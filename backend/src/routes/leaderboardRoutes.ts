import { Router } from 'express';
const leaderboard = [
  { playerId: 'sample-1', name: 'CoralComet', avatar: 'fish-peach', score: 320, pearls: 31, completedLevelsCount: 3 },
  { playerId: 'sample-2', name: 'BubblesAxo', avatar: 'axolotl-excited', score: 260, pearls: 27, completedLevelsCount: 3 },
];

export const leaderboardRoutes = Router();

leaderboardRoutes.get('/', (_req, res) => {
  res.json({ leaderboard });
});

export default leaderboardRoutes;
