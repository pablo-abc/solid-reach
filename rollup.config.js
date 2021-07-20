import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import jsxPlugin from '@solid-reach/rollup-plugin-jsx';
import jsx from 'acorn-jsx';
import execute from 'rollup-plugin-execute';
import * as fs from 'fs';

const modules = fs.readdirSync('./src').map((module) => `src/${module}`);

function entryFileNames(chunkInfo) {
  if (chunkInfo.facadeModuleId?.includes('.tsx')) return '[name].jsx';
  return '[name].js';
}

function chunkFileNames(chunkInfo) {
  const mods = Object.keys(chunkInfo.modules);
  if (mods.some((mod) => mod?.includes('.tsx') || mods?.includes('.jsx')))
    return '[name]-[hash].jsx';
  return '[name]-[hash].js';
}

export default [
  {
    input: modules,
    output: [
      {
        dir: 'dist/solid',
        format: 'es',
        hoistTransitiveImports: false,
        entryFileNames,
        chunkFileNames,
      },
    ],
    external: ['solid-js', 'solid-js/web', 'solid-js/store'],
    acornInjectPlugins: [jsx()],
    plugins: [
      nodeResolve({
        extensions: ['.js', '.ts', '.tsx'],
      }),
      execute('tsc --emitDeclarationOnly'),
      babel({
        extensions: ['.js', '.ts', '.tsx'],
        babelHelpers: 'bundled',
        presets: ['@babel/preset-typescript', '@babel/preset-env'],
        plugins: [
          '@babel/plugin-syntax-jsx',
          'babel-plugin-annotate-pure-calls',
          'babel-plugin-dev-expression',
        ],
        exclude: 'node_modules/**',
      }),
      jsxPlugin(),
    ],
  },
  {
    input: modules,
    output: [
      {
        dir: 'dist/js',
        format: 'es',
        hoistTransitiveImports: false,
      },
    ],
    external: ['solid-js', 'solid-js/web', 'solid-js/store'],
    plugins: [
      nodeResolve({
        extensions: ['.js', '.ts', '.tsx'],
      }),
      babel({
        extensions: ['.js', '.ts', '.tsx'],
        babelHelpers: 'bundled',
        presets: ['solid', '@babel/preset-typescript', '@babel/preset-env'],
        plugins: [
          'babel-plugin-annotate-pure-calls',
          'babel-plugin-dev-expression',
        ],
        exclude: 'node_modules/**',
      }),
    ],
  },
];
