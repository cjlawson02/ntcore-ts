import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageJsonPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { version: string };

/** Version from this package's package.json (src/ or dist/). */
export const mcpPackageVersion = packageJson.version;
