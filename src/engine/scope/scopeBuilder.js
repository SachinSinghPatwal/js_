import { createScope } from "./scope";

export function buildScopeTree(ast) {
  const globalScope = createScope("Global");

  return globalScope;
}
