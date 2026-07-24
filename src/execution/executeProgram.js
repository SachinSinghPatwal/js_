import { executeNode } from "./executeNode.js";

export function executeProgram(program, executionContextStack, heap) {
  for (const statement of program.body) {
    executeNode(statement, executionContextStack, heap);

    const executionContext = executionContextStack.current();

    if (executionContext.isReturning) {
      return;
    }
  }
}
