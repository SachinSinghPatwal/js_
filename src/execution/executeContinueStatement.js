export function executeContinueStatement(node, executionContextStack) {
  const executionContext = executionContextStack.current();

  executionContext.isContinuing = true;
}
