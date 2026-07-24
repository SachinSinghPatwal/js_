import { resolveIdentifier } from "../../runtime/resolveIdentifier.js"; 
import { getBindingValue } from "../../runtime/getBindingValues.js";

export function evaluateIdentifier(node, executionContextStack) {
  const executionContext = executionContextStack.current();
  const binding = resolveIdentifier(
    node.name,
    executionContext.lexicalEnvironment,
  );

  return getBindingValue(binding);
}
