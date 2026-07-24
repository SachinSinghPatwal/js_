export function executeBreakStatement(node, executionContextStack) {
  const executionContext = executionContextStack.current();

  executionContext.isBreaking = true;
}
