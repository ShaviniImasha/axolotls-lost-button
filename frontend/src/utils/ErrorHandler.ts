export class AppError extends Error {
  constructor(message: string, readonly code = 'APP_ERROR', readonly statusCode = 500) {
    super(message);
    this.name = 'AppError';
  }
}

export class ErrorHandler {
  static log(error: unknown, context?: string): void {
    console.error(context ? `[${context}]` : '[AppError]', error);
  }
}
