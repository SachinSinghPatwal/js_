import { evaluateExpression } from "./expressions/evaluateExpression.js";
import { executeNode } from "./executeNode.js";

export function executeSwitchStatement(node, executionContextStack, heap) {
  const discriminant = evaluateExpression(
    node.discriminant,
    executionContextStack,
    heap,
  );

  let matched = false;

  for (const switchCase of node.cases) {
    if (
      !matched &&
      (switchCase.test === null ||
        evaluateExpression(switchCase.test, executionContextStack, heap) ===
          discriminant)
    ) {
      matched = true;
    }

    if (!matched) {
      continue;
    }

    for (const statement of switchCase.consequent) {
      executeNode(statement, executionContextStack, heap);

      const executionContext = executionContextStack.current();

      if (executionContext.isReturning) {
        return;
      }

      if (executionContext.isBreaking) {
        executionContext.isBreaking = false;
        return;
      }

      if (executionContext.pendingException !== undefined) {
        return;
      }
    }
  }
}
