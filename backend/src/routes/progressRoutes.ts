/**
 * Progress Routes
 * Backend MVC - Route Layer
 */

import { Router, type Response } from 'express';
import { authenticateToken, type AuthenticatedRequest } from '../middleware/authenticationMiddleware';
import { progressRepository } from '../repositories/ProgressRepository';
import { userRepository } from '../repositories/UserRepository';

export const progressRoutes = Router();

// GET /api/progress/:userId
progressRoutes.get('/:userId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const user = await userRepository.findById(userId);
  if (user) {
    res.json({ profile: user });
    return;
  }

  const progress = await progressRepository.getProgress(userId);
  if (progress) {
    res.json({ profile: progress });
    return;
  }

  res.status(404).json({ error: 'Player progress not found' });
});

// POST /api/progress/:userId
progressRoutes.post('/:userId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const payload = req.body;

  await progressRepository.saveProgress({
    userId,
    currentLevel: payload.currentLevel || 'pond-easy',
    completedLevels: payload.completedLevels || [],
    collectedRewards: { pearls: payload.collectedPearls || 0 },
    totalScore: payload.totalScore || 0,
    lastUpdated: new Date().toISOString(),
  });

  res.json({ success: true });
});

export default progressRoutes;
