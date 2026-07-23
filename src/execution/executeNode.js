import { executeBlockStatement } from "./executeBlockStatement.js";
import { executeProgram } from "./executeProgram.js";
import { executeVariableDeclaration } from "./executeVariableDeclaration.js";
import { executeExpressionStatement } from "./executeExpressionStatement.js";
import { executeFunctionDeclaration } from "./executeFunctionDeclaration.js";

export function executeNode(node, executionContext) {
  switch (node.type) {
    case "Program":
      return executeProgram(node, executionContext);

    case "BlockStatement":
      return executeBlockStatement(node, executionContext);

    case "VariableDeclaration":
      return executeVariableDeclaration(node, executionContext);

    case "FunctionDeclaration":
      return executeFunctionDeclaration(node, executionContext);

    case "ExpressionStatement":
      return executeExpressionStatement(node, executionContext);

    default:
      throw new Error(`Unsupported node: ${node.type}`);
  }
}
