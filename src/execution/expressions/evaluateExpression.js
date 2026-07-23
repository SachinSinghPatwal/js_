import { evaluateLiteral } from "./evaluateLiteral.js";
import { evaluateIdentifier } from "./evaluateIdentifier.js";
import { evaluateBinaryExpression } from "./evaluateBinaryExpression.js";
import { evaluateAssignmentExpression } from "./evaluateAssignmentExpression.js";
import { evaluateCallExpression } from "./evaluateCallExpression.js";

export function evaluateExpression(node, executionContext) {
  switch (node.type) {
    case "Literal":
      return evaluateLiteral(node);

    case "Identifier":
      return evaluateIdentifier(node, executionContext);

    case "BinaryExpression":
      return evaluateBinaryExpression(node, executionContext);

    case "AssignmentExpression":
      return evaluateAssignmentExpression(node, executionContext);

    case "CallExpression":
      return evaluateCallExpression(node, executionContext);

    default:
      throw new Error(`Unsupported expression: ${node.type}`);
  }
}
