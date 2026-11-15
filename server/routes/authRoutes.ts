import { Router } from 'express';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

router.get('/verify', authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({
    status: 'ok',
    user: req.user,
  });
});

export default router;

