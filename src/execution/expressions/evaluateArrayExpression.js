import { evaluateExpression } from "./evaluateExpression.js";
import { allocateArray } from "../../runtime/heap/allocateArray.js";

export function evaluateArrayExpression(node, executionContextStack, heap) {
  const array = node.elements.map((element) =>
    evaluateExpression(element, executionContextStack, heap),
  );

  return allocateArray(heap, array);
}
