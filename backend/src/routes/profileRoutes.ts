/**
 * Profile Routes
 * Backend Route Layer
 */

import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { authenticateToken } from '../middleware/authenticationMiddleware';

export const profileRoutes = Router();

profileRoutes.put('/update', authenticateToken, ProfileController.updateProfile);

export default profileRoutes;
