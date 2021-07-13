let id = 0;

export function createId(propsId?: string | number) {
  if (propsId) return String(propsId);
  return String(id++);
}
