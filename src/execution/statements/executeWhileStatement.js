import { evaluateExpression } from "../expressions/evaluateExpression.js";
import { executeNode } from "../executeNode.js";

export function executeWhileStatement(node, executionContextStack, heap) {
  while (evaluateExpression(node.test, executionContextStack, heap)) {
    executeNode(node.body, executionContextStack, heap);

    const executionContext = executionContextStack.current();

    if (executionContext.isReturning) {
      return;
    }

    if (executionContext.isBreaking) {
      executionContext.isBreaking = false;
      return;
    }

    if (executionContext.isContinuing) {
      executionContext.isContinuing = false;
      continue;
    }

    if (executionContext.pendingException !== undefined) {
      return;
    }
  }
}
