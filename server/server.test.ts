import { describe, expect, it } from 'vitest';
import { createServer } from './server';
import { authMiddleware, type AuthenticatedRequest } from './middleware/authMiddleware';
import { isValidProgressPayload } from './routes/progressRoutes';

describe('Express Backend Server & Middleware', () => {
  it('creates an Express server instance with registered routes', () => {
    const app = createServer();
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe('function');
  });

  it('rejects requests missing an Authorization header', async () => {
    const req = {
      headers: {},
    } as AuthenticatedRequest;

    let statusCode: number | null = null;
    let jsonResponse: any = null;
    let nextCalled = false;

    const res: any = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: any) => {
        jsonResponse = data;
        return res;
      },
    };

    const next = () => {
      nextCalled = true;
    };

    await authMiddleware(req, res, next);

    expect(statusCode).toBe(401);
    expect(jsonResponse.error).toContain('Authorization');
    expect(nextCalled).toBe(false);
  });

  it('authenticates requests with a valid Bearer token', async () => {
    const req = {
      headers: {
        authorization: 'Bearer player_test_token_12345',
      },
    } as AuthenticatedRequest;

    let statusCode: number | null = null;
    let nextCalled = false;

    const res: any = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: () => res,
    };

    const next = () => {
      nextCalled = true;
    };

    await authMiddleware(req, res, next);

    expect(statusCode).toBeNull();
    expect(nextCalled).toBe(true);
    expect(req.user).toBeDefined();
    expect(req.user?.uid).toBeDefined();
  });

  it('rejects invalid level IDs and scores in progress writes', () => {
    expect(isValidProgressPayload({
      currentLevel: 'pond-easy',
      completedLevels: ['pond-easy'],
      totalScore: 100,
      levelProgress: { 'pond-easy': { bestScore: 100 } },
    })).toBe(true);
    expect(isValidProgressPayload({ currentLevel: 'pond-super-hard' })).toBe(false);
    expect(isValidProgressPayload({ totalScore: Number.POSITIVE_INFINITY })).toBe(false);
    expect(isValidProgressPayload({ levelProgress: { 'pond-easy': { bestScore: -1 } } })).toBe(false);
  });
});
