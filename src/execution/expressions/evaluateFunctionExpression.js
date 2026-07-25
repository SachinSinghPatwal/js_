import { FunctionObject } from "../../runtime/FunctionObject.js";

export function evaluateFunctionExpression(node, executionContextStack) {
  const executionContext = executionContextStack.current();

  return new FunctionObject(node, node.scope, {
    capturedEnvironment: executionContext.lexicalEnvironment,
  });
}
