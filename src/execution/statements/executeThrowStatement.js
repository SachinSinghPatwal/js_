import { evaluateExpression } from "../expressions/evaluateExpression.js";

export function executeThrowStatement(node, executionContextStack, heap) {
  const executionContext = executionContextStack.current();

  executionContext.pendingException = evaluateExpression(
    node.argument,
    executionContextStack,
    heap,
  );
}
