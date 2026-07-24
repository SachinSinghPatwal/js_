import { executeNode } from "./executeNode";

export function execute(ast, runtime) {
  const { executionContextStack,heap } = runtime;

  for (const statement of ast.body) {
    executeNode(statement, executionContextStack, heap);
  }
}
