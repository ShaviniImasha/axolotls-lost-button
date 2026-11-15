import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/authenticationMiddleware';
import { userRepository } from '../repositories/UserRepository';
import { UserModel } from '../models/UserModel';

export class ProfileController {
  public static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { displayName, avatar } = req.body;
    let existing = await userRepository.findById(uid);
    const userModel = new UserModel(existing || { id: uid });
    userModel.updateProfile(displayName, avatar);

    await userRepository.save(userModel.toJSON());
    res.json({ success: true, profile: userModel.toJSON() });
  }
}
