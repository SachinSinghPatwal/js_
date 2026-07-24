import { evaluateExpression } from "./evaluateExpression.js";

export function evaluateConditionalExpression(
  node,
  executionContextStack,
  heap,
) {
  const condition = evaluateExpression(node.test, executionContextStack, heap);

  if (condition) {
    return evaluateExpression(node.consequent, executionContextStack, heap);
  }

  return evaluateExpression(node.alternate, executionContextStack, heap);
}
