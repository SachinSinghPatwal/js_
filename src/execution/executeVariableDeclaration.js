import { evaluateExpression } from "./expressions/evaluateExpression.js";
import { resolveIdentifier } from "../runtime/resolveIdentifier.js";
import { setBindingValue } from "../runtime/setBindingValues.js";

export function executeVariableDeclaration(
  variableDeclaration,
  executionContextStack,
  heap,
) {
  const executionContext = executionContextStack.current();

  for (const declarator of variableDeclaration.declarations) {
    const binding = resolveIdentifier(
      declarator.id.name,
      executionContext.lexicalEnvironment,
    );

    const value = declarator.init
      ? evaluateExpression(declarator.init, executionContextStack, heap)
      : undefined;

    setBindingValue(binding, value);
  }
}
