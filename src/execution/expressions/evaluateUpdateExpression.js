import { resolveIdentifier } from "../../runtime/environment/resolveIdentifier.js";

export function evaluateUpdateExpression(node, executionContextStack) {
  if (node.argument.type !== "Identifier") {
    throw new Error("Only identifier update expressions are supported.");
  }

  const executionContext = executionContextStack.current();

  const binding = resolveIdentifier(
    node.argument.name,
    executionContext.lexicalEnvironment,
  );

  const oldValue = binding.value;

  let newValue;

  switch (node.operator) {
    case "++":
      newValue = oldValue + 1;
      break;

    case "--":
      newValue = oldValue - 1;
      break;

    default:
      throw new Error(`Unsupported update operator: ${node.operator}`);
  }

  binding.value = newValue;

  return node.prefix ? newValue : oldValue;
}
