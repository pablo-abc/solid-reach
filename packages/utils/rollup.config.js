import typescript from 'rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import pkg from './package.json';
import * as fs from 'fs';

const modules = fs
  .readdirSync('./src/utils')
  .map((module) => `./src/utils/${module}`);

const prod = process.env.NODE_ENV === 'production';
const name = 'SolidReachUtils';

export default [
  {
    input: './src/index.ts',
    external: ['solid-js', 'solid-js/web', 'solid-js/store'],
    output: {
      file: pkg.browser,
      format: 'umd',
      sourcemap: prod,
      exports: 'named',
      name,
    },
    plugins: [
      resolve({ browser: true, extensions: ['.js', '.ts', '.tsx'] }),
      commonjs(),
      typescript(),
      babel({
        extensions: ['.js', '.ts', '.tsx'],
        babelHelpers: 'bundled',
        plugins: [
          'babel-plugin-annotate-pure-calls',
          'babel-plugin-dev-expression',
        ],
        exclude: 'node_modules/**',
      }),
    ],
  },
  {
    input: ['./src/index.ts', ...modules],
    external: ['solid-js', 'solid-js/web', 'solid-js/store'],
    output: {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: prod,
      exports: 'named',
    },
    plugins: [
      resolve({ browser: true, extensions: ['.js', '.ts', '.tsx'] }),
      commonjs(),
      typescript(),
      babel({
        extensions: ['.js', '.ts', '.tsx'],
        babelHelpers: 'bundled',
        plugins: [
          'babel-plugin-annotate-pure-calls',
          'babel-plugin-dev-expression',
        ],
        exclude: 'node_modules/**',
      }),
    ],
  },
];
