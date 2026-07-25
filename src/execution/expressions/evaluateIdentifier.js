import { resolveIdentifier } from "../../runtime/resolveIdentifier.js"; 
import { getBindingValue } from "../../runtime/getBindingValues.js";

export function evaluateIdentifier(node, executionContextStack) {
  if (node.name === "this") {
    return executionContextStack.current().thisBinding;
  }

  if (node.name === "new.target") {
    return executionContextStack.current().newTarget;
  }

  const executionContext = executionContextStack.current();
  const binding = resolveIdentifier(
    node.name,
    executionContext.lexicalEnvironment,
  );

  return getBindingValue(binding);
}
