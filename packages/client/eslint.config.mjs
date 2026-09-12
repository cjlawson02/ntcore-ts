import baseConfig from '../../eslint.config.mjs';
import vitest from '@vitest/eslint-plugin';

export default [
  ...baseConfig,
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
];
