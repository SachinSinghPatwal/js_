import { createLexicalEnvironment } from "../environment/createLexicalEnvironment.js";

let ecIdCounter = 1;

export function resetEcIdCounter() {
  ecIdCounter = 1;
}

export function createExecutionContext(scopeTree) {
  const globalLexicalEnvironment = createLexicalEnvironment(null, scopeTree);

  return {
    id: `ec-${ecIdCounter++}`,
    type: "global",
    scope: scopeTree,
    lexicalEnvironment: globalLexicalEnvironment,
    variableEnvironment: globalLexicalEnvironment,
    thisBinding: null,
    outerReference: null,
  };
}
