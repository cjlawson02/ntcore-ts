import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import type { Plugin, RollupOptions } from 'rollup';

const require = createRequire(import.meta.url);

const VIRTUAL_DESCRIPTOR_ID = '\0protobuf-descriptor-json';

/**
 * Load protobuf descriptor.json via fs so Rollup bundles it (avoids parse issues
 * with @rollup/plugin-json on this large file from node_modules).
 */
function protobufDescriptorJson(): Plugin {
  return {
    name: 'protobuf-descriptor-json',
    resolveId(id) {
      if (id === 'protobufjs/google/protobuf/descriptor.json') return VIRTUAL_DESCRIPTOR_ID;
      return null;
    },
    load(id) {
      if (id !== VIRTUAL_DESCRIPTOR_ID) return null;
      try {
        const descriptorPath = require.resolve('protobufjs/google/protobuf/descriptor.json');
        const data = JSON.parse(readFileSync(descriptorPath, 'utf8'));
        return `export default ${JSON.stringify(data)};`;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.error(`Failed to load protobuf descriptor.json: ${msg}`);
      }
    },
  };
}

const externalNames = ['@msgpack/msgpack', 'isomorphic-ws', 'protobufjs', 'tslog', 'zod'];

const config: RollupOptions = {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    entryFileNames: 'index.esm.js',
    format: 'esm',
    sourcemap: true,
  },
  external: (id) => externalNames.some((name) => id === name || id.startsWith(`${name}/`)),
  plugins: [
    protobufDescriptorJson(),
    resolve({ preferBuiltins: true, extensions: ['.mjs', '.js', '.json', '.ts'] }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.lib.json',
      compilerOptions: {
        declaration: true,
        declarationMap: true,
        declarationDir: 'dist',
        outDir: 'dist',
        rootDir: 'src',
        composite: false,
      },
    }),
  ],
};

export default config;
