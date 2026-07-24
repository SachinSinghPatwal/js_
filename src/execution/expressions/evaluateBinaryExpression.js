import { binaryOperators } from "../operators/binaryOperators.js";
import { evaluateExpression } from "./evaluateExpression.js";

export function evaluateBinaryExpression(node, executionContextStack, heap) {
  const left = evaluateExpression(node.left, executionContextStack, heap);

  const right = evaluateExpression(node.right, executionContextStack, heap);

  const operation = binaryOperators[node.operator];

  if (!operation) {
    throw new Error(`Unsupported binary operator: ${node.operator}`);
  }

  return operation(left, right);
}
