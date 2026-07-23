import { createEnvironmentRecord } from "./createEnvironmentRecord";

export function createLexicalEnvironment(
  scope,
  outer = null,
  environmentRecord = createEnvironmentRecord(),
) {
  return {
    scope,
    outer,
    environmentRecord,
  };
}
