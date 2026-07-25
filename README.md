# V8 JavaScript Runtime & Event Loop Visualizer

An interactive, educational JavaScript engine simulator built to accurately demonstrate how modern JavaScript engines (such as V8) and host environments (Browser / Node.js) execute code.

> **Primary Goal**: Educational correctness over visual simplicity. The visualizer reveals hidden runtime internals—showing how Execution Contexts, Lexical Environments, Memory Heap pointers, Closures, Microtasks, Macrotasks, and the Event Loop operate under the hood.

---

## 🌟 Why This Project Exists

Most JavaScript visualizers simplify runtime execution into basic animated queues, obscuring the actual ECMAScript and V8 specification details. Beginners and experienced developers alike often struggle with:
- **How Execution Contexts and Scope Chains are resolved** beyond simple stack frames.
- **Where values actually live** (Primitive values in Environment Records vs. Reference Objects stored at Heap addresses like `0x0001`).
- **How Closures capture scope** via hidden `[[Environment]]` pointers.
- **The exact sequence of the Event Loop** (Microtask queue draining before rendering and before macrotasks).
- **Temporal Dead Zone (TDZ)** behavior during memory binding creation vs. initializer execution.

This project bridges that gap by providing a **transparent, step-by-step V8 runtime simulator** with interactive inspection tools.

---

## ✨ Key Features

- 🛠️ **Monaco Code Editor**: Full-featured code editor with syntax highlighting, automatic line wrapping, custom dark theme (`Dark26`), and active statement line highlighting.
- ⚡ **Execution Stage**: Centered live data flow (`Source.js ➔ Call Stack ➔ Lexical Environment`) with single-line action summaries and an interactive **`Know More` V8 Property Inspector**.
- 🥞 **V8 Execution Context Stack**: Detailed stack frame visualization expanding into:
  - **Lexical Environment** & **Variable Environment** bindings.
  - **Temporal Dead Zone (TDZ)** indicator.
  - **`this` Binding** reference.
  - **Outer Scope Reference Pointer** (`outerReference`).
- 🧠 **Typed Memory Heap & GC**: Simulates memory allocation with typed tags (`Object`, `Function`, `Array`, `Promise`, `Map`, `Set`, `ClosureContext`) and reference-graph Mark-and-Sweep Garbage Collection.
- 🔄 **Phase-by-Phase Event Loop**: Step-by-step pipeline tracking `CHECK_STACK_EMPTY`, `DRAIN_MICROTASKS`, `RENDER_OPPORTUNITY`, and `TAKE_MACROTASK`.
- 📬 **Microtask & Macrotask Queues**: Explicit tracking of `PromiseReactionJob`s and `TimerTask`s.
- 🌐 **Host Environment Separation**: Explicit distinction between V8 Engine Core and Host APIs (Browser / Node.js).
- 🖥️ **Console Output with Line Numbers**: Outputs `console.log`, `console.warn`, and `console.error` logs with exact source line numbers (`Line 5`).
- 🔍 **Interactive Entity Inspector Modal**: Click any heap object or queue item to inspect full internal tree structures. Supports keyboard shortcut (`Esc`) and backdrop click dismiss with circular reference safety.
- 📐 **Strict Panel Drag Constraints**: Hard minimum panel size boundaries (`minSize`) and responsive `ResizeObserver` width/height guards prevent window distortion.

---

## 🏗️ Clean Modular Architecture & File Structure

The project strictly separates the **Visualizer UI Layer** from the **Interpreter / Engine Runtime Layer**:

```text
Js_Engine_Visualizer/
├── docs/                             # Architectural documentation (Source of Truth)
│   ├── DECISIONS.md                  # Architectural Decision Records (ADRs)
│   ├── GLOSSARY.md                   # V8 & ECMAScript terminology definition
│   ├── PIPELINE.md                   # High-level code transformation pipeline
│   ├── ROADMAP.md                    # Project roadmap and completed phases
│   └── STRUCTURE.md                  # Detailed component architecture & scope
├── public/                           # Static assets
├── src/
│   ├── App.jsx                       # Main application shell & resizable panel layout
│   ├── main.jsx                      # React application entry point
│   ├── index.css                     # Global styles, custom scrollbars, and dark theme utility classes
│   │
│   ├── components/                   # VISUALIZER UI LAYER
│   │   ├── Editor/
│   │   │   ├── CodeEditor.jsx        # Monaco Editor component with line tracking
│   │   │   ├── decorator.js          # Active line highlighting decorator
│   │   │   └── Theme/
│   │   │       ├── dark26.json       # VS Code Dark (#1e1e1e) editor theme definition
│   │   │       └── registerTheme.json
│   │   ├── RuntimePanels/
│   │   │   ├── CallStackPanel.jsx    # Execution Context Cards & Scope Chain viewer
│   │   │   ├── ConsolePanel.jsx      # Console output panel with line numbers
│   │   │   ├── EntityDetailsModal.jsx# Inspector modal for objects & stack frames
│   │   │   ├── EventLoopPanel.jsx    # Event loop phase pipeline viewer
│   │   │   ├── ExecutionStagePanel.jsx # Centered flow badge, summary & Know More inspector
│   │   │   ├── HeapPanel.jsx         # Categorized typed memory heap view
│   │   │   ├── MacroQueuePanel.jsx   # Macrotask Queue (TimerTask) viewer
│   │   │   ├── MicroQueuePanel.jsx   # Microtask Queue (PromiseReactionJob) viewer
│   │   │   ├── PanelWidthGuard.jsx   # Dual width/height observer guard overlay
│   │   │   └── WebAPIPanel.jsx       # Host Environment (Web APIs) viewer
│   │   └── Timeline/
│   │       └── TimelineControls.jsx  # Floating play, pause, step forward/back controls
│   │
│   ├── engine/                       # INTERPRETER CORE & SUBSYSTEMS LAYER
│   │   ├── initializeRuntime.js      # Runtime setup & global object allocation
│   │   ├── builtins/                 # Engine Builtins (console, setTimeout, promise)
│   │   │   ├── createConsole.js      # Console builtin methods with line tracking
│   │   │   ├── createPromise.js      # Promise constructor & ReactionJobs
│   │   │   └── createSetTimeout.js   # setTimeout builtin & TimerTasks
│   │   ├── formatter/                # Code formatting subsystem (Prettier API)
│   │   │   └── formatCode.js
│   │   ├── parser/                   # AST parsing subsystem (Acorn Parser)
│   │   │   └── parseCode.js
│   │   ├── scope/                    # Static Scope Blueprint Generator
│   │   │   ├── registerDeclaration.js
│   │   │   ├── scope.js
│   │   │   └── scopeBuilder.js
│   │   └── traverser/                # AST Traversal Subsystem (acorn-walk)
│   │       └── traverseAST.js
│   │
│   ├── execution/                    # AST STATEMENT & EXPRESSION EXECUTION LAYER
│   │   ├── execute.js                # Core event loop driver & phase step emitter
│   │   ├── executeNode.js            # Master AST statement dispatcher
│   │   ├── statements/               # AST Statement Execution Handlers
│   │   │   ├── executeBlockStatement.js
│   │   │   ├── executeBreakStatement.js
│   │   │   ├── executeClassDeclaration.js
│   │   │   ├── executeContinueStatement.js
│   │   │   ├── executeDoWhileStatement.js
│   │   │   ├── executeExpressionStatement.js
│   │   │   ├── executeForInStatement.js
│   │   │   ├── executeForOfStatement.js
│   │   │   ├── executeForStatement.js
│   │   │   ├── executeFunctionDeclaration.js
│   │   │   ├── executeIfStatement.js
│   │   │   ├── executeLabeledStatement.js
│   │   │   ├── executeProgram.js
│   │   │   ├── executeReturnStatement.js
│   │   │   ├── executeSwitchStatement.js
│   │   │   ├── executeThrowStatement.js
│   │   │   ├── executeTryStatement.js
│   │   │   ├── executeVariableDeclaration.js
│   │   │   └── executeWhileStatement.js
│   │   ├── modules/                  # ES Module Statement Evaluators
│   │   │   ├── evaluateExportAllDeclaration.js
│   │   │   ├── evaluateExportDefaultDeclaration.js
│   │   │   ├── evaluateExportNamedDeclaration.js
│   │   │   └── evaluateImportDeclaration.js
│   │   └── expressions/              # Expression Evaluators & Binary/Unary Operators
│   │       ├── evaluateArrayExpression.js
│   │       ├── evaluateArrowFunctionExpression.js
│   │       ├── evaluateAssignmentExpression.js
│   │       ├── evaluateBinaryExpression.js
│   │       ├── evaluateCallExpression.js
│   │       ├── evaluateChainExpression.js
│   │       ├── evaluateConditionalExpression.js
│   │       ├── evaluateExpression.js
│   │       ├── evaluateFunctionExpression.js
│   │       ├── evaluateIdentifier.js
│   │       ├── evaluateLiteral.js
│   │       ├── evaluateLogicalExpression.js
│   │       ├── evaluateMemberExpression.js
│   │       ├── evaluateNewExpression.js
│   │       ├── evaluateObjectExpression.js
│   │       ├── evaluateSequenceExpression.js
│   │       ├── evaluateTemplateLiteral.js
│   │       ├── evaluateThisExpression.js
│   │       ├── evaluateUnaryExpression.js
│   │       ├── evaluateUpdateExpression.js
│   │       ├── ShortCircuitError.js
│   │       └── operators/
│   │           ├── binaryOperators.js
│   │           └── unaryOperators.js
│   │
│   ├── runtime/                      # V8 MEMORY, ENVIRONMENT & CONTEXT LAYER
│   │   ├── createRuntimeBindings.js  # Scope binding population
│   │   ├── FunctionObject.js         # First-class function & closure scope object
│   │   ├── context/                  # Execution Context Factories
│   │   │   ├── createExecutionContext.js
│   │   │   └── createFunctionExecutionContext.js
│   │   ├── environment/              # Lexical Environments & Binding Storage
│   │   │   ├── constant.js
│   │   │   ├── createBinding.js
│   │   │   ├── createEnvironmentRecord.js
│   │   │   ├── createLexicalEnvironment.js
│   │   │   ├── getBindingValues.js
│   │   │   ├── resolveIdentifier.js
│   │   │   └── setBindingValues.js
│   │   ├── function/                 # Function Invocation & Parameter Binding
│   │   │   ├── bindDestructuring.js
│   │   │   ├── bindParameters.js
│   │   │   └── callFunction.js
│   │   └── heap/                     # Typed Memory Heap Allocation & GC
│   │       ├── allocateArray.js
│   │       ├── allocateObject.js
│   │       ├── getHeapValue.js
│   │       └── heap.js
│   │
│   └── visualization/                # VISUALIZATION STATE & SNAPSHOT LAYER
│       ├── snapshot/
│       │   └── SnapshotGenerator.js  # Pre-computes step snapshot state
│       └── store/
│           └── VisualizationStore.js # Subscription store for timeline playback
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SachinSinghPatwal/js_
   cd Js_Engine_Visualizer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## ⌨️ Keyboard Shortcuts & Quick Tips

- **`Esc`**: Instantly closes the Inspector Modal from anywhere in the application.
- **Click any Heap Address (`→ 0x0001`)**: Opens the V8 Inspector to view object properties, prototype chains, and promise states.
- **Hover Top Center**: Reveals the floating timeline playback control panel (Play, Pause, Step Back, Step Forward, Reset).
- **`Know More` Button**: Displays ECMAScript spec concepts, V8 execution details, and memory storage locations for the active step.

---

## 📄 Documentation

Detailed architectural documentation is available in the [`docs/`](./docs/) directory:
- 📖 [**`STRUCTURE.md`**](./docs/STRUCTURE.md) — Detailed runtime component breakdown and folder responsibilities.
- 📖 [**`DECISIONS.md`**](./docs/DECISIONS.md) — Architectural Decision Records (ADRs).
- 📖 [**`GLOSSARY.md`**](./docs/GLOSSARY.md) — ECMAScript & V8 terminology reference.
- 📖 [**`PIPELINE.md`**](./docs/PIPELINE.md) — Step-by-step code transformation pipeline.
- 📖 [**`ROADMAP.md`**](./docs/ROADMAP.md) — Project milestones and completed features.
