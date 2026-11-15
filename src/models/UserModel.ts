/**
 * User Model
 * Model-View-Controller (MVC) - Model Layer
 * Represents player identity, authentication profile, and account attributes.
 */

import type { AssetName } from '../assets';
import type { LevelId } from '../game/levelManager';

export interface UserAttributes {
  id: string;
  email: string | null;
  displayName: string;
  avatar: AssetName;
  isGuest: boolean;
  isOnlineUser: boolean;
  createdAt: number;
  lastLoginAt: number;
}

export class UserModel {
  private id: string;
  private email: string | null;
  private displayName: string;
  private avatar: AssetName;
  private isGuest: boolean;
  private isOnlineUser: boolean;
  private createdAt: number;
  private lastLoginAt: number;

  constructor(attributes: Partial<UserAttributes> = {}) {
    this.id = attributes.id || `guest-${Date.now()}`;
    this.email = attributes.email || null;
    this.displayName = attributes.displayName || (this.email ? this.email.split('@')[0] : 'Bubble Explorer');
    this.avatar = attributes.avatar || 'axolotl-happy';
    this.isGuest = attributes.isGuest ?? (attributes.email === null);
    this.isOnlineUser = attributes.isOnlineUser ?? false;
    this.createdAt = attributes.createdAt || Date.now();
    this.lastLoginAt = attributes.lastLoginAt || Date.now();
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string | null {
    return this.email;
  }

  public getDisplayName(): string {
    return this.displayName;
  }

  public setDisplayName(name: string): void {
    const trimmed = name.trim();
    if (trimmed.length > 0 && trimmed.length <= 30) {
      this.displayName = trimmed;
    }
  }

  public getAvatar(): AssetName {
    return this.avatar;
  }

  public setAvatar(avatar: AssetName): void {
    this.avatar = avatar;
  }

  public getIsGuest(): boolean {
    return this.isGuest;
  }

  public getIsOnlineUser(): boolean {
    return this.isOnlineUser;
  }

  public setOnlineStatus(online: boolean): void {
    this.isOnlineUser = online;
  }

  public updateLastLogin(): void {
    this.lastLoginAt = Date.now();
  }

  public toJSON(): UserAttributes {
    return {
      id: this.id,
      email: this.email,
      displayName: this.displayName,
      avatar: this.avatar,
      isGuest: this.isGuest,
      isOnlineUser: this.isOnlineUser,
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt,
    };
  }

  public static fromJSON(json: Partial<UserAttributes>): UserModel {
    return new UserModel(json);
  }
}
