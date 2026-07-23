import { createFunctionExecutionContext } from "./createFunctionExecutionContext.js";
import { bindParameters } from "./bindParameters.js";

export function callFunction(functionObject, args) {
  const functionExecutionContext =
    createFunctionExecutionContext(functionObject);

  bindParameters(
    functionObject,
    args,
    functionExecutionContext.lexicalEnvironment,
  );

  bindParameters(
    functionObject,
    args,
    functionExecutionContext.lexicalEnvironment,
  );
  throw new Error("STOP");
}
