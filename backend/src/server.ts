/**
 * Backend Server Entry Point
 */

import { createApp } from './app';
import { ENV } from './config/environment';

const app = createApp();

if (process.env.NODE_ENV !== 'test') {
  app.listen(ENV.PORT, () => {
    console.log(`Axolotl Backend MVC running at http://localhost:${ENV.PORT}`);
  });
}

export { app };
