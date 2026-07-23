import { evaluateExpression } from "./expressions/evaluateExpression.js";
import { resolveIdentifier } from "../runtime/resolveIdentifier.js";
import { setBindingValue } from "../runtime/setBindingValues.js";

export function executeVariableDeclaration(
  variableDeclaration,
  executionContext,
) {
  for (const declarator of variableDeclaration.declarations) {
    const binding = resolveIdentifier(
      declarator.id.name,
      executionContext.lexicalEnvironment,
    );

    const value = declarator.init
      ? evaluateExpression(declarator.init, executionContext)
      : undefined;

    setBindingValue(binding, value);
  }
}
