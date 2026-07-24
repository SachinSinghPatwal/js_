import { evaluateExpression } from "./evaluateExpression.js";
import { getHeapValue } from "../../runtime/heap/getHeapValue.js";
import { ShortCircuitError } from "./ShortCircuitError.js";

export function evaluateMemberExpression(node, executionContextStack, heap) {
  // --- super.prop — parent prototype property access ---
  if (node.object.type === "Super") {
    const executionContext = executionContextStack.current();
    const homeObject = executionContext.homeObject;

    if (!homeObject) {
      throw new ReferenceError("'super' keyword unexpected here");
    }

    const parentPrototype = homeObject.__proto__;
    if (!parentPrototype) {
      return undefined;
    }

    const property = node.computed
      ? evaluateExpression(node.property, executionContextStack, heap)
      : node.property.name;

    // Walk the parent prototype chain
    let current = parentPrototype;

    while (current !== null && current !== undefined) {
      if (Object.prototype.hasOwnProperty.call(current, property)) {
        return current[property];
      }

      current =
        typeof current.__proto__ === "number"
          ? getHeapValue(heap, current.__proto__)
          : current.__proto__ ?? null;
    }

    return undefined;
  }

  const objectAddress = evaluateExpression(
    node.object,
    executionContextStack,
    heap,
  );

  const object =
    typeof objectAddress === "number"
      ? getHeapValue(heap, objectAddress)
      : objectAddress;

  if (node.optional && (object === null || object === undefined)) {
    throw new ShortCircuitError();
  }

  const property = node.computed
    ? evaluateExpression(node.property, executionContextStack, heap)
    : node.property.name;

  let current = object;

  while (current !== null && current !== undefined) {
    if (Object.prototype.hasOwnProperty.call(current, property)) {
      return current[property];
    }

    current =
      typeof current.__proto__ === "number"
        ? getHeapValue(heap, current.__proto__)
        : current.__proto__ ?? null;
  }

  return undefined;
}

