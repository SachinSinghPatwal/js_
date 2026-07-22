export function createBinding(name, kind) {
  return {
    name,
    kind,
    value: undefined,
    initialized: false,
  };
}
