import { createEnvironmentRecord } from "./createEnvironmentRecord";

export function createLexicalEnvironment(scope) {
  return {
    scope,
    outer: null,
    environmentRecord: createEnvironmentRecord(),
  };
}
