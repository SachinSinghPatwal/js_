import { FunctionObject } from "../../memory/FunctionObject.js";

export function evaluateFunctionExpression(node, executionContextStack) {
  const executionContext = executionContextStack.current();

  return new FunctionObject(node, executionContext.lexicalEnvironment);
}
