import { createExecutionContext } from "../runtime/createExecutionContext";
import { createBindings } from "../memory/createBindings";

export function createRuntime(scopeTree) {
  const globalExecutionContext = createExecutionContext("global", scopeTree);

  createBindings(
    scopeTree,
    globalExecutionContext.lexicalEnvironment.environmentRecord,
  );

  return globalExecutionContext;
}
