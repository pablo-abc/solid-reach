import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import jsxPlugin from '@solid-reach/rollup-plugin-jsx';
import jsx from 'acorn-jsx';

export default [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: 'dist/index.jsx',
        format: 'es',
      },
    ],
    external: ['solid-js', 'solid-js/web', 'solid-js/store'],
    acornInjectPlugins: [jsx()],
    plugins: [
      nodeResolve({
        extensions: ['.js', '.ts', '.tsx'],
      }),
      babel({
        extensions: ['.js', '.ts', '.tsx'],
        babelHelpers: 'bundled',
        presets: ['@babel/preset-typescript'],
        plugins: [
          'babel-plugin-annotate-pure-calls',
          'babel-plugin-dev-expression',
        ],
        exclude: 'node_modules/**',
      }),
      jsxPlugin(),
    ],
  },
  {
    input: 'src/index.tsx',
    output: [
      {
        file: 'dist/index.js',
        format: 'es',
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
        presets: ['solid', '@babel/preset-typescript'],
        plugins: [
          'babel-plugin-annotate-pure-calls',
          'babel-plugin-dev-expression',
        ],
        exclude: 'node_modules/**',
      }),
    ],
  },
];
