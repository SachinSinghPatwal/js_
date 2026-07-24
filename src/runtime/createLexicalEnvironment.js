import { createEnvironmentRecord } from "./createEnvironmentRecord.js";

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
