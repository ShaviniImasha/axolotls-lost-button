import { Router } from 'express';
import { authenticateToken, type AuthenticatedRequest } from '../middleware/authenticationMiddleware';

export const gameRoutes = Router();

gameRoutes.post('/session/start', (req, res) => {
  const { levelId } = req.body;
  res.json({
    success: true,
    sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    levelId: levelId || 'pond-easy',
    startedAt: Date.now(),
  });
});

gameRoutes.post('/session/validate-chest', (req, res) => {
  const { code, targetCode } = req.body;
  if (!Array.isArray(code) || !Array.isArray(targetCode)) {
    res.status(400).json({ error: 'Invalid code format' });
    return;
  }
  const isMatch = code.every((digit, idx) => digit === targetCode[idx]);
  res.json({
    success: isMatch,
    message: isMatch ? 'Click! The chest pops open!' : 'The dials shudder and lock firm. Keep looking for clues!',
  });
});

export default gameRoutes;
