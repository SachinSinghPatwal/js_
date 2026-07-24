import { createExecutionContext } from "../runtime/createExecutionContext.js";
import { populateBindings } from "../memory/createRuntimeBindings.js";
import ExecutionContextStack from "../runtime/callStack/ExecutionContextStack.js";
import Heap from "../runtime/heap/heap.js";

export function initializeRuntime(scopeTree) {
  const heap = new Heap();

  const executionContextStack = new ExecutionContextStack();

  const globalExecutionContext = createExecutionContext("global", scopeTree);

  executionContextStack.push(globalExecutionContext);

  populateBindings(
    scopeTree,
    globalExecutionContext.lexicalEnvironment.environmentRecord,
  );

  return {
    executionContextStack,
    globalExecutionContext,
    heap,
  };
}
