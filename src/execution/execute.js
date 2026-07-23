import { executeNode } from "./executeNode";

export function execute(ast, executionContext) {
  for (const statement of ast.body) {
    executeNode(statement, executionContext);
  }
}
