import { evaluateExpression } from "./evaluateExpression.js";

export function evaluateUnaryExpression(node, executionContextStack, heap) {
  const argument = evaluateExpression(
    node.argument,
    executionContextStack,
    heap,
  );

  switch (node.operator) {
    case "!":
      return !argument;

    case "+":
      return +argument;

    case "-":
      return -argument;

    case "typeof":
      return typeof argument;

    default:
      throw new Error(`Unsupported unary operator: ${node.operator}`);
  }
}
