import { FunctionObject } from "../../memory/FunctionObject.js";

export function evaluateFunctionExpression(node, executionContextStack) {
  const executionContext = executionContextStack.current();

  return FunctionObject(node, executionContext.lexicalEnvironment);
}
