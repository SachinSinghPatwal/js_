import { evaluateExpression } from "./expressions/evaluateExpression.js";

export function executeReturnStatement(node, executionContextStack, heap) {
  const executionContext = executionContextStack.current();

  executionContext.returnValue = node.argument
    ? evaluateExpression(node.argument, executionContextStack, heap)
    : undefined;

  executionContext.isReturning = true;
}
