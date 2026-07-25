import { evaluateExpression } from "../expressions/evaluateExpression.js";
import { resolveIdentifier } from "../../runtime/environment/resolveIdentifier.js";
import { setBindingValue } from "../../runtime/environment/setBindingValues.js";
import { bindDestructuring } from "../../runtime/function/bindDestructuring.js";

export function executeVariableDeclaration(
  variableDeclaration,
  executionContextStack,
  heap,
) {
  const executionContext = executionContextStack.current();

  for (const declarator of variableDeclaration.declarations) {
    const value = declarator.init
      ? evaluateExpression(declarator.init, executionContextStack, heap)
      : undefined;

    // Destructuring patterns
    if (
      declarator.id.type === "ObjectPattern" ||
      declarator.id.type === "ArrayPattern"
    ) {
      bindDestructuring(
        declarator.id,
        value,
        executionContext.lexicalEnvironment,
        executionContextStack,
        heap,
      );

      continue;
    }

    // Simple identifier
    const binding = resolveIdentifier(
      declarator.id.name,
      executionContext.lexicalEnvironment,
    );

    setBindingValue(binding, value);
  }
}
