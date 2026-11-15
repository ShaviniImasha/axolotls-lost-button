/**
 * Validation Utility
 * Backend Utility Layer
 */

export class Validation {
  public static isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  public static isValidPassword(password: string): boolean {
    return typeof password === 'string' && password.length >= 6;
  }

  public static isValidDial(digit: number): boolean {
    return Number.isInteger(digit) && digit >= 0 && digit <= 9;
  }

  public static isValidChestCode(code: unknown): code is [number, number, number] {
    return Array.isArray(code) && code.length === 3 && code.every(this.isValidDial);
  }
}
