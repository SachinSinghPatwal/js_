import { executeProgram } from "./executeProgram.js";
import { executeBlockStatement } from "./executeBlockStatement.js";
import { executeVariableDeclaration } from "./executeVariableDeclaration.js";
import { executeFunctionDeclaration } from "./executeFunctionDeclaration.js";
import { executeExpressionStatement } from "./executeExpressionStatement.js";
import { executeReturnStatement } from "./executeReturnStatement.js";
import { executeIfStatement } from "./executeIfStatement.js";
import { executeWhileStatement } from "./executeWhileStatement.js";
import { executeForStatement } from "./executeForStatement.js";
import { executeSwitchStatement } from "./executeSwitchStatement.js";
import { executeBreakStatement } from "./executeBreakStatement.js";
import { executeContinueStatement } from "./executeContinueStatement.js";
import { executeDoWhileStatement } from "./executeDoWhileStatement.js";
import { executeThrowStatement } from "./executeThrowStatement.js";
import { executeTryStatement } from "./executeTryStatement.js";

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

    case "IfStatement":
      return executeIfStatement(node, executionContextStack, heap);

    case "WhileStatement":
      return executeWhileStatement(node, executionContextStack, heap);

    case "ForStatement":
      return executeForStatement(node, executionContextStack, heap);
    case "SwitchStatement":
      return executeSwitchStatement(node, executionContextStack, heap);

    case "BreakStatement":
      return executeBreakStatement(node, executionContextStack);

    case "ContinueStatement":
      return executeContinueStatement(node, executionContextStack);

    case "DoWhileStatement":
      return executeDoWhileStatement(node, executionContextStack, heap);

    case "ThrowStatement":
      return executeThrowStatement(node, executionContextStack, heap);

    case "TryStatement":
      return executeTryStatement(node, executionContextStack, heap);

    default:
      throw new Error(`Unsupported node: ${node.type}`);
  }
}
