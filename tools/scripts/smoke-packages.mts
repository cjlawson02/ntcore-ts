/**
 * Install the packed packages into an empty project and import every entry point, to catch
 * runtime-only packaging bugs (missing files, unbundled imports) that publint/attw cannot see.
 *
 * Run after `npm run build`; `npm run check:packages` runs it after the per-package checks.
 */
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const smokeDir = path.join(repoRoot, 'tmp/pack-smoke');

const packages = ['client', 'react', 'mcp'];
// Peers the smoke project needs so the entry points can load.
const smokePeers = ['react', 'react-dom', 'zod'];

function run(cmd: string, args: string[], cwd: string, capture = false): string {
  const result = spawnSync(cmd, args, { cwd, stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit' });
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} failed in ${cwd} (exit ${result.status})`);
  }
  return capture ? result.stdout.toString() : '';
}

rmSync(smokeDir, { recursive: true, force: true });
mkdirSync(smokeDir, { recursive: true });

const packed = packages.map((pkg) => {
  const [result] = JSON.parse(
    run('npm', ['pack', '--json', '--pack-destination', smokeDir], path.join(repoRoot, 'packages', pkg), true)
  ) as { filename: string; name: string }[];
  return result;
});

writeFileSync(
  path.join(smokeDir, 'package.json'),
  JSON.stringify({ name: 'pack-smoke', private: true, type: 'module' })
);
run(
  'npm',
  ['install', '--no-audit', '--no-fund', '--ignore-scripts', ...packed.map((p) => `./${p.filename}`), ...smokePeers],
  smokeDir
);

for (const { name } of packed) {
  run(
    'node',
    [
      '--input-type=module',
      '-e',
      `const m = await import('${name}'); console.log('${name}:', Object.keys(m).length, 'exports');`,
    ],
    smokeDir
  );
}
if (!existsSync(path.join(smokeDir, 'node_modules/.bin/ntcore-ts-mcp'))) {
  throw new Error('@ntcore-ts/mcp bin was not linked');
}
console.log('All packages installed and imported cleanly.');
