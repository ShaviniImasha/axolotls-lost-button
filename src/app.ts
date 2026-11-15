/**
 * Express Application Configuration
 * Model-View-Controller (MVC) - Application Root
 */

import express, { type Express } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import scoreRoutes from './routes/scoreRoutes';
import levelRoutes from './routes/levelRoutes';
import puzzleRoutes from './routes/puzzleRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import profileRoutes from './routes/profileRoutes';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health probe
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      game: 'Axolotl’s Lost Button (MVC)',
      timestamp: new Date().toISOString(),
    });
  });

  // MVC Route Registry
  app.use('/api/auth', authRoutes);
  app.use('/api/game', gameRoutes);
  app.use('/api/scores', scoreRoutes);
  app.use('/api/levels', levelRoutes);
  app.use('/api/puzzles', puzzleRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);
  app.use('/api/profile', profileRoutes);

  return app;
}

export default createApp;
