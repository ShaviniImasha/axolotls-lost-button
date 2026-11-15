/**
 * Level Controller
 * Backend MVC - Controller Layer
 */

import type { Request, Response } from 'express';
import { LevelModel } from '../models/LevelModel';

export class LevelController {
  public static listLevels(_req: Request, res: Response): void {
    const levels = LevelModel.getAll();
    res.json({ levels });
  }

  public static getLevelById(req: Request, res: Response): void {
    const levelId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const level = LevelModel.getById(levelId);
    if (!level) {
      res.status(404).json({ error: 'Level not found' });
      return;
    }
    res.json({ level });
  }
}
