import { createBinding } from "../runtime/createBinding.js";

export function populateBindings(scope, environmentRecord) {
  for (const [name, variable] of scope.variables) {
    console.log(scope.variable);

    const binding = createBinding(name, variable.kind);

    environmentRecord.bindings.set(name, binding);
  }
}
