import { createEnvironmentRecord } from "../createEnvironmentRecord.js";
import { createLexicalEnvironment } from "../createLexicalEnvironment.js";
import { populateBindings } from "../../memory/createRuntimeBindings.js";
import { createBinding } from "../createBinding.js";

export function createFunctionExecutionContext(
  functionObject,
  outerLexicalEnvironment,
  args = [],
  newTarget = undefined,
) {
  const environmentRecord = createEnvironmentRecord();

  const lexicalEnvironment = createLexicalEnvironment(
    functionObject.scope,
    outerLexicalEnvironment,
    environmentRecord,
  );

  populateBindings(functionObject.scope, environmentRecord, lexicalEnvironment);

  if (functionObject.node?.id?.name) {
    const selfBinding = createBinding(functionObject.node.id.name, "let");
    selfBinding.value = functionObject;
    selfBinding.initialized = true;
    environmentRecord.bindings.set(functionObject.node.id.name, selfBinding);
  }

  const argumentsBinding = createBinding("arguments", "const");
  argumentsBinding.value = args;
  argumentsBinding.initialized = true;
  environmentRecord.bindings.set("arguments", argumentsBinding);

  const newTargetBinding = createBinding("new.target", "const");
  newTargetBinding.value = newTarget;
  newTargetBinding.initialized = true;
  environmentRecord.bindings.set("new.target", newTargetBinding);

  return {
    type: "function",
    scope: functionObject.scope,
    lexicalEnvironment,
    variableEnvironment: lexicalEnvironment,
    thisValue: undefined,
    newTarget,
    returnValue: undefined,
    isReturning: false,
    isBreaking: false,
    isContinuing: false,
    pendingException: undefined,
  };
}
