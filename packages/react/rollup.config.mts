import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import type { RollupOptions } from 'rollup';

const externalNames = ['react', 'react-dom', 'react/jsx-runtime', '@ntcore-ts/client', 'zod'];

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
    resolve({ preferBuiltins: true, extensions: ['.mjs', '.js', '.json', '.ts', '.tsx'] }),
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
        jsx: 'react-jsx',
        // Prefer built client types so Rollup doesn't pull client source into this package.
        baseUrl: '.',
        paths: {
          '@ntcore-ts/client': ['../client/dist/index.d.ts'],
        },
        ignoreDeprecations: '6.0',
      },
    }),
  ],
};

export default config;
