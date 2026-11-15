/**
 * Central Error Handler
 * Backend Utility Layer
 */

import type { Response } from 'express';

export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode = 500,
    public code = 'INTERNAL_ERROR',
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ErrorHandler {
  public static handle(err: unknown, res: Response): void {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message, code: err.code });
      return;
    }

    console.error('[Backend Error]:', err);
    res.status(500).json({
      error: 'An unexpected ripple occurred in the underwater server.',
      code: 'INTERNAL_ERROR',
    });
  }
}
