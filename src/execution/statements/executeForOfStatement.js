import { executeNode } from "../executeNode.js";
import { evaluateExpression } from "../expressions/evaluateExpression.js";
import { getHeapValue } from "../../runtime/heap/getHeapValue.js";
import { resolveIdentifier } from "../../runtime/environment/resolveIdentifier.js";
import { setBindingValue } from "../../runtime/environment/setBindingValues.js";
import { bindDestructuring } from "../../runtime/function/bindDestructuring.js";

export function executeForOfStatement(node, executionContextStack, heap) {
  const executionContext = executionContextStack.current();
  const iterableAddress = evaluateExpression(
    node.right,
    executionContextStack,
    heap,
  );
  const iterable =
    typeof iterableAddress === "number"
      ? getHeapValue(heap, iterableAddress)
      : iterableAddress;

  const values = Array.isArray(iterable)
    ? iterable
    : iterable != null
      ? Object.values(iterable)
      : [];

  for (const value of values) {
    const target = node.left.type === "VariableDeclaration"
      ? node.left.declarations[0].id
      : node.left;

    if (target.type === "ObjectPattern" || target.type === "ArrayPattern") {
      bindDestructuring(
        target,
        value,
        executionContext.lexicalEnvironment,
        executionContextStack,
        heap,
      );
    } else if (target.type === "Identifier") {
      const binding = resolveIdentifier(
        target.name,
        executionContext.lexicalEnvironment,
      );
      setBindingValue(binding, value);
    }

    executeNode(node.body, executionContextStack, heap);

    if (executionContext.isReturning) {
      return;
    }

    if (executionContext.isBreaking) {
      executionContext.isBreaking = false;
      return;
    }

    if (executionContext.isContinuing) {
      executionContext.isContinuing = false;
      continue;
    }

    if (executionContext.pendingException !== undefined) {
      return;
    }
  }
}
