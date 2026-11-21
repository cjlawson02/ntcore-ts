/// <reference types="vitest" />
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import codspeedPlugin from '@codspeed/vitest-plugin';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/client',
  plugins: [codspeedPlugin()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    name: 'client',
    watch: false,
    globals: true,
    environment: 'jsdom',
    // WSMock.clean() is process-global; parallel files race and leave reconnect timers that hang Vitest.
    fileParallelism: false,
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/*.{bench,benchmark}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/client',
      provider: 'v8' as const,
      include: ['src/**/*.{ts,tsx}'],
    },
  },
  benchmark: {
    include: ['src/**/*.{bench,benchmark}.{ts,mts,cts}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },
}));
