import { createLexicalEnvironment } from "./createLexicalEnvironment.js";

let _ecIdCounter = 0;

export function resetEcIdCounter() {
  _ecIdCounter = 0;
}

export function createExecutionContext(type, scope) {
  const lexicalEnvironment = createLexicalEnvironment(scope);

  return {
    id: ++_ecIdCounter,
    type,
    scope,

    lexicalEnvironment,

    // Initially both point to the same environment
    variableEnvironment: lexicalEnvironment,

    // this binding lives inside the Execution Context (not in heap)
    thisBinding: undefined,

    // Outer environment reference (for scope chain visualization)
    outerReference: lexicalEnvironment.outer || null,

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
  };
}
