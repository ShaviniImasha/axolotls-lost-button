import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/authenticationMiddleware';
import { userRepository } from '../repositories/UserRepository';
import { UserModel } from '../models/UserModel';

export class AuthController {
  public static async verifySession(req: AuthenticatedRequest, res: Response): Promise<void> {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ error: 'No user authenticated' });
      return;
    }

    let user = await userRepository.findById(uid);
    if (!user) {
      const newUser = new UserModel({ id: uid, email: req.user?.email || null });
      user = newUser.toJSON();
      await userRepository.save(user);
    }

    res.json({ status: 'ok', user });
  }

  public static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await userRepository.findById(uid);
    res.json({ user: user || null });
  }
}
