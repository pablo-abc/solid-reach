import typescript from 'rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
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
      replace({
        'process.env.NODE_ENV': JSON.stringify(
          prod ? 'production' : 'development'
        ),
        preventAssignment: true,
      }),
      resolve({ browser: true }),
      commonjs(),
      typescript(),
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
      replace({
        'process.env.NODE_ENV': JSON.stringify(
          prod ? 'production' : 'development'
        ),
        preventAssignment: true,
      }),
      resolve({ browser: true }),
      commonjs(),
      typescript({
        declarationDir: './dist/esm',
      }),
    ],
  },
];
