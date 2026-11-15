import type { Request, Response, NextFunction } from 'express';
import { adminAuth, isFirebaseAdminInitialized } from '../firebaseAdmin';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header.' });
    return;
  }

  const token = authHeader.split('Bearer ')[1].trim();

  if (isFirebaseAdminInitialized && adminAuth) {
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      req.user = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
      };
      next();
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized: Invalid Firebase ID token.' });
    }
  } else {
    // Local / unconfigured fallback: decode token or treat token as UID
    req.user = {
      uid: token.startsWith('local_') ? token : 'player_' + token.substring(0, 10),
      email: 'player@example.com',
      name: 'Axo Explorer',
    };
    next();
  }
}

