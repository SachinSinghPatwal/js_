import { evaluateExpression } from "./evaluateExpression.js";
import { getHeapValue } from "../../runtime/heap/getHeapValue.js";

export function evaluateMemberExpression(node, executionContextStack, heap) {
  const objectAddress = evaluateExpression(
    node.object,
    executionContextStack,
    heap,
  );

  const object = getHeapValue(heap, objectAddress);

  const property = node.computed
    ? evaluateExpression(node.property, executionContextStack, heap)
    : node.property.name;

  return object[property];
}
