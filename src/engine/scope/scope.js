export function createScope(type, parent = null) {
  return {
    type,
    parent,

    variables: new Map(),

    children: [],
  };
}
