import { executeBlockStatement } from "./executeBlockStatement.js";
import { executeProgram } from "./executeProgram.js";
import { executeVariableDeclaration } from "./executeVariableDeclaration.js";
import { executeExpressionStatement } from "./executeExpressionStatement.js";
import { executeFunctionDeclaration } from "./executeFunctionDeclaration.js";
import { executeReturnStatement } from "./executeReturnStatement.js";

export function executeNode(node, executionContextStack) {
  switch (node.type) {
    case "Program":
      return executeProgram(node, executionContextStack);

    case "BlockStatement":
      return executeBlockStatement(node, executionContextStack);

    case "VariableDeclaration":
      return executeVariableDeclaration(node, executionContextStack);

    case "FunctionDeclaration":
      return executeFunctionDeclaration(node, executionContextStack);

    case "ExpressionStatement":
      return executeExpressionStatement(node, executionContextStack);

    case "ReturnStatement":
      return executeReturnStatement(node, executionContextStack);

    default:
      throw new Error(`Unsupported node: ${node.type}`);
  }
}
