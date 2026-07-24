import { evaluateLiteral } from "./evaluateLiteral.js";
import { evaluateIdentifier } from "./evaluateIdentifier.js";
import { evaluateBinaryExpression } from "./evaluateBinaryExpression.js";
import { evaluateAssignmentExpression } from "./evaluateAssignmentExpression.js";
import { evaluateCallExpression } from "./evaluateCallExpression.js";
import { evaluateObjectExpression } from "./evaluateObjectExpression.js";
import { evaluateMemberExpression } from "./evaluateMemberExpression.js";
import { evaluateArrayExpression } from "./evaluateArrayExpression.js";
import { evaluateFunctionExpression } from "./evaluateFunctionExpression.js";

export function evaluateExpression(node, executionContextStack, heap) {
  switch (node.type) {
    case "Literal":
      return evaluateLiteral(node);

    case "Identifier":
      return evaluateIdentifier(node, executionContextStack);

    case "BinaryExpression":
      return evaluateBinaryExpression(node, executionContextStack, heap);

    case "AssignmentExpression":
      return evaluateAssignmentExpression(node, executionContextStack, heap);

    case "CallExpression":
      return evaluateCallExpression(node, executionContextStack, heap);

    case "ObjectExpression":
      return evaluateObjectExpression(node, executionContextStack, heap);

    case "MemberExpression":
      return evaluateMemberExpression(node, executionContextStack, heap);

    case "ArrayExpression":
      return evaluateArrayExpression(node, executionContextStack, heap);

    case "FunctionExpression":
      return evaluateFunctionExpression(node, executionContextStack);

    default:
      throw new Error(`Unsupported expression: ${node.type}`);
  }
}
