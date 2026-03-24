// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    hookTimeout: 20000, // 10 seconds
  },
});
