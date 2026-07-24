import { evaluateExpression } from "./expressions/evaluateExpression.js";
import { resolveIdentifier } from "../runtime/resolveIdentifier.js";
import { setBindingValue } from "../runtime/setBindingValues.js";

export function executeVariableDeclaration(
  variableDeclaration,
  executionContextStack,
) {
  const executionContext = executionContextStack.current();
  for (const declarator of variableDeclaration.declarations) {
    const binding = resolveIdentifier(declarator.id.name, executionContext);

    const value = declarator.init
      ? evaluateExpression(declarator.init, executionContextStack)
      : undefined;

    setBindingValue(binding, value);
  }
}
