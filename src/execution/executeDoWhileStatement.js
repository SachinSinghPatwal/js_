import { executeNode } from "./executeNode.js";
import { evaluateExpression } from "./expressions/evaluateExpression.js";

export function executeDoWhileStatement(node, executionContextStack, heap) {
  do {
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
    }

    if (executionContext.pendingException !== undefined) {
      return;
    }
  } while (evaluateExpression(node.test, executionContextStack, heap));
}
