import { executeNode } from "./executeNode.js";
import { createEnvironmentRecord } from "../runtime/createEnvironmentRecord.js";

export function executeTryStatement(node, executionContextStack, heap) {
  const executionContext = executionContextStack.current();

  executeNode(node.block, executionContextStack, heap);

  if (executionContext.pendingException !== undefined && node.handler) {
    const exception = executionContext.pendingException;

    executionContext.pendingException = undefined;

    const previousEnvironment = executionContext.lexicalEnvironment;

    const catchEnvironment = {
      scope: previousEnvironment.scope,
      outer: previousEnvironment,
      environmentRecord: createEnvironmentRecord(),
    };

    executionContext.lexicalEnvironment = catchEnvironment;

    if (node.handler.param) {
      catchEnvironment.environmentRecord.bindings.set(node.handler.param.name, {
        kind: "let",
        value: exception,
        initialized: true,
      });
    }

    executeNode(node.handler.body, executionContextStack, heap);

    executionContext.lexicalEnvironment = previousEnvironment;
  }

  if (node.finalizer) {
    executeNode(node.finalizer, executionContextStack, heap);
  }
}
