import { binaryOperators } from "../operators/binaryOperators.js";
import { evaluateExpression } from "./evaluateExpression.js";

export function evaluateBinaryExpression(node, executionContext) {
  const left = evaluateExpression(node.left, executionContext);
  const right = evaluateExpression(node.right, executionContext);

  const operation = binaryOperators[node.operator];

  if (!operation) {
    throw new Error(`Unsupported binary operator: ${node.operator}`);
  }

  return operation(left, right);
}
