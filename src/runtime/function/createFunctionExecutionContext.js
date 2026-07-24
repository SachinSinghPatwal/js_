import { createEnvironmentRecord } from "../createEnvironmentRecord.js";
import { createLexicalEnvironment } from "../createLexicalEnvironment.js";
import { populateBindings } from "../../memory/createRuntimeBindings.js";

export function createFunctionExecutionContext(
  functionObject,
  outerLexicalEnvironment,
) {
  const environmentRecord = createEnvironmentRecord();

  const lexicalEnvironment = createLexicalEnvironment(
    functionObject.scope,
    outerLexicalEnvironment,
    environmentRecord,
  );

  populateBindings(functionObject.scope, environmentRecord);

  return {
    type: "function",
    lexicalEnvironment,
    returnValue: undefined,
    isReturning: false,
  };
}
