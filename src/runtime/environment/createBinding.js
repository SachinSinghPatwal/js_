export function createBinding(name, kind) {
  return {
    name,
    kind,
    value: null,
    initialized: false,
  };
}
