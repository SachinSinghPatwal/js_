import { evaluateExpression } from "./expressions/evaluateExpression.js";
import { resolveIdentifier } from "../runtime/resolveIdentifier.js";
import { setBindingValue } from "../runtime/setBindingValues.js";

export function executeClassDeclaration(node, executionContextStack, heap) {
  const executionContext = executionContextStack.current();
  const binding = resolveIdentifier(
    node.id.name,
    executionContext.lexicalEnvironment,
  );

  const classValue = evaluateExpression(
    {
      ...node,
      type: "ClassExpression",
    },
    executionContextStack,
    heap,
  );

  setBindingValue(binding, classValue);

  return classValue;
}
