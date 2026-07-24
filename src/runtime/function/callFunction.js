import { createFunctionExecutionContext } from "./createFunctionExecutionContext.js";
import { bindParameters } from "./bindParameters.js";
import { executeNode } from "../../execution/executeNode.js";

export function callFunction(
  functionObject,
  args,
  executionContextStack,
  heap,
  thisValue = undefined,
) {
  const currentExecutionContext = executionContextStack.current();

  const functionExecutionContext = createFunctionExecutionContext(
    functionObject,
    currentExecutionContext.lexicalEnvironment,
  );

  if (thisValue !== undefined) {
    functionExecutionContext.thisValue = thisValue;
  }

  executionContextStack.push(functionExecutionContext);

  bindParameters(
    functionObject,
    args,
    functionExecutionContext.lexicalEnvironment,
  );

  executeNode(functionObject.body, executionContextStack, heap);

  const returnValue = functionExecutionContext.returnValue;

  executionContextStack.pop();

  return returnValue;
}
