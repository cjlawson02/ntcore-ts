/**
 * Validate the publishable packages as npm will see them: pack each built package,
 * lint the tarball (publint + attw), then install the tarballs into an empty project
 * and import every entry point. Tarballs are left in tmp/packs for the publish jobs.
 *
 * Run after `npm run build`.
 */
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const packsDir = path.join(repoRoot, 'tmp/packs');
const smokeDir = path.join(repoRoot, 'tmp/pack-smoke');

const packages = ['client', 'react', 'mcp'];
// Peers the smoke project needs so the entry points can load.
const smokePeers = ['react', 'react-dom', 'zod'];

type PackResult = { filename: string; name: string; version: string; entryCount: number };

function run(cmd: string, args: string[], cwd: string, capture = false): string {
  const result = spawnSync(cmd, args, { cwd, stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit' });
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} failed in ${cwd} (exit ${result.status})`);
  }
  return capture ? result.stdout.toString() : '';
}

rmSync(packsDir, { recursive: true, force: true });
rmSync(smokeDir, { recursive: true, force: true });
mkdirSync(packsDir, { recursive: true });
mkdirSync(smokeDir, { recursive: true });

const packed: PackResult[] = [];
for (const pkg of packages) {
  const packageDir = path.join(repoRoot, 'packages', pkg);
  const [result] = JSON.parse(
    run('npm', ['pack', '--json', '--pack-destination', packsDir], packageDir, true)
  ) as PackResult[];
  console.log(`packed ${result.name}@${result.version}: ${result.entryCount} files`);
  if (result.entryCount <= 2) {
    throw new Error(`${result.name} tarball only has ${result.entryCount} files; was it built?`);
  }

  const tarball = path.join(packsDir, result.filename);
  run('npx', ['publint', 'run', tarball, '--strict'], repoRoot);
  run('npx', ['attw', tarball, '--profile', 'esm-only'], repoRoot);
  packed.push(result);
}

writeFileSync(
  path.join(smokeDir, 'package.json'),
  JSON.stringify({ name: 'pack-smoke', private: true, type: 'module' })
);
run(
  'npm',
  [
    'install',
    '--no-audit',
    '--no-fund',
    '--ignore-scripts',
    ...packed.map((p) => path.join(packsDir, p.filename)),
    ...smokePeers,
  ],
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
console.log('All packages passed pack checks.');
