import { resolveIdentifier } from "../environment/resolveIdentifier.js";
import { setBindingValue } from "../environment/setBindingValues.js";
import { evaluateExpression } from "../../execution/expressions/evaluateExpression.js";
import { bindDestructuring } from "./bindDestructuring.js";

export function bindParameters(
  functionObject,
  args,
  environmentRecord,
  executionContextStack,
  heap
) {
  const parameters = functionObject.node.params || [];

  parameters.forEach((param, index) => {
    const passedArg = args[index];

    if (param.type === "Identifier") {
      const binding = environmentRecord.bindings.get(param.name);
      if (binding) {
        if (passedArg !== undefined) {
          binding.value = passedArg;
          binding.initialized = true;
        } else {
          binding.value = undefined;
          binding.initialized = true;
        }
      }
    } else if (param.type === "AssignmentPattern") {
      const paramName = param.left.name;
      const binding = environmentRecord.bindings.get(paramName);

      if (binding) {
        if (passedArg !== undefined) {
          binding.value = passedArg;
          binding.initialized = true;
        } else {
          const defaultValue = evaluateExpression(
            param.right,
            executionContextStack,
            heap
          );
          binding.value = defaultValue;
          binding.initialized = true;
        }
      }
    } else if (
      param.type === "ObjectPattern" ||
      param.type === "ArrayPattern"
    ) {
      bindDestructuring(
        param,
        passedArg,
        environmentRecord,
        executionContextStack,
        heap
      );
    }
  });
}
