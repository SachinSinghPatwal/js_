import { evaluateExpression } from "./expressions/evaluateExpression.js";

export function executeExpressionStatement(node, executionContextStack, heap) {
  return evaluateExpression(node.expression, executionContextStack, heap);
}
