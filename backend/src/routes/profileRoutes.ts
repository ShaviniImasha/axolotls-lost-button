import { Router } from 'express';
import { authenticateToken, type AuthenticatedRequest } from '../middleware/authenticationMiddleware';

export const profileRoutes = Router();

profileRoutes.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  if (!req.user?.uid) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.json({ profile: { playerId: req.user.uid, name: 'Guest Explorer', email: req.user.email ?? null } });
});

export default profileRoutes;
