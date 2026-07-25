import { executeNode } from "../executeNode.js";
import { evaluateExpression } from "../expressions/evaluateExpression.js";

export function evaluateExportDefaultDeclaration(node, executionContextStack, heap) {
  // If it's a declaration like `export default function foo() {}`, execute it.
  if (
    node.declaration.type === "FunctionDeclaration" ||
    node.declaration.type === "ClassDeclaration"
  ) {
    executeNode(node.declaration, executionContextStack, heap);
  } else {
    // If it's an expression like `export default 1 + 1;`, evaluate it.
    evaluateExpression(node.declaration, executionContextStack, heap);
  }

  // Similar to ExportNamedDeclaration, we don't register this in a Module Environment
  // because cross-file importing is currently unsupported in the visualizer.
}
