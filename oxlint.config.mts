import { defineConfig } from 'oxlint';

export default defineConfig({
  // Setting `plugins` replaces Oxlint's defaults, so the default set is listed
  // explicitly. `react` includes react-hooks. `import/no-deprecated` is not ported.
  plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'react', 'import', 'vitest'],
  categories: {
    correctness: 'error',
  },
  options: {
    typeAware: true,
  },
  settings: {
    react: {
      version: '19.3',
    },
  },
  rules: {
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'typescript/no-deprecated': 'error',
    'vitest/no-standalone-expect': [
      'error',
      { additionalTestBlockFunctions: ['beforeAll', 'afterAll', 'beforeEach', 'afterEach'] },
    ],
    // These Vitest correctness rules would rewrite existing tests without changing behavior.
    'vitest/require-mock-type-parameters': 'off',
    'vitest/require-to-throw-message': 'off',
  },
  ignorePatterns: [
    '**/dist',
    '**/coverage',
    '**/vite.config.*.timestamp*',
    '**/vitest.config.*.timestamp*',
    '**/rollup.config-*.mjs',
    '**/test-output',
    'apps/example-robot',
    'docs',
    'tmp',
    '**/src/generated',
    'apps/docs/api',
    'apps/docs/.vitepress',
    '.turbo',
    'package-lock.json',
    'notes',
    '.nx',
  ],
  overrides: [
    {
      files: ['**/*.{mjs,cjs,js,mts,cts}', '**/*.bench.ts', '**/*.bench.tsx', '**/__mocks__/**'],
      rules: {
        'typescript/no-deprecated': 'off',
      },
    },
    {
      files: ['**/*.bench.ts', '**/*.bench.tsx'],
      rules: {
        'vitest/expect-expect': 'off',
      },
    },
    {
      files: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.tsx', '**/*.test.tsx'],
      rules: {
        'no-empty-function': 'off',
      },
    },
  ],
});
