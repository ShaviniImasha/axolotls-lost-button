import { defineConfig } from 'vitest/config';

export default defineConfig({
  // The frontend is maintained as its own app; keep the root commands pointed
  // at that single source of truth instead of the legacy root src/ copy.
  root: 'frontend',
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  test: {
    root: '../game',
    environment: 'node',
    include: ['tests/**/*.test.ts', 'server/**/*.test.ts'],
  },
});
