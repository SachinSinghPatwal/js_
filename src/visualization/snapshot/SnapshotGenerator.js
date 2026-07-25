export function createSnapshot(step, currentNode, runtime) {
  const seen = new Map();

  function deepClone(value) {
    if (value === null || typeof value !== "object") {
      return value;
    }

    if (seen.has(value)) {
      return seen.get(value);
    }

    if (value instanceof Map) {
      const clonedMap = new Map();
      seen.set(value, clonedMap);
      for (const [k, v] of value.entries()) {
        clonedMap.set(k, deepClone(v));
      }
      return clonedMap;
    }

    if (value instanceof Set) {
      const clonedSet = new Set();
      seen.set(value, clonedSet);
      for (const v of value) {
        clonedSet.add(deepClone(v));
      }
      return clonedSet;
    }

    if (Array.isArray(value)) {
      const clonedArray = [];
      seen.set(value, clonedArray);
      for (let i = 0; i < value.length; i++) {
        clonedArray[i] = deepClone(value[i]);
      }
      return clonedArray;
    }

    // Preserve prototype so class methods (like heap.get) still work
    const clonedObject = Object.create(Object.getPrototypeOf(value));
    seen.set(value, clonedObject);

    for (const key of Object.getOwnPropertyNames(value)) {
      try {
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (descriptor) {
          Object.defineProperty(clonedObject, key, {
            ...descriptor,
            value: deepClone(descriptor.value),
          });
        }
      } catch {
        // Ignore properties that cannot be cloned or accessed securely
      }
    }

    return clonedObject;
  }

  const clonedRuntime = deepClone(runtime);

  // Generate categorized heap view for the visualization
  let heapCategorized = null;
  if (runtime.heap && typeof runtime.heap.getAllCategorized === 'function') {
    try {
      heapCategorized = deepClone(runtime.heap.getAllCategorized());
    } catch {
      // Fallback if heap categorization fails
    }
  }

  // Determine snapshot type based on event loop phase
  let snapshotType = 'execution';
  const phase = runtime.eventLoop?.phase;
  if (phase && phase !== 'IDLE' && phase !== 'EXECUTING_SYNC') {
    snapshotType = 'eventLoop';
  }
  if (runtime.closureEvents?.length > 0) {
    snapshotType = 'closure';
  }

  return {
    step,
    currentNode,
    runtime: clonedRuntime,
    snapshotType,
    heapCategorized,
    eventLoopPhase: runtime.eventLoop ? {
      phase: runtime.eventLoop.phase,
      currentPhaseStep: runtime.eventLoop.currentPhaseStep,
    } : null,
  };
}
