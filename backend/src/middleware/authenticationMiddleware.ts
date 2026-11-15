/**
 * Authentication Middleware
 * Backend Middleware Layer
 * Verifies incoming Firebase Bearer ID tokens.
 */

import type { Request, Response, NextFunction } from 'express';
import { getAdminAuth } from '../config/firebase';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    return;
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Empty token' });
    return;
  }

  const auth = getAdminAuth();
  if (auth) {
    try {
      const decoded = await auth.verifyIdToken(token);
      req.user = { uid: decoded.uid, email: decoded.email };
      next();
      return;
    } catch {
      res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
      return;
    }
  }

  // Development/Emulation fallback
  req.user = {
    uid: token.startsWith('guest-') || token.startsWith('local_') ? token : 'user_' + token.slice(0, 8),
    email: 'explorer@pond.local',
  };
  next();
}
