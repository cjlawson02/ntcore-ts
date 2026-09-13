import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import type { RollupOptions } from 'rollup';

const externalNames = ['@modelcontextprotocol/server', '@ntcore-ts/client', 'zod'];

const isExternal = (id: string) =>
  externalNames.some((name) => id === name || id.startsWith(`${name}/`)) || id.startsWith('node:');

const tsOptions = (withDeclarations: boolean) => ({
  tsconfig: './tsconfig.lib.json',
  compilerOptions: {
    declaration: withDeclarations,
    declarationMap: withDeclarations,
    declarationDir: withDeclarations ? 'dist' : undefined,
    outDir: 'dist',
    rootDir: 'src',
    composite: false,
    // Prefer built client types so Rollup doesn't pull client source into this package.
    baseUrl: '.',
    paths: {
      '@ntcore-ts/client': ['../client/dist/index.d.ts'],
    },
    ignoreDeprecations: '6.0',
  },
});

const sharedPlugins = (withDeclarations: boolean) => [
  resolve({ preferBuiltins: true, extensions: ['.mjs', '.js', '.json', '.ts'] }),
  commonjs(),
  typescript(tsOptions(withDeclarations)),
];

const libConfig: RollupOptions = {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    entryFileNames: 'index.esm.js',
    format: 'esm',
    sourcemap: true,
  },
  external: isExternal,
  plugins: sharedPlugins(true),
};

const cliConfig: RollupOptions = {
  input: 'src/cli.ts',
  output: {
    dir: 'dist',
    entryFileNames: 'cli.js',
    format: 'esm',
    sourcemap: true,
    banner: '#!/usr/bin/env node',
  },
  external: isExternal,
  plugins: sharedPlugins(false),
};

export default [libConfig, cliConfig];
