import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      // TypeScript overloads are separate `function` declarations of the same name.
      'no-redeclare': 'off',
    },
  },
];
