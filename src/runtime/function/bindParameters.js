import { resolveIdentifier } from "../resolveIdentifier.js";
import { setBindingValue } from "../setBindingValues.js";
import { evaluateExpression } from "../../execution/expressions/evaluateExpression.js";
import { bindDestructuring } from "./bindDestructuring.js";

export function bindParameters(
  functionObject,
  args,
  lexicalEnvironment,
  executionContextStack,
  heap,
) {
  const params = functionObject.params;

  for (let i = 0; i < params.length; i++) {
    const parameter = params[i];

    if (parameter.type === "AssignmentPattern") {
      const value = args[i] === undefined
        ? evaluateExpression(parameter.right, executionContextStack, heap)
        : args[i];

      // The left side of AssignmentPattern can be a destructuring pattern
      if (
        parameter.left.type === "ObjectPattern" ||
        parameter.left.type === "ArrayPattern"
      ) {
        bindDestructuring(
          parameter.left,
          value,
          lexicalEnvironment,
          executionContextStack,
          heap,
        );

        continue;
      }

      const binding = resolveIdentifier(parameter.left.name, lexicalEnvironment);
      setBindingValue(binding, value);
      continue;
    }

    if (parameter.type === "RestElement") {
      const restArgs = args.slice(i);

      if (
        parameter.argument.type === "ObjectPattern" ||
        parameter.argument.type === "ArrayPattern"
      ) {
        bindDestructuring(
          parameter.argument,
          restArgs,
          lexicalEnvironment,
          executionContextStack,
          heap,
        );

        continue;
      }

      const binding = resolveIdentifier(parameter.argument.name, lexicalEnvironment);
      setBindingValue(binding, restArgs);
      continue;
    }

    // Destructuring patterns as direct parameters: function foo({ a, b }) {}
    if (
      parameter.type === "ObjectPattern" ||
      parameter.type === "ArrayPattern"
    ) {
      bindDestructuring(
        parameter,
        args[i],
        lexicalEnvironment,
        executionContextStack,
        heap,
      );

      continue;
    }

    if (parameter.type !== "Identifier") {
      continue;
    }

    const binding = resolveIdentifier(parameter.name, lexicalEnvironment);
    setBindingValue(binding, args[i]);
  }
}

