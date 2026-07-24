import { executeProgram } from "./executeProgram.js";
import { executeBlockStatement } from "./executeBlockStatement.js";
import { executeVariableDeclaration } from "./executeVariableDeclaration.js";
import { executeFunctionDeclaration } from "./executeFunctionDeclaration.js";
import { executeExpressionStatement } from "./executeExpressionStatement.js";
import { executeReturnStatement } from "./executeReturnStatement.js";

export function executeNode(node, executionContextStack, heap) {
  switch (node.type) {
    case "Program":
      return executeProgram(node, executionContextStack, heap);

    case "BlockStatement":
      return executeBlockStatement(node, executionContextStack, heap);

    case "VariableDeclaration":
      return executeVariableDeclaration(node, executionContextStack, heap);

    case "FunctionDeclaration":
      return executeFunctionDeclaration(node, executionContextStack, heap);

    case "ExpressionStatement":
      return executeExpressionStatement(node, executionContextStack, heap);

    case "ReturnStatement":
      return executeReturnStatement(node, executionContextStack, heap);

    default:
      throw new Error(`Unsupported node: ${node.type}`);
  }
}
