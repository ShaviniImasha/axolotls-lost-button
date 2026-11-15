export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, code: string = 'APP_ERROR', statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ErrorHandler {
  /**
   * Log error details with contextual information
   */
  public static log(error: unknown, context?: string): void {
    const prefix = context ? `[${context}]` : '[Error]';
    if (error instanceof AppError) {
      console.error(`${prefix} (${error.code}) ${error.message}`);
    } else if (error instanceof Error) {
      console.error(`${prefix} ${error.name}: ${error.message}`, error.stack);
    } else {
      console.error(`${prefix} Unknown error:`, error);
    }
  }

  /**
   * Translate errors into friendly player-facing messages
   */
  public static toPlayerMessage(error: unknown): string {
    if (error instanceof AppError) {
      return error.message;
    }

    if (error && typeof error === 'object' && 'code' in error) {
      const fbCode = (error as { code: string }).code;
      switch (fbCode) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return 'Pip couldn’t find an account with those credentials. Please check and try again.';
        case 'auth/email-already-in-use':
          return 'That email is already registered! Please log in instead.';
        case 'auth/weak-password':
          return 'Password is too short. Use at least 6 characters.';
        case 'auth/network-request-failed':
          return 'Network ripple detected! Please check your internet connection.';
        case 'auth/popup-closed-by-user':
          return 'Sign-in window was closed. Try clicking the sign-in button again!';
        default:
          return (error as { message?: string }).message || 'Something went wonky in the pond. Please try again.';
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected ripple occurred in the pond. Please refresh and try again!';
  }
}
