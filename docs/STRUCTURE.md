# Modular Architecture & Folder Responsibilities

The codebase separates the **Visualizer UI Layer** from the **Interpreter / Engine Runtime Layer** into clear, dedicated modules.

---

## 🏛️ High-Level Layer Architecture

```text
Visualizer UI Layer                     Interpreter / Engine Layer
┌───────────────────────────────┐       ┌───────────────────────────────┐
│ src/components/               │       │ src/engine/                   │
│   ├── Editor/                 │       │   ├── parser/                 │
│   ├── RuntimePanels/          │       │   ├── scope/                  │
│   └── Timeline/               │       │   ├── formatter/              │
├───────────────────────────────┤       │   ├── builtins/               │
│ src/visualization/            │       │   └── initializeRuntime.js    │
│   ├── snapshot/               │       ├───────────────────────────────┤
│   └── store/                  │       │ src/execution/                │
└───────────────────────────────┘       │   ├── execute.js              │
                                        │   ├── executeNode.js          │
                                        │   ├── statements/             │
                                        │   ├── modules/                │
                                        │   └── expressions/            │
                                        ├───────────────────────────────┤
                                        │ src/runtime/                  │
                                        │   ├── environment/            │
                                        │   ├── context/                │
                                        │   ├── function/               │
                                        │   └── heap/                   │
                                        └───────────────────────────────┘
```

---

## 📂 Folder Responsibilities

### 1. `src/components/` (Visualizer UI Components)
- **`Editor/`**: Monaco Editor setup, syntax highlighting, active line decorator (`decorator.js`), and custom VS Code dark theme (`Theme/dark26.json`).
- **`RuntimePanels/`**: Specialized inspection panels:
  - `CallStackPanel.jsx`: Execution context cards, scope chain, `this` binding.
  - `EventLoopPanel.jsx`: Step-by-step event loop phase pipeline.
  - `ExecutionStagePanel.jsx`: Centered flow badge, single-line action summary, and `Know More` inspector button.
  - `HeapPanel.jsx`: Categorized typed memory heap view (Objects, Functions, Promises, Arrays, Closures).
  - `MicroQueuePanel.jsx` & `MacroQueuePanel.jsx`: Queued `PromiseReactionJob` and `TimerTask` viewers.
  - `WebAPIPanel.jsx`: Host environment (Web APIs) viewer.
  - `ConsolePanel.jsx`: Simulated stdout/stderr terminal with line numbers (`Line 5`).
  - `EntityDetailsModal.jsx`: Tree inspector modal with circular reference protection and `Esc` key dismiss.
  - `PanelWidthGuard.jsx`: Responsive dual width/height observer guard overlay preventing window breakage.
- **`Timeline/`**: Floating playback controls (`TimelineControls.jsx`).

### 2. `src/visualization/` (Snapshot & Visualizer State Management)
- **`snapshot/SnapshotGenerator.js`**: Pre-computes state snapshots for every step of execution.
- **`store/VisualizationStore.js`**: Central subscription store for timeline playback, step navigation, and modal state.

---

### 3. `src/engine/` (Interpreter Subsystems & Runtime Setup)
- **`initializeRuntime.js`**: Bootstraps the engine runtime, allocates `GlobalObject` at `0x0000`, instantiates Global Execution Context, and binds builtin objects.
- **`builtins/`**: Native builtins (`createConsole.js`, `createPromise.js`, `createSetTimeout.js`).
- **`parser/parseCode.js`**: Acorn ESTree parser converting source code string into AST.
- **`scope/`**: Static scope blueprint builder (`scopeBuilder.js`, `scope.js`, `registerDeclaration.js`).
- **`formatter/formatCode.js`**: Prettier standalone code formatting service.
- **`traverser/traverseAST.js`**: AST walk helper.

---

### 4. `src/execution/` (AST Execution & Statement Dispatching)
- **`execute.js`**: Master runtime event loop driver and snapshot step generator.
- **`executeNode.js`**: Master statement AST dispatcher.
- **`statements/`**: Isolated AST statement handlers (`executeBlockStatement.js`, `executeIfStatement.js`, `executeVariableDeclaration.js`, `executeFunctionDeclaration.js`, `executeTryStatement.js`, etc.).
- **`modules/`**: ES Module declaration handlers (`evaluateImportDeclaration.js`, `evaluateExportNamedDeclaration.js`, etc.).
- **`expressions/`**: Expression evaluation handlers (`evaluateCallExpression.js`, `evaluateIdentifier.js`, `evaluateBinaryExpression.js`, etc.) and `operators/` (`binaryOperators.js`, `unaryOperators.js`).

---

### 5. `src/runtime/` (V8 Memory, Environment & Context Layer)
- **`createRuntimeBindings.js`**: Populates variable declarations into Environment Records.
- **`FunctionObject.js`**: First-class function object with captured `[[Environment]]` scope pointer.
- **`environment/`**: Lexical environment & environment record management (`createBinding.js`, `createEnvironmentRecord.js`, `createLexicalEnvironment.js`, `getBindingValues.js`, `setBindingValues.js`, `resolveIdentifier.js`, `constant.js`).
- **`context/`**: Execution Context factories (`createExecutionContext.js`, `createFunctionExecutionContext.js`).
- **`function/`**: Function invocation, parameter binding, and destructuring (`callFunction.js`, `bindParameters.js`, `bindDestructuring.js`).
- **`heap/`**: Typed Memory Heap allocation (`allocateObject.js`, `allocateArray.js`, `getHeapValue.js`) and Mark-and-Sweep Garbage Collection simulation (`heap.js`).