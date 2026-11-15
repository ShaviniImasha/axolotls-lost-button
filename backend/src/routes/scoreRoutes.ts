import { Router } from 'express';
import { authenticateToken, type AuthenticatedRequest } from '../middleware/authenticationMiddleware';

export const scoreRoutes = Router();

scoreRoutes.post('/submit', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { score, levelId, pearls } = req.body;
  res.json({
    success: true,
    userId: req.user?.uid,
    recordedScore: score,
    levelId,
    pearls,
    timestamp: new Date().toISOString(),
  });
});

export default scoreRoutes;
