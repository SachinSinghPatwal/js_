export function registerDeclaration(scope, name, kind) {
  scope.variables.set(name, {
    kind,
  });
}
