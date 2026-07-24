import { createFunctionExecutionContext } from "./createFunctionExecutionContext.js";
import { bindParameters } from "./bindParameters.js";
import { executeNode } from "../../execution/executeNode.js";

export function callFunction(functionObject, args, executionContextStack) {
  const currentExecutionContext = executionContextStack.current();

  const functionExecutionContext = createFunctionExecutionContext(
    functionObject,
    currentExecutionContext.lexicalEnvironment,
  );

  executionContextStack.push(functionExecutionContext);

  bindParameters(
    functionObject,
    args,
    functionExecutionContext.lexicalEnvironment,
  );

  executeNode(functionObject.body, executionContextStack);

  const returnValue = functionExecutionContext.returnValue;

  executionContextStack.pop();

  return returnValue;
}
