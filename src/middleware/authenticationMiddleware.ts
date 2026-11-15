/**
 * Authentication Middleware
 * Model-View-Controller (MVC) - Middleware Layer
 * Verifies Firebase ID tokens for protected HTTP endpoints.
 */

import type { Request, Response, NextFunction } from 'express';
import { adminAuth, isFirebaseAdminInitialized } from '../../server/firebaseAdmin';

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
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Empty token' });
    return;
  }

  if (isFirebaseAdminInitialized && adminAuth) {
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      req.user = {
        uid: decoded.uid,
        email: decoded.email,
      };
      next();
    } catch (error) {
      res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    }
  } else {
    // Local / emulation mode fallback
    req.user = { uid: token.startsWith('guest-') ? token : 'user_' + token.substring(0, 8), email: 'guest@pond.local' };
    next();
  }
}

export default authenticateToken;
