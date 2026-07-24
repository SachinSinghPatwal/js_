import { evaluateExpression } from "./evaluateExpression.js";
import { allocateObject } from "../../runtime/heap/allocateObject.js";
import { callFunction } from "../../runtime/function/callFunction.js";
import { getHeapValue } from "../../runtime/heap/getHeapValue.js";

export function evaluateNewExpression(node, executionContextStack, heap) {
  const constructor = evaluateExpression(
    node.callee,
    executionContextStack,
    heap,
  );

  if (!constructor || typeof constructor !== "object") {
    throw new TypeError("Attempted to construct a non-function value.");
  }

  const prototype = constructor.prototype ?? Object.prototype;
  const instance = { __proto__: prototype };
  const instanceAddress = allocateObject(heap, instance);

  const args = node.arguments.map((argument) =>
    evaluateExpression(argument, executionContextStack, heap),
  );

  const constructorResult = callFunction(
    constructor,
    args,
    executionContextStack,
    heap,
    instanceAddress,
    constructor,
  );

  // Determine the final instance address (constructor may return a different object)
  const finalAddress =
    typeof constructorResult === "number" &&
    heap.get(constructorResult) !== undefined
      ? constructorResult
      : instanceAddress;

  // Apply instance field definitions
  if (constructor.instanceFieldDefinitions) {
    const finalInstance = getHeapValue(heap, finalAddress);

    for (const fieldDef of constructor.instanceFieldDefinitions) {
      const value = fieldDef.valueNode
        ? evaluateExpression(fieldDef.valueNode, executionContextStack, heap)
        : undefined;

      finalInstance[fieldDef.key] = value;
    }
  }

  return finalAddress;
}
