/**
 * Object Controller
 * Backend MVC - Controller Layer
 */

import type { Request, Response } from 'express';

export class ObjectController {
  public static validateObjectDiscovery(req: Request, res: Response): void {
    const { objectId, levelId } = req.body;
    if (!objectId) {
      res.status(400).json({ error: 'Missing objectId' });
      return;
    }

    res.json({
      success: true,
      objectId,
      levelId,
      points: objectId.includes('pearl') || objectId.includes('treasure') ? 10 : 5,
      timestamp: Date.now(),
    });
  }
}
