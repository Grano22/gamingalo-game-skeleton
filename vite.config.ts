import { gamingalo } from '@gamingalo/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Adds every installed Gamingalo plugin package to `virtual:gamingalo-plugins`.
  plugins: [gamingalo()],
  build: {
    target: 'es2022',
    sourcemap: true,
    // Keeps the output within the budgets in gamingalo.json. `gamingalo game:validate` checks them.
    chunkSizeWarningLimit: 500,
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
  },
});
