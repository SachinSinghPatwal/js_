import { allocateObject } from "../../runtime/heap/allocateObject.js";
import { evaluateExpression } from "./evaluateExpression.js";
import { createFunctionObject } from "../../runtime/function/createFunctionObject.js";

export function evaluateObjectExpression(node, executionContextStack, heap) {
  const executionContext = executionContextStack.current();

  const object = {};

  for (const property of node.properties) {
    const key = property.computed
      ? evaluateExpression(property.key, executionContextStack, heap)
      : property.key.name;

    if (property.method) {
      object[key] = createFunctionObject(
        property.value,
        executionContext.lexicalEnvironment,
      );

      continue;
    }

    object[key] = evaluateExpression(
      property.value,
      executionContextStack,
      heap,
    );
  }

  return allocateObject(heap, object);
}
