import { createFunctionExecutionContext } from "./createFunctionExecutionContext.js";
import { bindParameters } from "./bindParameters.js";
import { executeNode } from "../../execution/executeNode.js";

export function callFunction(
  functionObject,
  args,
  executionContextStack,
  heap,
  thisValue = undefined,
  newTarget = undefined,
) {
  if (!functionObject || typeof functionObject !== "object") {
    console.error("[callFunction debug] fn:", functionObject, "args:", args);
    throw new TypeError("Attempted to call a non-function value.");
  }

  if (functionObject.isNative) {
    return functionObject.nativeCall(args, executionContextStack, heap, thisValue, newTarget);
  }

  const currentExecutionContext = executionContextStack.current();

  const functionExecutionContext = createFunctionExecutionContext(
    functionObject,
    functionObject.scope ?? currentExecutionContext.lexicalEnvironment,
    args,
    newTarget,
  );

  if (functionObject.isArrow) {
    functionExecutionContext.thisValue = functionObject.capturedThisValue;
  } else {
    functionExecutionContext.thisValue = thisValue;
  }

  // Propagate class-related metadata for super() and super.method()
  if (functionObject.superClass) {
    functionExecutionContext.superClass = functionObject.superClass;
  }

  if (functionObject.homeObject) {
    functionExecutionContext.homeObject = functionObject.homeObject;
  }

  executionContextStack.push(functionExecutionContext);

  bindParameters(
    functionObject,
    args,
    functionExecutionContext.lexicalEnvironment,
    executionContextStack,
    heap,
  );

  executeNode(functionObject.body, executionContextStack, heap);

  const returnValue = functionExecutionContext.returnValue;

  executionContextStack.pop();

  return returnValue;
}

