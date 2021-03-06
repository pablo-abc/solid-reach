import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const prod = process.env.NODE_ENV === 'production';
const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

export default {
  input: './index.js',
  output: [
    { file: pkg.browser, format: 'umd', sourcemap: prod, name },
    { file: pkg.module, format: 'esm', sourcemap: prod },
  ],
  plugins: [resolve({ browser: true }), commonjs()],
};
