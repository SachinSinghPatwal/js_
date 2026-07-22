import { createBinding } from "../runtime/createBinding.js";
// import { UNINITIALIZED } from "../runtime/constant.js";

export function populateBindings(scope, environmentRecord) {
  for (const [name, variable] of scope.variables) {
    const binding = createBinding(name, variable.kind);
    const UNINITIALIZED = Symbol("UNINITIALIZED");

    switch (variable.kind) {
      case "var":
        binding.value = undefined;
        binding.initialized = true;
        break;

      case "let":
        binding.value = UNINITIALIZED;
        binding.initialized = false;
        break;

      case "const":
        binding.value = UNINITIALIZED;
        binding.initialized = false;
        break;

      case "function":
        binding.value = {
          type: "FunctionObject",
          name,
        };
        binding.initialized = true;
        break;
    }

    environmentRecord.bindings.set(name, binding);
  }
}
