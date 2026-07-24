import { resolveIdentifier } from "../../runtime/resolveIdentifier.js"; 
import { getBindingValue } from "../../runtime/getBindingValues.js";

export function evaluateIdentifier(node, executionContextStack) {
  if (node.name === "this") {
    return executionContextStack.current().thisValue;
  }
  const executionContext = executionContextStack.current();
  const binding = resolveIdentifier(
    node.name,
    executionContext.lexicalEnvironment,
  );

  return getBindingValue(binding);
}
