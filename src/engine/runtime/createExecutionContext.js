import { createLexicalEnvironment } from "./createLexicalEnvironment.js";

export function createExecutionContext(type, scope) {
  const lexicalEnvironment = createLexicalEnvironment(scope);

  return {
    type,
    scope,

    lexicalEnvironment,

    // Initially both point to the same environment
    variableEnvironment: lexicalEnvironment,
  };
}
