import { evaluateExpression } from "./evaluateExpression.js";
import { allocateObject } from "../../runtime/heap/allocateObject.js";
import { callFunction } from "../../runtime/function/callFunction.js";

export function evaluateNewExpression(node, executionContextStack, heap) {
  const constructor = evaluateExpression(
    node.callee,
    executionContextStack,
    heap,
  );

  const instance = {};

  const instanceAddress = allocateObject(heap, instance);

  const args = node.arguments.map((argument) =>
    evaluateExpression(argument, executionContextStack, heap),
  );

  callFunction(constructor, args, executionContextStack, heap, instanceAddress);

  return instanceAddress;
}
