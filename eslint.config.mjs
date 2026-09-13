import eslint from '@eslint/js';
import { fixupPluginRules } from '@eslint/compat';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      '**/rollup.config-*.mjs',
      '**/test-output',
      'apps/example-robot/**',
      'coverage/**',
      'docs/**',
      'tmp/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver()],
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-deprecated': 'error',
      'import-x/no-deprecated': 'error',
    },
  },
  {
    files: ['**/*.{mjs,cjs,js,mts,cts}', '**/*.bench.ts', '**/__mocks__/**'],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      '@typescript-eslint/no-deprecated': 'off',
      'import-x/no-deprecated': 'off',
    },
  },
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {
      react: fixupPluginRules(reactPlugin),
      'react-hooks': reactHooks,
    },
    settings: {
      // eslint-plugin-react "detect" still calls removed getFilename() on ESLint 10.
      react: { version: '19.3' },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'no-redeclare': 'off',
    },
  }
);
