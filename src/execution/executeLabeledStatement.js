import { executeNode } from "./executeNode.js";

export function executeLabeledStatement(node, executionContextStack, heap) {
  const executionContext = executionContextStack.current();

  executionContext.labelStack.push(node.label.name);

  try {
    executeNode(node.body, executionContextStack, heap);
  } finally {
    executionContext.labelStack.pop();
  }
}
