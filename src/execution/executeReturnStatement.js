import { evaluateExpression } from "./expressions/evaluateExpression.js";

export function executeReturnStatement(node, executionContextStack) {
  const executionContext = executionContextStack.current();

  executionContext.returnValue = node.argument
    ? evaluateExpression(node.argument, executionContextStack)
    : undefined;

  executionContext.isReturning = true;
}
