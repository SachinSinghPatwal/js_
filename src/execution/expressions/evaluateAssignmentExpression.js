import { evaluateExpression } from "./evaluateExpression.js";
import { resolveIdentifier } from "../../runtime/resolveIdentifier.js";
import { setBindingValue } from "../../runtime/setBindingValues.js";

export function evaluateAssignmentExpression(node, executionContext) {
  if (node.left.type !== "Identifier") {
    throw new Error("Only identifier assignment is supported.");
  }

  const value = evaluateExpression(node.right, executionContext);

  const binding = resolveIdentifier(executionContext, node.left.name);

  setBindingValue(binding, value);

  return value;
}
