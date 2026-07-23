import { resolveIdentifier } from "../../runtime/resolveIdentifier.js"; 
import { getBindingValue } from "../../runtime/getBindingValues.js";

export function evaluateIdentifier(node, executionContext) {
  const binding = resolveIdentifier(executionContext, node.name);

  return getBindingValue(binding);
}
