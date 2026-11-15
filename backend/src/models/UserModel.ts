/**
 * User Model
 * Backend MVC - Model Layer
 */

export interface UserAttributes {
  id: string;
  email: string | null;
  displayName: string;
  avatar: string;
  isGuest: boolean;
  totalScore: number;
  collectedPearls: number;
  completedLevels: string[];
  createdAt: number;
  lastLoginAt: number;
}

export class UserModel {
  private attrs: UserAttributes;

  constructor(attrs: Partial<UserAttributes>) {
    this.attrs = {
      id: attrs.id || `user_${Date.now()}`,
      email: attrs.email || null,
      displayName: attrs.displayName || (attrs.email ? attrs.email.split('@')[0] : 'Bubble Explorer'),
      avatar: attrs.avatar || 'axolotl-happy',
      isGuest: attrs.isGuest ?? (attrs.email === null),
      totalScore: attrs.totalScore || 0,
      collectedPearls: attrs.collectedPearls || 0,
      completedLevels: attrs.completedLevels || [],
      createdAt: attrs.createdAt || Date.now(),
      lastLoginAt: attrs.lastLoginAt || Date.now(),
    };
  }

  public getId(): string {
    return this.attrs.id;
  }

  public getAttributes(): UserAttributes {
    return { ...this.attrs, completedLevels: [...this.attrs.completedLevels] };
  }

  public updateProfile(displayName?: string, avatar?: string): void {
    if (displayName && displayName.trim()) {
      this.attrs.displayName = displayName.trim().slice(0, 30);
    }
    if (avatar) {
      this.attrs.avatar = avatar;
    }
    this.attrs.lastLoginAt = Date.now();
  }

  public toJSON(): UserAttributes {
    return this.getAttributes();
  }
}
