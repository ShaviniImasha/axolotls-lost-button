/**
 * Auth Routes
 * Backend Route Layer
 */

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken } from '../middleware/authenticationMiddleware';

export const authRoutes = Router();

authRoutes.get('/verify', authenticateToken, AuthController.verifySession);
authRoutes.get('/profile', authenticateToken, AuthController.getProfile);

export default authRoutes;
