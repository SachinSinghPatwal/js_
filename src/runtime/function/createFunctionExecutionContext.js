import { createEnvironmentRecord } from "../createEnvironmentRecord.js";
import { createLexicalEnvironment } from "../createLexicalEnvironment.js";
import { populateBindings } from "../../memory/createRuntimeBindings.js";

export function createFunctionExecutionContext(functionObject) {
  const environmentRecord = createEnvironmentRecord();

  const lexicalEnvironment = createLexicalEnvironment(
    functionObject.scope,
    functionObject.scope.parent
      ? functionObject.scope.parent.environment
      : null,
    environmentRecord,
  );

  populateBindings(functionObject.scope, environmentRecord);

  return {
    lexicalEnvironment,
  };
}
