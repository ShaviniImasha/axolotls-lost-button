/**
 * Level Routes
 * Backend Route Layer
 */

import { Router } from 'express';
import { LevelController } from '../controllers/LevelController';

export const levelRoutes = Router();

levelRoutes.get('/list', LevelController.listLevels);
levelRoutes.get('/:id', LevelController.getLevelById);

export default levelRoutes;
