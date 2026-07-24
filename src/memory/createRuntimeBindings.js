import { createBinding } from "../runtime/createBinding.js";
import { FunctionObject } from "./FunctionObject.js";
// import { UNINITIALIZED } from "../runtime/constant.js";

export function populateBindings(scope, environmentRecord, lexicalEnvironment = null) {
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
        binding.value = new FunctionObject(
          variable.node,
          variable.functionScope,
          { capturedEnvironment: lexicalEnvironment }
        );
        binding.initialized = true;
        break;

      case "parameter":
        binding.value = UNINITIALIZED;
        binding.initialized = false;
        break;
    }

    environmentRecord.bindings.set(name, binding);
  }
}
