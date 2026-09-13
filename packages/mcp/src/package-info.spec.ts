import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { mcpPackageVersion } from './package-info.js';

describe('mcpPackageVersion', () => {
  it('matches packages/mcp/package.json', () => {
    const pkgPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json');
    const { version } = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version: string };
    expect(mcpPackageVersion).toBe(version);
  });
});
