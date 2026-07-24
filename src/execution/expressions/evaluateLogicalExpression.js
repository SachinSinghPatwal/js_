import { evaluateExpression } from "./evaluateExpression.js";

export function evaluateLogicalExpression(node, executionContextStack, heap) {
  const left = evaluateExpression(node.left, executionContextStack, heap);

  switch (node.operator) {
    case "&&":
      return left
        ? evaluateExpression(node.right, executionContextStack, heap)
        : left;

    case "||":
      return left
        ? left
        : evaluateExpression(node.right, executionContextStack, heap);

    case "??":
      return left !== null && left !== undefined
        ? left
        : evaluateExpression(node.right, executionContextStack, heap);

    default:
      throw new Error(`Unsupported logical operator: ${node.operator}`);
  }
}
