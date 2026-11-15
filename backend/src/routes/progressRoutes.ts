import { Router, type Response } from 'express';
import { authenticateToken, type AuthenticatedRequest } from '../middleware/authenticationMiddleware';
const progressStore = new Map<string, Record<string, unknown>>();

export const progressRoutes = Router();

// GET /api/progress/:userId
progressRoutes.get('/:userId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const progress = progressStore.get(userId);
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

  progressStore.set(userId, { ...payload, userId, lastUpdated: new Date().toISOString() });

  res.json({ success: true });
});

export default progressRoutes;
