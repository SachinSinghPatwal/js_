import { executeNode } from "../executeNode.js";

export function executeBlockStatement(
  blockStatement,
  executionContextStack,
  heap,
) {
  for (const statement of blockStatement.body) {
    executeNode(statement, executionContextStack, heap);

    const executionContext = executionContextStack.current();

    if (executionContext.isReturning) {
      return;
    }

    if (executionContext.isBreaking) {
      return;
    }

    if (executionContext.isContinuing) {
      return;
    }

    if (executionContext.pendingException !== undefined) {
      return;
    }
  }
}
