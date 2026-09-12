import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/e2e/**/*.spec.ts'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    watch: false,
    fileParallelism: false,
  },
});
