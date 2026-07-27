import { getHeapValue } from "../heap/getHeapValue.js";

export function bindDestructuring(
  pattern,
  value,
  environmentRecord,
  executionContextStack,
  heap
) {
  if (!pattern || value === undefined || value === null) return;

  const resolvedValue = typeof value === "number" ? getHeapValue(heap, value) : value;

  if (pattern.type === "ObjectPattern") {
    pattern.properties.forEach((prop) => {
      if (prop.type === "Property") {
        const key = prop.key.name || prop.key.value;
        const val = resolvedValue ? resolvedValue[key] : undefined;

        if (prop.value.type === "Identifier") {
          const binding = environmentRecord.bindings.get(prop.value.name);
          if (binding) {
            binding.value = val;
            binding.initialized = true;
          }
        } else if (
          prop.value.type === "ObjectPattern" ||
          prop.value.type === "ArrayPattern"
        ) {
          bindDestructuring(
            prop.value,
            val,
            environmentRecord,
            executionContextStack,
            heap
          );
        }
      }
    });
  } else if (pattern.type === "ArrayPattern") {
    const arrayElements = Array.isArray(resolvedValue) ? resolvedValue : [];

    pattern.elements.forEach((element, index) => {
      if (!element) return;

      const val = arrayElements[index];

      if (element.type === "Identifier") {
        const binding = environmentRecord.bindings.get(element.name);
        if (binding) {
          binding.value = val;
          binding.initialized = true;
        }
      } else if (
        element.type === "ObjectPattern" ||
        element.type === "ArrayPattern"
      ) {
        bindDestructuring(
          element,
          val,
          environmentRecord,
          executionContextStack,
          heap
        );
      }
    });
  }
}
