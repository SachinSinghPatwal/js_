export function registerDeclaration(
  scope,
  name,
  kind,
  node = null,
  functionScope = null,
) {
  scope.variables.set(name, {
    kind,
    node,
    functionScope,
  });
}
