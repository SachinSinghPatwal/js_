import { evaluateExpression } from "./evaluateExpression.js";
import { getHeapValue } from "../../runtime/heap/getHeapValue.js";

export function evaluateMemberAssignmentExpression(
  node,
  executionContextStack,
  heap,
) {
  const objectAddress = evaluateExpression(
    node.left.object,
    executionContextStack,
    heap,
  );

  const object = getHeapValue(heap, objectAddress);

  const property = node.left.computed
    ? evaluateExpression(node.left.property, executionContextStack, heap)
    : node.left.property.name;

  const value = evaluateExpression(node.right, executionContextStack, heap);

  object[property] = value;

  return value;
}
