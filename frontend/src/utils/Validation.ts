export class Validation {
  static validateLogin(value: { email?: string; password?: string }) {
    const errors: Record<string, string> = {};
    if (!value.email?.trim()) errors.email = 'Email is required.';
    if (!value.password) errors.password = 'Password is required.';
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  static validateRegistration(value: { email?: string; password?: string; displayName?: string }) {
    const result = this.validateLogin(value);
    const errors = { ...result.errors };
    if (!value.displayName?.trim()) errors.displayName = 'Display name is required.';
    return { isValid: Object.keys(errors).length === 0, errors };
  }
}
