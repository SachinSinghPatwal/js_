import { createFunctionExecutionContext } from "../context/createFunctionExecutionContext.js";
import { bindParameters } from "./bindParameters.js";
import { executeNode } from "../../execution/executeNode.js";

export function callFunction(
  functionObject,
  args,
  executionContextStack,
  heap,
  thisValue = null,
  newTarget = null,
) {
  if (functionObject.isNative) {
    return functionObject.nativeCall(
      args,
      executionContextStack,
      heap,
      thisValue,
      newTarget,
    );
  }

  const functionExecutionContext = createFunctionExecutionContext(
    functionObject,
    thisValue,
  );

  bindParameters(
    functionObject,
    args,
    functionExecutionContext.lexicalEnvironment.environmentRecord,
    executionContextStack,
    heap,
  );

  executionContextStack.push(functionExecutionContext);

  let result;
  try {
    result = executeNode(functionObject.node.body, executionContextStack, heap);
  } finally {
    if (executionContextStack.current() === functionExecutionContext) {
      executionContextStack.pop();
    }
  }

  return result;
}
