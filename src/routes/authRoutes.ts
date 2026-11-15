/**
 * Auth Routes
 * Model-View-Controller (MVC) - Backend Route Layer
 */

import { Router } from 'express';
import { authenticateToken, type AuthenticatedRequest } from '../middleware/authenticationMiddleware';

export const authRoutes = Router();

authRoutes.get('/verify', authenticateToken, (req: AuthenticatedRequest, res) => {
  res.json({
    status: 'ok',
    user: req.user,
  });
});

authRoutes.post('/status', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

export default authRoutes;
