# Execution & Visualization Pipeline

```text
1. Source Code Input (Monaco CodeEditor)
   ↓
2. Optional Formatting (Prettier formatCode API)
   ↓
3. Code Parsing (Acorn Parser ➔ ESTree AST)
   ↓
4. Scope Building (Static Scope Tree Blueprint)
   ↓
5. Runtime Initialization (Global EC & Heap Allocation)
   ↓
6. Sync AST Execution Driver (executeNode.js ➔ Bytecode Interpreter)
   ↓
7. Host API & Event Loop Simulation (Web APIs ➔ Micro/Macrotask Queues)
   ↓
8. Snapshot Generator (Pre-computed State Array)
   ↓
9. Visualization Store (Subscription Dispatch & Step Control)
   ↓
10. React UI & Resizable Panels (Execution Stage, Call Stack, Heap, Queues, Console)
```

## Detailed Pipeline Stages

### Stage 1: Parsing (`src/parser/parseCode.js`)
Converts JavaScript string into ESTree-compliant AST with location annotations (`loc.start.line`, `loc.start.column`).

### Stage 2: Scope Building (`src/scope/scopeBuilder.js`)
Traverses AST to construct static scope hierarchy (`GlobalScope`, `FunctionScope`, `BlockScope`) and registers declarations.

### Stage 3: Runtime Initialization (`src/engine/initializeRuntime.js`)
- Allocates `GlobalObject` in Heap (`0x0000`).
- Instantiates `Global Execution Context` with `thisBinding` pointing to `0x0000`.
- Binds builtin objects (`console`, `setTimeout`, `Promise`).

### Stage 4: Memory Binding Creation
Registers `var`, `let`, `const`, and `function` declarations into Lexical Environment records. `let`/`const` bindings remain uninitialized in TDZ.

### Stage 5: Execution & Event Loop Driver (`src/execution/execute.js`)
- Executes statements step by step, updating bindings and allocating objects in Heap.
- Emits formal event loop phase steps (`CHECK_STACK_EMPTY`, `DRAIN_MICROTASKS`, `RENDER_OPPORTUNITY`, `TAKE_MACROTASK`).
- Generates snapshot step array stored in `VisualizationStore`.

### Stage 6: Render & Interactive Inspector
- React components subscribe to `VisualizationStore`.
- User steps through code line-by-line while Monaco highlights active statements and panels update dynamically.