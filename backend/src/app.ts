/**
 * Express Application Setup
 * Backend Application Root
 */

import express, { type Express } from 'express';
import cors from 'cors';
import { ENV } from './config/environment';
import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import scoreRoutes from './routes/scoreRoutes';
import levelRoutes from './routes/levelRoutes';
import puzzleRoutes from './routes/puzzleRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import profileRoutes from './routes/profileRoutes';
import progressRoutes from './routes/progressRoutes';

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
  app.use(express.json());

  // Health probe
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Axolotl’s Lost Button Backend (MVC)',
      timestamp: new Date().toISOString(),
    });
  });

  // Register MVC Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/game', gameRoutes);
  app.use('/api/scores', scoreRoutes);
  app.use('/api/levels', levelRoutes);
  app.use('/api/puzzles', puzzleRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/progress', progressRoutes);

  return app;
}

export default createApp;
