export function createScope(type, parent = null) {
  return {
    type,
    parent,

    variables: [],
    functions: [],

    children: [],
  };
}
