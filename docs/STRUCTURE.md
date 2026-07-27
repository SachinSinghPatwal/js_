# Modular Architecture & Folder Responsibilities

The codebase separates the **Visualizer UI Layer** from the **Interpreter / Engine Runtime Layer** into clear, dedicated modules.

---

## 🏛️ High-Level Layer Architecture

```text
Visualizer UI Layer                     Interpreter / Engine Layer
┌───────────────────────────────┐       ┌───────────────────────────────┐
│ src/components/               │       │ src/engine/                   │
│   ├── common/                 │       │   ├── parser/                 │
│   ├── editor/                 │       │   ├── scope/                  │
│   ├── layout/                 │       │   ├── formatter/              │
│   ├── runtime-panels/         │       │   ├── builtins/               │
│   └── timeline/               │       │   └── initializeRuntime.js    │
├───────────────────────────────┤       ├───────────────────────────────┤
│ src/visualization/            │       │ src/execution/                │
│   ├── snapshot/               │       │   ├── execute.js              │
│   └── store/                  │       │   ├── executeNode.js          │
└───────────────────────────────┘       │   ├── statements/             │
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
- **`common/`**: Reusable shared UI elements (`PanelWidthGuard.jsx`, `ResizeHandles.jsx`).
- **`editor/`**: Monaco Editor integration (`CodeEditor.jsx`), active line decorators (`decorations/`), and custom themes (`theme/dark26.json`).
- **`layout/`**: Top-level layout wrappers (`FloatingControlsHeader.jsx`).
- **`runtime-panels/`**: Specialized execution state inspection panels:
  - `call-stack/`: Execution context cards, scope chains, and `this` binding (`CallStackPanel.jsx`, `ExecutionContextCard.jsx`).
  - `console/`: Simulated terminal output with line numbers (`ConsolePanel.jsx`, `ConsoleLogItem.jsx`).
  - `event-loop/`: Visual phase-by-phase event loop pipeline (`EventLoopPanel.jsx`).
  - `execution-stage/`: Centered flow badge, action summary, and `Know More` inspector (`ExecutionStagePanel.jsx`).
  - `heap/`: Categorized typed memory heap view (`HeapPanel.jsx`).
  - `modal/`: Tree inspector modal with circular reference safety (`EntityDetailsModal.jsx`).
  - `queues/`: Web API host tasks, Macrotask, and Microtask queues (`MacroQueuePanel.jsx`, `MicroQueuePanel.jsx`, `WebAPIPanel.jsx`).
- **`timeline/`**: Playback state controls (`TimelineControls.jsx`, `PlaybackControls.jsx`, `TimelineProgressBar.jsx`, `PlaybackSpeedSelector.jsx`, `PanelToggleGroup.jsx`).

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