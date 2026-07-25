import { executeProgram } from "./statements/executeProgram.js";
import { executeBlockStatement } from "./statements/executeBlockStatement.js";
import { executeVariableDeclaration } from "./statements/executeVariableDeclaration.js";
import { executeFunctionDeclaration } from "./statements/executeFunctionDeclaration.js";
import { executeExpressionStatement } from "./statements/executeExpressionStatement.js";
import { executeReturnStatement } from "./statements/executeReturnStatement.js";
import { executeIfStatement } from "./statements/executeIfStatement.js";
import { executeWhileStatement } from "./statements/executeWhileStatement.js";
import { executeForStatement } from "./statements/executeForStatement.js";
import { executeSwitchStatement } from "./statements/executeSwitchStatement.js";
import { executeBreakStatement } from "./statements/executeBreakStatement.js";
import { executeContinueStatement } from "./statements/executeContinueStatement.js";
import { executeDoWhileStatement } from "./statements/executeDoWhileStatement.js";
import { executeThrowStatement } from "./statements/executeThrowStatement.js";
import { executeTryStatement } from "./statements/executeTryStatement.js";
import { executeForInStatement } from "./statements/executeForInStatement.js";
import { executeForOfStatement } from "./statements/executeForOfStatement.js";
import { executeLabeledStatement } from "./statements/executeLabeledStatement.js";
import { executeClassDeclaration } from "./statements/executeClassDeclaration.js";
import { evaluateImportDeclaration } from "./modules/evaluateImportDeclaration.js";
import { evaluateExportNamedDeclaration } from "./modules/evaluateExportNamedDeclaration.js";
import { evaluateExportDefaultDeclaration } from "./modules/evaluateExportDefaultDeclaration.js";
import { evaluateExportAllDeclaration } from "./modules/evaluateExportAllDeclaration.js";

export function executeNode(node, executionContextStack, heap) {
  if (!node) return;

  if (heap.runtime) {
    heap.runtime.currentNode = node;
    if (heap.runtime.onStep) {
      heap.runtime.onStep(node, heap.runtime);
    }
  }

  switch (node.type) {
    case "Program":
      return executeProgram(node, executionContextStack, heap);

    case "ImportDeclaration":
      return evaluateImportDeclaration(node, executionContextStack, heap);

    case "ExportNamedDeclaration":
      return evaluateExportNamedDeclaration(node, executionContextStack, heap);

    case "ExportDefaultDeclaration":
      return evaluateExportDefaultDeclaration(node, executionContextStack, heap);

    case "ExportAllDeclaration":
      return evaluateExportAllDeclaration(node, executionContextStack, heap);

    case "BlockStatement":
      return executeBlockStatement(node, executionContextStack, heap);

    case "VariableDeclaration":
      return executeVariableDeclaration(node, executionContextStack, heap);

    case "FunctionDeclaration":
      return executeFunctionDeclaration(node, executionContextStack, heap);

    case "ClassDeclaration":
      return executeClassDeclaration(node, executionContextStack, heap);

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

    case "LabeledStatement":
      return executeLabeledStatement(node, executionContextStack, heap);

    case "ForInStatement":
      return executeForInStatement(node, executionContextStack, heap);

    case "ForOfStatement":
      return executeForOfStatement(node, executionContextStack, heap);

    case "ThrowStatement":
      return executeThrowStatement(node, executionContextStack, heap);

    case "TryStatement":
      return executeTryStatement(node, executionContextStack, heap);

    default:
      throw new Error(`Unsupported node: ${node.type}`);
  }
}
