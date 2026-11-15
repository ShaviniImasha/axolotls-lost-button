/**
 * Profile Controller
 * Model-View-Controller (MVC) - Controller Layer
 * Coordinates player profile settings, avatar selection, and stats viewing.
 */

import { UserModel } from '../models/UserModel';
import { userRepository } from '../repositories/UserRepository';
import type { AssetName } from '../assets';
import { authService } from '../services/authService';

export class ProfileController {
  private userModel: UserModel | null = null;

  constructor(userModel?: UserModel) {
    if (userModel) {
      this.userModel = userModel;
    }
  }

  public setUserModel(model: UserModel): void {
    this.userModel = model;
  }

  public getUserModel(): UserModel | null {
    return this.userModel;
  }

  public async updateAvatar(avatar: AssetName): Promise<boolean> {
    if (!this.userModel) return false;
    this.userModel.setAvatar(avatar);
    await userRepository.saveProfile(this.userModel);
    authService.updateCurrentUserProfile({ avatar });
    return true;
  }

  public async updateDisplayName(name: string): Promise<boolean> {
    if (!this.userModel) return false;
    this.userModel.setDisplayName(name);
    await userRepository.saveProfile(this.userModel);
    authService.updateCurrentUserProfile({ name });
    return true;
  }
}

export const profileController = new ProfileController();
