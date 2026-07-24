import { evaluateLiteral } from "./evaluateLiteral.js";
import { evaluateIdentifier } from "./evaluateIdentifier.js";
import { evaluateBinaryExpression } from "./evaluateBinaryExpression.js";
import { evaluateAssignmentExpression } from "./evaluateAssignmentExpression.js";
import { evaluateCallExpression } from "./evaluateCallExpression.js";

export function evaluateExpression(node, executionContextStack) {
  switch (node.type) {
    case "Literal":
      return evaluateLiteral(node);

    case "Identifier":
      return evaluateIdentifier(node, executionContextStack);

    case "BinaryExpression":
      return evaluateBinaryExpression(node, executionContextStack);

    case "AssignmentExpression":
      return evaluateAssignmentExpression(node, executionContextStack);

    case "CallExpression":
      return evaluateCallExpression(node, executionContextStack);

    default:
      throw new Error(`Unsupported expression: ${node.type}`);
  }
}
