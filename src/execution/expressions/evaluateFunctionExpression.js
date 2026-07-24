import { createFunctionObject } from "../../runtime/function/createFunctionObject.js";

export function evaluateFunctionExpression(node, executionContextStack) {
  const executionContext = executionContextStack.current();

  return createFunctionObject(node, executionContext.lexicalEnvironment);
}
