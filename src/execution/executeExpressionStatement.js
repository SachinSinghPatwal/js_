import { evaluateExpression } from "./expressions/evaluateExpression.js";

export function executeExpressionStatement(node, executionContextStack) {
  evaluateExpression(node.expression, executionContextStack);
}
