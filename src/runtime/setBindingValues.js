import { UNINITIALIZED } from "./constant.js";

export function setBindingValue(binding, value) {
  if (binding.kind === "const" && binding.initialized) {
    throw new TypeError(`Assignment to constant variable '${binding.name}'`);
  }

  binding.value = value;

  binding.initialized = true;
}
