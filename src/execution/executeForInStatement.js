import { executeNode } from "./executeNode.js";
import { evaluateExpression } from "./expressions/evaluateExpression.js";
import { getHeapValue } from "../runtime/heap/getHeapValue.js";
import { resolveIdentifier } from "../runtime/resolveIdentifier.js";
import { setBindingValue } from "../runtime/setBindingValues.js";
import { bindDestructuring } from "../runtime/function/bindDestructuring.js";

export function executeForInStatement(node, executionContextStack, heap) {
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

  const keys = Object.keys(iterable ?? {});

  for (const key of keys) {
    const target = node.left.type === "VariableDeclaration"
      ? node.left.declarations[0].id
      : node.left;

    if (target.type === "ObjectPattern" || target.type === "ArrayPattern") {
      bindDestructuring(
        target,
        key,
        executionContext.lexicalEnvironment,
        executionContextStack,
        heap,
      );
    } else if (target.type === "Identifier") {
      const binding = resolveIdentifier(
        target.name,
        executionContext.lexicalEnvironment,
      );
      setBindingValue(binding, key);
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
