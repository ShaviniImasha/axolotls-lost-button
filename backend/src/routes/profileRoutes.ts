/**
 * Profile Routes
 * Model-View-Controller (MVC) - Backend Route Layer
 */

import { Router } from 'express';
import { authenticateToken, type AuthenticatedRequest } from '../middleware/authenticationMiddleware';
import { userRepository } from '../repositories/UserRepository';

export const profileRoutes = Router();

profileRoutes.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  if (!req.user?.uid) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const profile = await userRepository.getProfile(req.user.uid);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }
  res.json({ profile: profile.toJSON() });
});

export default profileRoutes;
