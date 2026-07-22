export function createLexicalEnvironment(scope) {
  return {
    scope,
    outer: null,
    environmentRecord: null,
  };
}
