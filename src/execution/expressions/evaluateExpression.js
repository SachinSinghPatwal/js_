import { evaluateLiteral } from "./evaluateLiteral.js";
import { evaluateIdentifier } from "./evaluateIdentifier.js";
import { evaluateBinaryExpression } from "./evaluateBinaryExpression.js";
import { evaluateAssignmentExpression } from "./evaluateAssignmentExpression.js";
import { evaluateCallExpression } from "./evaluateCallExpression.js";
import { evaluateObjectExpression } from "./evaluateObjectExpression.js";
import { evaluateMemberExpression } from "./evaluateMemberExpression.js";
import { evaluateArrayExpression } from "./evaluateArrayExpression.js";
import { evaluateFunctionExpression } from "./evaluateFunctionExpression.js";
import { evaluateUnaryExpression } from "./evaluateUnaryExpression.js";
import { evaluateUpdateExpression } from "./evaluateUpdateExpression.js";
import { evaluateLogicalExpression } from "./evaluateLogicalExpression.js";
import { evaluateConditionalExpression } from "./evaluateConditionalExpression.js";

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

    case "UnaryExpression":
      return evaluateUnaryExpression(node, executionContextStack, heap);

    case "UpdateExpression":
      return evaluateUpdateExpression(node, executionContextStack);

    case "LogicalExpression":
      return evaluateLogicalExpression(node, executionContextStack, heap);

    case "ConditionalExpression":
      return evaluateConditionalExpression(node, executionContextStack, heap);

    default:
      throw new Error(`Unsupported expression: ${node.type}`);
  }
}
