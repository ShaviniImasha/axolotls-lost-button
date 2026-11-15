/**
 * Auth Controller
 * Model-View-Controller (MVC) - Controller Layer
 * Coordinates authentication events, credential verification, and user state synchronization.
 */

import { UserModel } from '../models/UserModel';
import { userRepository } from '../repositories/UserRepository';
import { Validation } from '../utils/Validation';
import { ErrorHandler } from '../utils/ErrorHandler';
import { authService, type PlayerProfileData } from '../services/authService';

export interface AuthCredentials {
  email: string;
  password?: string;
  displayName?: string;
}

export class AuthController {
  private static instance: AuthController;
  private currentUserModel: UserModel | null = null;

  private constructor() {
    const current = authService.getCurrentUser();
    if (current) {
      this.syncUser(current);
    }
  }

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  public getCurrentUser(): UserModel | null {
    return this.currentUserModel;
  }

  private syncUser(player: PlayerProfileData): void {
    this.currentUserModel = new UserModel({
      id: player.playerId,
      email: player.email,
      displayName: player.name,
      avatar: player.avatar,
      isGuest: player.playerId.startsWith('guest-'),
      isOnlineUser: player.isOnlineUser ?? false,
    });
  }

  /**
   * Handle user login
   */
  public async handleLogin(credentials: AuthCredentials): Promise<{ success: boolean; user?: UserModel; error?: string }> {
    const validation = Validation.validateLogin(credentials);
    if (!validation.isValid) {
      const firstKey = Object.keys(validation.errors)[0];
      return { success: false, error: validation.errors[firstKey] };
    }

    try {
      const player = await authService.login(credentials.email, credentials.password!);
      this.syncUser(player);
      if (this.currentUserModel) {
        await userRepository.saveProfile(this.currentUserModel);
      }
      return { success: true, user: this.currentUserModel ?? undefined };
    } catch (err) {
      ErrorHandler.log(err, 'AuthController.handleLogin');
      return { success: false, error: ErrorHandler.toPlayerMessage(err) };
    }
  }

  /**
   * Handle user registration
   */
  public async handleRegister(credentials: AuthCredentials): Promise<{ success: boolean; user?: UserModel; error?: string }> {
    const validation = Validation.validateRegistration(credentials);
    if (!validation.isValid) {
      const firstKey = Object.keys(validation.errors)[0];
      return { success: false, error: validation.errors[firstKey] };
    }

    try {
      const player = await authService.register(credentials.displayName || 'Bubble Explorer', credentials.email, credentials.password!);
      this.syncUser(player);
      if (this.currentUserModel) {
        await userRepository.saveProfile(this.currentUserModel);
      }
      return { success: true, user: this.currentUserModel ?? undefined };
    } catch (err) {
      ErrorHandler.log(err, 'AuthController.handleRegister');
      return { success: false, error: ErrorHandler.toPlayerMessage(err) };
    }
  }

  /**
   * Handle Google sign-in
   */
  public async handleGoogleSignIn(): Promise<{ success: boolean; user?: UserModel; error?: string }> {
    try {
      const player = await authService.loginWithGoogle();
      this.syncUser(player);
      if (this.currentUserModel) {
        await userRepository.saveProfile(this.currentUserModel);
      }
      return { success: true, user: this.currentUserModel ?? undefined };
    } catch (err) {
      ErrorHandler.log(err, 'AuthController.handleGoogleSignIn');
      return { success: false, error: ErrorHandler.toPlayerMessage(err) };
    }
  }

  /**
   * Handle Guest explorer mode
   */
  public handleGuestMode(): UserModel {
    const player = authService.getCurrentUser() || {
      playerId: `guest-${Date.now()}`,
      name: 'Bubble Explorer',
      email: null,
      avatar: 'axolotl-happy',
      totalScore: 0,
      currentLevel: 'pond-easy',
      unlockedLevels: ['pond-easy'],
      completedLevels: [],
      levelProgress: {},
      collectedPearls: 0,
      collectedClues: [],
      gameProgress: {},
      completionStatus: false,
      isOnlineUser: false,
    };
    this.syncUser(player as PlayerProfileData);
    return this.currentUserModel!;
  }

  /**
   * Handle sign out
   */
  public async handleSignOut(): Promise<void> {
    try {
      await authService.logout();
      this.currentUserModel = null;
    } catch (err) {
      ErrorHandler.log(err, 'AuthController.handleSignOut');
    }
  }

  /**
   * Handle password reset
   */
  public async handlePasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    if (!Validation.isValidEmail(email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    try {
      await authService.resetPassword(email);
      return { success: true, message: 'A secret recovery ripple has been sent to your inbox!' };
    } catch (err) {
      ErrorHandler.log(err, 'AuthController.handlePasswordReset');
      return { success: false, message: ErrorHandler.toPlayerMessage(err) };
    }
  }
}

export const authController = AuthController.getInstance();
