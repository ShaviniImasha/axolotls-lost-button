/**
 * MVC Server Entry Point
 */

import { createApp } from './app';

const PORT = process.env.PORT || 3001;
const app = createApp();

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Axolotl MVC Server running at http://localhost:${PORT}`);
  });
}

export { app };
