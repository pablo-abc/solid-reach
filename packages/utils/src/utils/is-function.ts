export function isFunction(value: any): value is Function {
  // eslint-disable-next-line eqeqeq
  return !!(value && {}.toString.call(value) == '[object Function]');
}
