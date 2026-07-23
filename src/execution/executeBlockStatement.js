import { executeNode } from "./executeNode.js";

export function executeBlockStatement(node, executionContext) {
  for (const statement of node.body) {
    executeNode(statement, executionContext);
  }
}
