import { evaluateExpression } from "./expressions/evaluateExpression.js";

export function executeVariableDeclaration(
  variableDeclaration,
  executionContext,
) {
  for (const declarator of variableDeclaration.declarations) {
    const value = evaluateExpression(declarator.init, executionContext);

    console.log(declarator.id.name);
    console.log(value);
  }
}
