export function registerDeclaration(scope, name, kind, node = null) {
  scope.variables.set(name, {
    kind,
    node,
  });
}
