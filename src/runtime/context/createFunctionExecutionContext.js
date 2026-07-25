import { createEnvironmentRecord } from "../environment/createEnvironmentRecord.js";
import { createLexicalEnvironment } from "../environment/createLexicalEnvironment.js";
import { populateBindings } from "../createRuntimeBindings.js";
import { createBinding } from "../environment/createBinding.js";

let functionEcIdCounter = 1;

export function createFunctionExecutionContext(functionObject, thisValue = null) {
  const outerEnvironment = functionObject.capturedEnvironment;

  const functionLexicalEnvironment = createLexicalEnvironment(
    outerEnvironment,
    functionObject.functionScope
  );

  populateBindings(
    functionObject.functionScope,
    functionLexicalEnvironment.environmentRecord,
    functionLexicalEnvironment
  );

  const thisBinding = createBinding("this", "const");
  thisBinding.value = thisValue;
  thisBinding.initialized = true;

  functionLexicalEnvironment.environmentRecord.bindings.set("this", thisBinding);

  return {
    id: `fec-${functionEcIdCounter++}`,
    type: "function",
    scope: functionObject.functionScope,
    lexicalEnvironment: functionLexicalEnvironment,
    variableEnvironment: functionLexicalEnvironment,
    thisBinding: thisValue,
    outerReference: outerEnvironment,
    functionObject: functionObject,
  };
}
