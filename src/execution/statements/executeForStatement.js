import { executeNode } from "../executeNode.js";
import { evaluateExpression } from "../expressions/evaluateExpression.js";

export function executeForStatement(node, executionContextStack, heap) {
  if (node.init) {
    if (node.init.type === "VariableDeclaration") {
      executeNode(node.init, executionContextStack, heap);
    } else {
      evaluateExpression(node.init, executionContextStack, heap);
    }
  }

  while (
    node.test
      ? evaluateExpression(node.test, executionContextStack, heap)
      : true
  ) {
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

    if (node.update) {
      evaluateExpression(node.update, executionContextStack, heap);
    }
  }
}
