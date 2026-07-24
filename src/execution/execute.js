import { executeNode } from "./executeNode";

export function execute(ast, runtime) {
  const { executionContextStack } = runtime;

  for (const statement of ast.body) {
    executeNode(statement, executionContextStack);
  }
}
