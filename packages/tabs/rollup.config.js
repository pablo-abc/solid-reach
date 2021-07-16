import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'dist/index.js',
      format: 'es',
    },
  ],
  external: ['solid-js', 'solid-js/web'],
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
};
