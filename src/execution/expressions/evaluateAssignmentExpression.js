import { evaluateExpression } from "./evaluateExpression.js";
import { resolveIdentifier } from "../../runtime/resolveIdentifier.js";
import { setBindingValue } from "../../runtime/setBindingValues.js";
import { evaluateMemberAssignmentExpression } from "./evaluateMemberAssignmentExpression.js";

export function evaluateAssignmentExpression(
  node,
  executionContextStack,
  heap,
) {
  if (node.left.type === "Identifier") {
    const executionContext = executionContextStack.current();

    const value = evaluateExpression(node.right, executionContextStack, heap);

    const binding = resolveIdentifier(
      node.left.name,
      executionContext.lexicalEnvironment,
    );

    setBindingValue(binding, value);

    return value;
  }

  if (node.left.type === "MemberExpression") {
    return evaluateMemberAssignmentExpression(
      node,
      executionContextStack,
      heap,
    );
  }

  throw new Error("Unsupported assignment target.");
}
