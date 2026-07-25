import { allocateObject } from "../../runtime/heap/allocateObject.js";
import { evaluateExpression } from "./evaluateExpression.js";
import { FunctionObject } from "../../runtime/FunctionObject.js";
import { callFunction } from "../../runtime/function/callFunction.js";

export function evaluateObjectExpression(node, executionContextStack, heap) {
  const executionContext = executionContextStack.current();

  const object = {};
  const descriptors = {};

  for (const property of node.properties) {
    // SpreadElement in object literal is not parsed as Property, but wait, 
    // Acorn parses spread as `type: "SpreadElement"`. If the code handles it, it would be here.
    // Currently, it assumes all are Property. We will assume Property for now as spread is handled separately if implemented.

    const key = property.computed
      ? evaluateExpression(property.key, executionContextStack, heap)
      : property.key.type === "Identifier"
        ? property.key.name
        : property.key.value;

    if (property.kind === "get" || property.kind === "set") {
      if (!descriptors[key]) {
        descriptors[key] = { enumerable: true, configurable: true };
      }

      const fn = new FunctionObject(
        property.value,
        executionContext.lexicalEnvironment,
      );

      descriptors[key][property.kind] = function (...args) {
        // Reverse-lookup the simulated address of this host object
        const thisAddress = Array.from(heap.memory.entries()).find(
          (entry) => entry[1] === this,
        )?.[0];

        return callFunction(fn, args, executionContextStack, heap, thisAddress);
      };

      continue;
    }

    if (property.method) {
      object[key] = new FunctionObject(
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

  Object.defineProperties(object, descriptors);

  return allocateObject(heap, object);
}

