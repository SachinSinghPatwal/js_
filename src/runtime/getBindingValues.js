import { UNINITIALIZED } from "./constant.js";

export function getBindingValue(binding) {

  if (binding.value === UNINITIALIZED) {
    throw new ReferenceError(
      `Cannot access '${binding.name}' before initialization`,
    );
  }

  return binding.value;
}
