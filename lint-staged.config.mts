import type { Configuration } from 'lint-staged';

const quote = (files: readonly string[]) => files.map((file) => JSON.stringify(file)).join(' ');

const config: Configuration = {
  '*': (files) => [`oxfmt ${quote(files)}`],
  '*.{ts,tsx,js,jsx,mjs,cjs,mts,cts}': (files) => [
    `oxlint --report-unused-disable-directives ${quote(files)}`,
    'npx turbo run test --filter=...[HEAD]',
    'npx turbo run build --filter=...[HEAD]',
  ],
};

export default config;
