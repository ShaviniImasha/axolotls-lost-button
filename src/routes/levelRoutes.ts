/**
 * Level Routes
 * Model-View-Controller (MVC) - Backend Route Layer
 */

import { Router } from 'express';
import { getAllLevels, getLevelById } from '../game/levelManager';

export const levelRoutes = Router();

levelRoutes.get('/list', (_req, res) => {
  const levels = getAllLevels().map((lvl) => ({
    id: lvl.id,
    realmId: lvl.realmId,
    realmName: lvl.realm.name,
    difficulty: lvl.difficulty,
    timeLimit: lvl.difficultySettings.timeLimit,
    missionDescription: lvl.missionDescription,
  }));
  res.json({ levels });
});

levelRoutes.get('/:id', (req, res) => {
  const level = getLevelById(req.params.id);
  if (!level) {
    res.status(404).json({ error: 'Level not found' });
    return;
  }
  res.json({ level });
});

export default levelRoutes;
