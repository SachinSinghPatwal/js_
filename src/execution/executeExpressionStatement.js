import { evaluateExpression } from "./expressions/evaluateExpression.js";

export function executeExpressionStatement(node, executionContext) {
  evaluateExpression(node.expression, executionContext);
}
