import { executeNode } from "./executeNode.js";

export function executeBlockStatement(blockStatement, executionContextStack) {
  for (const statement of blockStatement.body) {
    executeNode(statement, executionContextStack);

    const executionContext = executionContextStack.current();

    if (executionContext.isReturning) {
      return;
    }
  }
}
