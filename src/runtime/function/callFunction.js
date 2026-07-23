import { createFunctionExecutionContext } from "./createFunctionExecutionContext.js";
import { bindParameters } from "./bindParameters.js";

export function callFunction(functionObject, args, callerExecutionContext) {
  const functionExecutionContext =
    createFunctionExecutionContext(functionObject);

  bindParameters(
    functionObject,
    args,
    functionExecutionContext.lexicalEnvironment,
  );

  console.log(
    functionExecutionContext.lexicalEnvironment.environmentRecord.bindings,
  );

  throw new Error("Function body execution not implemented");
}
