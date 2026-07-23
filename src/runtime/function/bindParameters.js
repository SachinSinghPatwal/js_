import { resolveIdentifier } from "../resolveIdentifier.js";
import { setBindingValue } from "../setBindingValues.js";

export function bindParameters(functionObject, args, lexicalEnvironment) {
  const params = functionObject.params;

  for (let i = 0; i < params.length; i++) {
    const parameter = params[i];

    if (parameter.type !== "Identifier") {
      continue;
    }

    const binding = resolveIdentifier(parameter.name, lexicalEnvironment);

    setBindingValue(binding, args[i]);
  }
}
