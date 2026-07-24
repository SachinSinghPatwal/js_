import { createLexicalEnvironment } from "./createLexicalEnvironment.js";

export function createExecutionContext(type, scope) {
  const lexicalEnvironment = createLexicalEnvironment(scope);

  return {
    type,
    scope,

    lexicalEnvironment,

    // Initially both point to the same environment
    variableEnvironment: lexicalEnvironment,

    // Control-flow metadata
    labelStack: [],

    // Return state
    returnValue: undefined,
    isReturning: false,

    // Loop / switch state
    isBreaking: false,
    isContinuing: false,

    // Exception state
    pendingException: undefined,
    thisValue: undefined,
  };
}
