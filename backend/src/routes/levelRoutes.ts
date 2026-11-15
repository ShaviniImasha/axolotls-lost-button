import { Router } from 'express';
const levels = [
  { id: 'pond-easy', realmId: 'pond', realmName: 'Magical Pond', difficulty: 'easy', timeLimit: 180 },
  { id: 'coral-easy', realmId: 'coral', realmName: 'Coral Garden', difficulty: 'easy', timeLimit: 180 },
  { id: 'cave-easy', realmId: 'cave', realmName: 'Enchanted Treasure Cave', difficulty: 'easy', timeLimit: 180 },
];

export const levelRoutes = Router();

levelRoutes.get('/list', (_req, res) => {
  res.json({ levels });
});

levelRoutes.get('/:id', (req, res) => {
  const level = levels.find((item) => item.id === req.params.id);
  if (!level) {
    res.status(404).json({ error: 'Level not found' });
    return;
  }
  res.json({ level });
});

export default levelRoutes;
