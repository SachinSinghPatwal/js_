import { executeVariableDeclaration } from "./executeVariableDeclaration.js";

export function executeStatement(statement, executionContext) {
  switch (statement.type) {
    case "VariableDeclaration":
      return executeVariableDeclaration(statement, executionContext);

    default:
      throw new Error(`Unsupported statement: ${statement.type}`);
  }
}
