import express, { type Express } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import progressRoutes from './routes/progressRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';

export function createServer(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      game: 'Axolotl’s Lost Button',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/progress', progressRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);

  return app;
}

