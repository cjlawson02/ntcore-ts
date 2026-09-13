import type { Configuration } from 'lint-staged';

const config: Configuration = {
  '*': (files) => [`prettier --write --ignore-unknown ${files.map((f) => JSON.stringify(f)).join(' ')}`],
  '*.{ts,tsx,js,jsx,mjs,cjs,mts,cts}': () => [
    'npx turbo run lint --filter=...[HEAD]',
    'npx turbo run test --filter=...[HEAD]',
    'npx turbo run build --filter=...[HEAD]',
  ],
};

export default config;
