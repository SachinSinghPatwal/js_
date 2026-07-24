import { evaluateExpression } from "./evaluateExpression.js";
import { getHeapValue } from "../../runtime/heap/getHeapValue.js";

export function evaluateUnaryExpression(node, executionContextStack, heap) {
  switch (node.operator) {
    case "delete": {
      if (node.argument.type === "Identifier") {
        return false;
      }

      if (node.argument.type !== "MemberExpression") {
        return false;
      }

      const objectAddress = evaluateExpression(
        node.argument.object,
        executionContextStack,
        heap,
      );

      const object = getHeapValue(heap, objectAddress);
      const property = node.argument.computed
        ? evaluateExpression(node.argument.property, executionContextStack, heap)
        : node.argument.property.name;

      let current = object;

      while (current !== null && current !== undefined) {
        if (Object.prototype.hasOwnProperty.call(current, property)) {
          delete current[property];
          return true;
        }

        current = current.__proto__ ?? null;
      }

      return true;
    }

    default: {
      let argument;

      if (node.operator === "typeof" && node.argument.type === "Identifier") {
        const executionContext = executionContextStack.current();
        let current = executionContext.lexicalEnvironment;
        let binding = undefined;

        while (current !== null) {
          binding = current.environmentRecord.bindings.get(node.argument.name);
          if (binding) break;
          current = current.outer;
        }

        if (!binding) {
          return "undefined";
        }
      }

      argument = evaluateExpression(
        node.argument,
        executionContextStack,
        heap,
      );

      switch (node.operator) {
        case "!":
          return !argument;

        case "+":
          return +argument;

        case "-":
          return -argument;

        case "typeof":
          return typeof argument;

        case "void":
          return undefined;

        case "~":
          return ~argument;

        default:
          throw new Error(`Unsupported unary operator: ${node.operator}`);
      }
    }
  }
}
