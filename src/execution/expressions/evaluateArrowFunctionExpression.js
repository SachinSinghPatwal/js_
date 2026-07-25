import { FunctionObject } from "../../memory/FunctionObject.js";

export function evaluateArrowFunctionExpression(
  node,
  executionContextStack,
) {
  const executionContext = executionContextStack.current();

  return new FunctionObject(node, node.scope, {
    capturedEnvironment: executionContext.lexicalEnvironment,
    isArrow: true,
    capturedThisValue: executionContext.thisBinding,
  });
}
