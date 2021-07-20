export function isFunction(value: any): value is Function {
  // eslint-disable-next-line eqeqeq
  return typeof value === 'function';
}
