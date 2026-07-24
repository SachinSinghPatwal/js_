import { evaluateExpression } from "./expressions/evaluateExpression.js";
import { executeNode } from "./executeNode.js";

export function executeIfStatement(node, executionContextStack, heap) {
  const condition = evaluateExpression(node.test, executionContextStack, heap);

  if (condition) {
    return executeNode(node.consequent, executionContextStack, heap);
  }

  if (node.alternate) {
    return executeNode(node.alternate, executionContextStack, heap);
  }
}
