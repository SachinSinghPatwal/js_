import { binaryOperators } from "../operators/binaryOperators.js";
import { evaluateExpression } from "./evaluateExpression.js";
import { getHeapValue } from "../../runtime/heap/getHeapValue.js";

export function evaluateBinaryExpression(node, executionContextStack, heap) {
  const left = evaluateExpression(node.left, executionContextStack, heap);

  const right = evaluateExpression(node.right, executionContextStack, heap);

  if (node.operator === "in") {
    if (right === undefined || right === null || typeof right !== "object") {
      return false;
    }

    const object =
      typeof right === "number" ? getHeapValue(heap, right) : right;

    return left in object;
  }

  if (node.operator === "instanceof") {
    if (
      right === undefined ||
      right === null ||
      typeof right !== "object" ||
      !right.prototype
    ) {
      throw new TypeError("Right-hand side of 'instanceof' is not callable");
    }

    const leftValue =
      typeof left === "number" ? getHeapValue(heap, left) : left;

    if (leftValue === null || leftValue === undefined) {
      return false;
    }

    let currentPrototype = leftValue.__proto__ ?? null;

    while (currentPrototype !== null) {
      if (currentPrototype === right.prototype) {
        return true;
      }

      currentPrototype = currentPrototype.__proto__ ?? null;
    }

    return false;
  }

  const operation = binaryOperators[node.operator];

  if (!operation) {
    throw new Error(`Unsupported binary operator: ${node.operator}`);
  }

  return operation(left, right);
}
