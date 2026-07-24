export function executeContinueStatement(node, executionContextStack) {
  const executionContext = executionContextStack.current();

  if (node.label) {
    const labelTarget = node.label.name;
    const hasMatchingLabel = executionContext.labelStack.includes(labelTarget);

    if (!hasMatchingLabel) {
      throw new SyntaxError(`Undefined label '${labelTarget}'`);
    }
  }

  executionContext.isContinuing = true;
}
