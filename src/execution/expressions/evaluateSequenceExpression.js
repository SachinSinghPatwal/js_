import { evaluateExpression } from "./evaluateExpression.js";

export function evaluateSequenceExpression(node, executionContextStack, heap) {
  let result;

  for (const expression of node.expressions) {
    result = evaluateExpression(expression, executionContextStack, heap);
  }

  return result;
}
