import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type Throughput = {
  mean?: number;
  rme?: number;
};

type Latency = {
  mean?: number;
  p99?: number;
};

type GitHubBench = {
  name: string;
  unit: string;
  value: number;
  extra?: string;
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const tmpDir = path.join(repoRoot, 'tmp');

function runVitestBench(packageDir: string, outputFile: string): void {
  const result = spawnSync('npx', ['vitest', 'bench', '--run', '--reporter=json', `--outputFile=${outputFile}`], {
    cwd: packageDir,
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function collectTasks(node: unknown, prefix: string, out: GitHubBench[]): void {
  if (Array.isArray(node)) {
    for (const item of node) {
      collectTasks(item, prefix, out);
    }
    return;
  }
  if (!isRecord(node)) {
    return;
  }
  const tasks = node.tasks;
  if (Array.isArray(tasks)) {
    for (const task of tasks) {
      if (!isRecord(task) || typeof task.name !== 'string') {
        continue;
      }
      const throughput = isRecord(task.throughput) ? (task.throughput as Throughput) : undefined;
      const hz = throughput?.mean;
      if (typeof hz !== 'number' || !Number.isFinite(hz)) {
        continue;
      }
      const latency = isRecord(task.latency) ? (task.latency as Latency) : undefined;
      const extraParts: string[] = [];
      if (typeof throughput?.rme === 'number' && Number.isFinite(throughput.rme)) {
        extraParts.push(`rme ±${throughput.rme.toFixed(2)}%`);
      }
      if (typeof latency?.mean === 'number') {
        extraParts.push(`mean ${latency.mean.toFixed(4)} ms`);
      }
      if (typeof latency?.p99 === 'number') {
        extraParts.push(`p99 ${latency.p99.toFixed(4)} ms`);
      }
      const entry: GitHubBench = {
        name: `${prefix} · ${task.name}`,
        unit: 'ops/s',
        value: hz,
      };
      if (extraParts.length > 0) {
        entry.extra = extraParts.join('\n');
      }
      out.push(entry);
    }
    return;
  }
  for (const value of Object.values(node)) {
    collectTasks(value, prefix, out);
  }
}

function convertFile(filePath: string, prefix: string): GitHubBench[] {
  const json: unknown = JSON.parse(readFileSync(filePath, 'utf8'));
  const benches: GitHubBench[] = [];
  collectTasks(json, prefix, benches);
  if (benches.length === 0) {
    throw new Error(`no benchmark tasks found in ${filePath}`);
  }
  return benches;
}

mkdirSync(tmpDir, { recursive: true });

const clientJson = path.join(tmpDir, 'client-bench.json');
const reactJson = path.join(tmpDir, 'react-bench.json');
const githubJson = path.join(tmpDir, 'github-bench.json');

if (!process.argv.includes('--convert-only')) {
  runVitestBench(path.join(repoRoot, 'packages/client'), clientJson);
  runVitestBench(path.join(repoRoot, 'packages/react'), reactJson);
}

const results = [...convertFile(clientJson, 'client'), ...convertFile(reactJson, 'react')];

writeFileSync(githubJson, `${JSON.stringify(results, null, 2)}\n`);
process.stdout.write(`wrote ${results.length} benchmarks to ${githubJson}\n`);
