/**
 * Validation Utility
 * Model-View-Controller (MVC) - Utility Layer
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class Validation {
  /**
   * Validate email format
   */
  public static isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validate password strength (minimum 6 characters)
   */
  public static isValidPassword(password: string): boolean {
    return typeof password === 'string' && password.length >= 6;
  }

  /**
   * Validate user registration fields
   */
  public static validateRegistration(data: { email?: string; password?: string; displayName?: string }): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!data.password || !this.isValidPassword(data.password)) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (data.displayName && data.displayName.trim().length > 30) {
      errors.displayName = 'Display name must be 30 characters or less.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate login credentials
   */
  public static validateLogin(data: { email?: string; password?: string }): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!data.password || data.password.length === 0) {
      errors.password = 'Password is required.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate chest dial index and digit
   */
  public static isValidDialDigit(digit: number): boolean {
    return Number.isInteger(digit) && digit >= 0 && digit <= 9;
  }

  /**
   * Validate chest dial code array [d0, d1, d2]
   */
  public static isValidChestCode(code: unknown): code is [number, number, number] {
    if (!Array.isArray(code) || code.length !== 3) return false;
    return code.every(this.isValidDialDigit);
  }

  /**
   * Sanitize text against HTML injection
   */
  public static sanitizeString(input: string): string {
    if (!input) return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
