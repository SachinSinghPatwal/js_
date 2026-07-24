import { evaluateExpression } from "./evaluateExpression.js";
import { callFunction } from "../../runtime/function/callFunction.js";
import { getHeapValue } from "../../runtime/heap/getHeapValue.js";

export function evaluateCallExpression(node, executionContextStack, heap) {
  let fn;

  if (node.callee.type === "MemberExpression") {
    const objectAddress = evaluateExpression(
      node.callee.object,
      executionContextStack,
      heap,
    );

    const object = getHeapValue(heap, objectAddress);

    const property = node.callee.computed
      ? evaluateExpression(node.callee.property, executionContextStack, heap)
      : node.callee.property.name;

    fn = object[property];
  } else {
    fn = evaluateExpression(node.callee, executionContextStack, heap);
  }

  const args = node.arguments.map((argument) =>
    evaluateExpression(argument, executionContextStack, heap),
  );

  return callFunction(fn, args, executionContextStack, heap);
}
