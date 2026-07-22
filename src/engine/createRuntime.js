import { createExecutionContext } from "../runtime/createExecutionContext";
import { populateBindings } from "../memory/createRuntimeBindings.js";

export function createRuntime(scopeTree) {
  const globalExecutionContext = createExecutionContext("global", scopeTree);

  populateBindings(
    scopeTree,
    globalExecutionContext.lexicalEnvironment.environmentRecord,
  );

  return globalExecutionContext;
}
