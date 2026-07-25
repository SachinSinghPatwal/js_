export default class Heap {
  constructor() {
    this.memory = new Map();
    this.metadata = new Map();
    this.nextAddress = 1;
  }

  allocate(value, typeTag = 'Object') {
    const address = this.nextAddress++;

    this.memory.set(address, value);
    this.metadata.set(address, {
      typeTag,
      reachable: true,
      references: new Set(),
    });

    // Auto-detect type if not explicitly provided
    if (typeTag === 'Object') {
      if (Array.isArray(value)) {
        this.metadata.get(address).typeTag = 'Array';
      } else if (value?.PromiseState !== undefined) {
        this.metadata.get(address).typeTag = 'Promise';
      } else if (value instanceof Map) {
        this.metadata.get(address).typeTag = 'Map';
      } else if (value instanceof Set) {
        this.metadata.get(address).typeTag = 'Set';
      } else if (value instanceof WeakMap) {
        this.metadata.get(address).typeTag = 'WeakMap';
      } else if (value instanceof WeakSet) {
        this.metadata.get(address).typeTag = 'WeakSet';
      } else if (value?.type === 'FunctionObject' || value?.isNative) {
        this.metadata.get(address).typeTag = 'Function';
      }
    }

    // Scan for outgoing references
    this._scanReferences(address, value);

    return address;
  }

  get(address) {
    return this.memory.get(address);
  }

  set(address, value) {
    this.memory.set(address, value);
    // Re-scan references when value changes
    if (this.metadata.has(address)) {
      this.metadata.get(address).references.clear();
      this._scanReferences(address, value);
    }
  }

  getMeta(address) {
    return this.metadata.get(address);
  }

  deallocate(address) {
    this.memory.delete(address);
    this.metadata.delete(address);
    // Remove incoming references from other objects
    for (const [, meta] of this.metadata) {
      meta.references.delete(address);
    }
  }

  /**
   * Returns all heap entries with their metadata, categorized by type.
   */
  getAllCategorized() {
    const categories = {
      Objects: [],
      Functions: [],
      Arrays: [],
      Promises: [],
      Maps: [],
      Sets: [],
      ClosureContexts: [],
      WeakMaps: [],
      WeakSets: [],
    };

    for (const [address, value] of this.memory) {
      const meta = this.metadata.get(address) || { typeTag: 'Object', reachable: true, references: new Set() };
      const entry = {
        address,
        value,
        typeTag: meta.typeTag,
        reachable: meta.reachable,
        references: Array.from(meta.references),
      };

      switch (meta.typeTag) {
        case 'Function':
          categories.Functions.push(entry);
          break;
        case 'Array':
          categories.Arrays.push(entry);
          break;
        case 'Promise':
          categories.Promises.push(entry);
          break;
        case 'Map':
          categories.Maps.push(entry);
          break;
        case 'Set':
          categories.Sets.push(entry);
          break;
        case 'ClosureContext':
          categories.ClosureContexts.push(entry);
          break;
        case 'WeakMap':
          categories.WeakMaps.push(entry);
          break;
        case 'WeakSet':
          categories.WeakSets.push(entry);
          break;
        default:
          categories.Objects.push(entry);
          break;
      }
    }

    return categories;
  }

  /**
   * Returns a flat list of all heap entries with metadata.
   */
  getAll() {
    const entries = [];
    for (const [address, value] of this.memory) {
      const meta = this.metadata.get(address);
      entries.push({
        address,
        value,
        typeTag: meta?.typeTag || 'Object',
        reachable: meta?.reachable ?? true,
        references: meta ? Array.from(meta.references) : [],
      });
    }
    return entries;
  }

  /**
   * Simplified mark-and-sweep GC simulation.
   * @param {Set<number>} roots - Set of heap addresses reachable from the stack
   * @returns {{ marked: Set<number>, collected: number[] }}
   */
  markAndSweep(roots) {
    // Reset all reachable flags
    for (const [, meta] of this.metadata) {
      meta.reachable = false;
    }

    // Mark phase - BFS from roots
    const marked = new Set();
    const queue = [...roots];
    while (queue.length > 0) {
      const addr = queue.shift();
      if (marked.has(addr) || !this.metadata.has(addr)) continue;
      marked.add(addr);
      const meta = this.metadata.get(addr);
      meta.reachable = true;
      for (const ref of meta.references) {
        if (!marked.has(ref)) {
          queue.push(ref);
        }
      }
    }

    // Sweep phase - collect unreachable
    const collected = [];
    for (const [address, meta] of this.metadata) {
      if (!meta.reachable) {
        collected.push(address);
      }
    }

    // Actually remove collected objects
    for (const addr of collected) {
      this.deallocate(addr);
    }

    return { marked, collected };
  }

  /**
   * Scan a value for outgoing heap references.
   */
  _scanReferences(fromAddress, value) {
    if (!value || typeof value !== 'object') return;
    const meta = this.metadata.get(fromAddress);
    if (!meta) return;

    const scan = (v) => {
      if (typeof v === 'number' && this.memory.has(v)) {
        meta.references.add(v);
      }
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        for (const key of Object.keys(v)) {
          try {
            const propVal = v[key];
            if (typeof propVal === 'number' && this.memory.has(propVal)) {
              meta.references.add(propVal);
            }
          } catch {
            // Skip inaccessible properties
          }
        }
      }
    };

    scan(value);
    if (Array.isArray(value)) {
      for (const item of value) {
        scan(item);
      }
    }
  }

  get size() {
    return this.memory.size;
  }
}
