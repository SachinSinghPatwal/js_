# JavaScript Engine Visualizer - Complete Project Explanation

## 🎯 Project Overview

**What it is:** An educational V8 JavaScript runtime simulator with interactive visualization.

**Primary Goal:** Reveal hidden JavaScript engine internals with step-by-step execution transparency, showing:
- How Execution Contexts and Scopes resolve
- Where values actually live (primitives vs. heap references)
- How Closures capture scope via `[[Environment]]` pointers
- Event Loop phases and Microtask/Macrotask queues
- Temporal Dead Zone (TDZ) behavior
- Memory management and reference counting

**Key Philosophy:** Educational correctness over visual simplicity.

---

## 🏗️ Architecture: Two-Layer Separation

```
┌─────────────────────────────────────────────────────────────┐
│           VISUALIZER UI LAYER (React Components)            │
│    - Monaco Editor, Panels, Interactive Inspector Modal      │
│    - Resizable layout with theme customization              │
│    - Timeline playback and step navigation                  │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│     VISUALIZATION STORE (State Management & Timeline)        │
│    - Pre-computed snapshots for every execution step        │
│    - Subscription-based state dispatch                      │
│    - Modal inspector state management                       │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│       INTERPRETER CORE & RUNTIME LAYER (V8 Simulator)       │
│    - AST Parser, Scope Builder, Execution Engine            │
│    - Memory Heap, Environment Records, Call Stack           │
│    - Event Loop, Microtask/Macrotask Queues                 │
│    - Built-in functions (console, setTimeout, Promise)      │
└──────────────────────────────────────────────────────────────┘
```

**Key Principle:** The UI layer consumes READ-ONLY snapshots; the runtime layer doesn't know about visualization. Perfect separation of concerns.

---

## 🔄 Complete Execution Pipeline (10 Stages)

```
1. Source Code Input (Monaco CodeEditor)
   ↓ User writes JavaScript code in editor
   
2. Optional Formatting (Prettier formatCode API)
   ↓ User clicks "Format" to beautify code
   
3. Code Parsing (Acorn Parser → ESTree AST)
   ↓ parseCode.js converts string to abstract syntax tree
   
4. Scope Building (Static Scope Tree Blueprint)
   ↓ scopeBuilder.js walks AST, creates scope hierarchy
   
5. Runtime Initialization (Global EC & Heap Allocation)
   ↓ initializeRuntime.js allocates global object at address 0x0000
   
6. Sync AST Execution Driver (executeNode.js → Bytecode Interpreter)
   ↓ Line-by-line statement execution with binding updates
   
7. Host API & Event Loop Simulation (Web APIs → Micro/Macrotask Queues)
   ↓ Simulates browser/Node.js async operations
   
8. Snapshot Generator (Pre-computed State Array)
   ↓ createSnapshot() captures entire runtime state at each step
   
9. Visualization Store (Subscription Dispatch & Step Control)
   ↓ VisualizationStore notifies subscribed components
   
10. React UI & Resizable Panels (Execution Stage, Call Stack, Heap, Queues, Console)
    ↓ Components re-render with latest snapshot data
```

---

## 📋 Detailed Pipeline Stages

### Stage 1: **Parsing** (`src/engine/parser/parseCode.js`)
- **Input:** JavaScript source code string (from Monaco Editor)
- **Process:** Acorn parser converts to ESTree-compliant AST
- **Output:** AST with location annotations (`loc.start.line`, `loc.start.column`)
- **Example:**
  ```javascript
  "let x = 5;" → AST node: { type: "VariableDeclaration", kind: "let", declarations: [...] }
  ```

### Stage 2: **Scope Building** (`src/engine/scope/scopeBuilder.js`)
- **Input:** AST
- **Process:** Walk AST with `acorn-walk`, create scope hierarchy:
  - `GlobalScope` for top-level
  - `FunctionScope` for each function
  - `BlockScope` for `{...}` blocks (with `let`/`const`)
- **Output:** Scope tree with declaration registrations
- **Attached to AST:** Each function/block node gets `.scope` property for runtime

### Stage 3: **Runtime Initialization** (`src/engine/initializeRuntime.js`)
- **Creates:**
  1. `GlobalObject` allocated in heap at address `0x0000`
  2. `Global Execution Context` with:
     - `thisBinding` → `0x0000` (global object)
     - `lexicalEnvironment` → Global environment record
  3. Pushes Global EC onto `executionContextStack`
  4. Populates bindings for global declarations
  5. Creates builtin objects (`Object`, `console`, `setTimeout`, `Promise`)

- **Runtime Object Structure:**
  ```javascript
  {
    executionContextStack,        // Stack of Execution Contexts
    globalExecutionContext,       // The global EC
    heap,                         // Memory heap object
    microtaskQueue: [],          // Promise .then() jobs
    macrotaskQueue: [],          // setTimeout callbacks
    webAPIs: new Map(),          // Timers pending in browser
    consoleLogs: [],             // console.log history
    globalObjectAddress,         // 0x0000
    eventLoop: {                 // Event loop phase tracker
      phase: 'IDLE',
      currentPhaseStep: null
    },
    onStep: callback             // Called after each step for snapshots
  }
  ```

### Stage 4: **Memory Binding Creation**
- Registers `var`, `let`, `const`, and `function` declarations
- **Key Detail:** `let`/`const` bindings start in **Temporal Dead Zone (TDZ)** state
- Bound in `executionContextStack[0].lexicalEnvironment.environmentRecord`

### Stage 5: **Execution & Event Loop Driver** (`src/execution/execute.js`)
- **Synchronous Phase:** Execute all statements in Global EC
  1. Call `executeNode()` for each statement
  2. Each statement updates bindings and allocates heap objects
  3. After sync code, pop Global EC

- **Event Loop Phases:** While queues have tasks:
  1. `CHECK_STACK_EMPTY` → Verify execution context stack is empty
  2. `DRAIN_MICROTASKS` → Process all microtasks (Promise reactions)
  3. `RENDER_OPPORTUNITY` → Browser render checkpoint (visual only)
  4. `TAKE_MACROTASK` → Dequeue one macrotask (setTimeout)
  5. `CREATE_EC` → Create function execution context
  6. `EXECUTE` → Run callback, which may queue more tasks

- **Key:** After each phase transition, `runtime.onStep()` is called to capture snapshot

### Stage 6: **Snapshot Generation** (`src/visualization/snapshot/SnapshotGenerator.js`)
- **When:** Called by `runtime.onStep()` after every step
- **What:** `createSnapshot(step, currentNode, runtime)` deep clones entire runtime:
  - Execution context stack with all environments
  - Heap memory with all objects
  - Microtask/macrotask queues
  - Event loop phase
  - Console logs
  - Closure events

- **Categorization:** Also calls `heap.getAllCategorized()` to group heap objects:
  - Objects, Functions, Arrays, Promises, Maps, Sets, ClosureContexts

- **Output:** Immutable snapshot object stored in array

### Stage 7: **Visualization Store** (`src/visualization/store/VisualizationStore.js`)
- **Central State Manager:** Singleton store managing all visualization state
- **Snapshots Array:** Grows during execution with immutable snapshots
- **Step Navigation:**
  - `nextStep()` → Move timeline forward
  - `prevStep()` → Move timeline backward
  - `jumpToStep(n)` → Jump to specific step
  
- **Subscriber Notify:** After state change, calls all listeners
  - React components subscribed via `subscribe(listener)`
  - Components re-render with `getSnapshot()` data

- **Modal State:** Tracks which heap object or stack frame is inspected

### Stage 8: **React UI Rendering** (`src/components/`)
- **App.jsx:** Main container with resizable panel layout
  - Uses `react-resizable-panels` for drag-handle resizing
  - Panel minimum size constraints prevent distortion

- **Subscribed Components:** Each panel subscribes to `VisualizationStore`
  - `CodeEditor` → Highlights active line
  - `CallStackPanel` → Shows execution context stack with environment records
  - `HeapPanel` → Categorized object view
  - `EventLoopPanel` → Phase pipeline visualization
  - `MicroQueuePanel`, `MacroQueuePanel` → Task queue viewers
  - `ConsolePanel` → console.log output with line numbers
  - `ExecutionStagePanel` → Flow badge and "Know More" inspector button

---

## 🧠 Runtime Internals: How Everything Works

### A. Execution Contexts & Scope Chains

**Execution Context = Activation Record**
```javascript
{
  type: 'global' | 'function' | 'eval',
  id: unique_number,
  
  // References outer scopes
  lexicalEnvironment: {
    scope: scopeNode,
    outer: parentLexicalEnvironment,
    environmentRecord: {
      bindings: Map<string, Binding>
    }
  },
  
  // Separate for `var` (hoisting)
  variableEnvironment: {
    scope: scopeNode,
    outer: parentVariableEnvironment,
    environmentRecord: {...}
  },
  
  // `this` binding for function/method calls
  thisBinding: heapAddress,
  
  // Whether this EC is on the call stack
  onCallStack: boolean
}
```

**Scope Resolution:** To find variable `x`:
1. Check current environment record bindings
2. Follow `outer` pointer to parent environment
3. Repeat until found or reach global (error if not found)

### B. Memory Heap & References

**Primitive Values:** Stored inline in bindings
```javascript
Binding {
  name: 'x',
  value: 5,           // Primitives stored directly
  initialValue: undefined,
  mutable: true
}
```

**Objects/Arrays/Functions:** Stored in heap with reference pointers
```javascript
// Binding stores an ADDRESS (number like 0x0001)
Binding {
  name: 'obj',
  value: 0x0001       // Heap address
}

// Heap at address 0x0001
heap.get(0x0001) = {
  type: 'Object',
  properties: {
    foo: 'bar',
    baz: 0x0002       // Can reference other objects
  }
}
```

**Metadata Tracking:**
```javascript
heap.metadata.get(0x0001) = {
  typeTag: 'Object',           // Type categorization
  reachable: true,             // Mark-and-sweep GC
  references: Set([0x0002])    // Outgoing references
}
```

### C. Closures & `[[Environment]]` Pointers

**Function Object Creation** (`src/runtime/FunctionObject.js`):
```javascript
new FunctionObject(astNode, scopeTree, {
  capturedEnvironment: currentLexicalEnvironment,  // ← [[Environment]] pointer
  isArrow: true/false,
  capturedThisValue: thisValue
})
```

**When Function Declared:** Captures current lexical environment as closure scope.

**When Function Called:**
1. Create new execution context
2. Set its outer environment to the **captured** environment (not where it's called from)
3. This creates the scope chain for closures

**Example:**
```javascript
let global_x = 10;

function outer() {
  let outer_x = 20;
  
  function inner() {
    console.log(outer_x);  // Looks up scope chain via [[Environment]] pointer
  }
  
  return inner;
}

let fn = outer();
fn();  // 20 (closure still sees outer_x)
```

When `inner` is declared, it captures `outer`'s lexical environment. Even after `outer()` returns, `inner`'s `[[Environment]]` still points to `outer`'s environment record.

### D. Call Stack Visualization

```
ExecutionContextStack
├─ Global EC (0x0000)
│  ├─ lexicalEnvironment.environmentRecord
│  │  ├─ x: 5
│  │  ├─ fn: 0x0001
│  │  └─ Object: 0x0002
│  └─ thisBinding: 0x0000
│
├─ Function EC: 'fn' (0x0003)
│  ├─ lexicalEnvironment.environmentRecord
│  │  ├─ y: 'hello'
│  │  └─ this: 0x0004
│  └─ thisBinding: 0x0004
│
└─ (innermost on top)
```

### E. Event Loop Architecture

**Browser Event Loop:**
```
while (microtaskQueue.length > 0 || macrotaskQueue.length > 0) {
  // 1. Check stack empty
  if (executionContextStack.length === 1) {  // Only global
    // 2. Drain ALL microtasks (Promise .then callbacks)
    while (microtaskQueue.length > 0) {
      job = microtaskQueue.shift();
      executeCallback(job.callback);
    }
    
    // 3. Render opportunity (browser only)
    if (browser) { renderScreen(); }
  }
  
  // 4. Take one macrotask (setTimeout callback)
  if (macrotaskQueue.length > 0) {
    task = macrotaskQueue.shift();
    executeCallback(task.callback);
  }
}
```

**Key Insight:** Microtasks always run before rendering and before next macrotask.

### F. Built-in Functions

#### `console.log()`
- Tracked in `runtime.consoleLogs[]` array
- Each log includes:
  - Message content
  - Line number where `console.log` was called
  - Timestamp (step number)
- Displayed in `ConsolePanel` with line numbers

#### `setTimeout(callback, delay)`
- Adds timer to `runtime.webAPIs` Map (pending timers)
- Creates `MacroTask` in `macrotaskQueue`
- Simulates browser timer with immediate callback (no real delay in simulator)

#### `Promise.then(onFulfilled, onRejected)`
- Adds `PromiseReactionJob` to `microtaskQueue`
- Jobs execute after current sync script completes
- Creates new function execution context for callback

---

## 🎬 Animation & Visualization How It Works

### 1. **Active Line Highlighting**
- `CodeEditor` component has Monaco Editor with decorations
- `src/components/editor/decorations/` adds `activeLineNumber` decorator
- When step changes, line highlighting updates
- Triggered by `VisualizationStore.subscribe()`

### 2. **Timeline Playback**
- `TimelineControls.jsx` has play/pause buttons and progress bar
- `PlaybackControls.jsx` manages playback speed (0.5x, 1x, 2x, etc.)
- `useTimelinePlayback.js` hook handles stepping through snapshots
- `TimelineProgressBar.jsx` shows current position in execution

### 3. **Dynamic Panel Updates**
- All panels subscribe to `VisualizationStore`
- When snapshot changes, components re-render
- React Framer Motion optional for smooth transitions
- No expensive DOM queries; data-driven updates

### 4. **Interactive Inspector Modal**
- Click any object/function on heap or stack frame
- `EntityDetailsModal.jsx` opens with tree inspector
- Shows properties, nested objects, function scope chain
- Circular reference safety prevents infinite recursion

### 5. **Resizable Panels**
- `react-resizable-panels` library with drag handles
- Min/max size constraints prevent distortion
- `PanelWidthGuard.jsx` enforces minimum widths with ResizeObserver
- Layout state persists across re-renders

---

## 📂 File Organization & Responsibilities

### `src/components/` (Visualizer UI - 10 subfolders)
- **`common/`** → Reusable widgets (panel guards, resize handles)
- **`editor/`** → Monaco editor integration with decorations
- **`layout/`** → Top-level layout containers
- **`runtime-panels/`** → Domain-specific inspection panels:
  - `call-stack/` → Execution context cards
  - `console/` → console.log output
  - `event-loop/` → Phase pipeline
  - `execution-stage/` → Flow badge & inspector
  - `heap/` → Memory object categorizer
  - `modal/` → Inspector tree viewer
  - `queues/` → Task queue displays
- **`timeline/`** → Playback controls

### `src/engine/` (Interpreter Subsystems)
- **`initializeRuntime.js`** → Runtime bootstrapping
- **`builtins/`** → Native implementations (console, setTimeout, Promise)
- **`parser/`** → Acorn AST parsing
- **`scope/`** → Static scope tree builder
- **`formatter/`** → Prettier code formatting

### `src/execution/` (AST Execution - 50+ files)
- **`execute.js`** → Event loop driver
- **`executeNode.js`** → Statement dispatcher
- **`statements/`** → 20+ statement handlers
- **`expressions/`** → 20+ expression evaluators
- **`modules/`** → ES module imports/exports
- **`operators/`** → Binary/unary operator logic

### `src/runtime/` (V8 Memory & Environment)
- **`createRuntimeBindings.js`** → Populate bindings
- **`FunctionObject.js`** → First-class function
- **`environment/`** → Lexical environment & records
- **`context/`** → Execution context factories
- **`function/`** → Function calls & parameter binding
- **`heap/`** → Memory allocation & GC
- **`callStack/`** → Execution context stack

### `src/visualization/` (Snapshot & State)
- **`snapshot/SnapshotGenerator.js`** → Deep clone runtime
- **`store/VisualizationStore.js`** → Central state manager

---

## 🔄 Data Flow Example: Simple Variable Declaration

```javascript
// User code
let x = 5;
console.log(x);
```

**Step-by-Step Flow:**

1. **Parsing** → AST nodes created
2. **Scope Building** → `x` registered in GlobalScope
3. **Runtime Init** → Global EC created, pushed to stack
4. **Execute `VariableDeclaration`** → `executeVariableDeclaration.js`
   - Create binding for `x` in global environment
   - Binding state: TDZ (Temporal Dead Zone)
5. **Execute Initializer** → `evaluateLiteral(5)`
   - Returns primitive `5`
6. **Bind Value** → `setBindingValue('x', 5)`
   - Updates binding in environment record
7. **Snapshot 1** → `createSnapshot()` captures this state
   - Global EC with `x: 5` binding
   - Heap with global object at 0x0000
   - Event loop phase: EXECUTING_SYNC
8. **Store Notifies** → `VisualizationStore.notify()`
9. **UI Re-renders** → Components subscribe and update
   - CodeEditor highlights `let x = 5;` line
   - CallStackPanel shows `x: 5` in global environment
   - ExecutionStagePanel shows "Variable declared" summary
10. **Execute `ExpressionStatement`** → `console.log(x)`
    - `evaluateCallExpression()` for function call
    - `evaluateIdentifier('x')` looks up scope chain, finds binding with value `5`
    - Call `console.log` builtin with argument `5`
11. **Console Builtin** → `src/engine/builtins/createConsole.js`
    - Adds to `runtime.consoleLogs[]` with line number
12. **Snapshot 2** → Captures console output
    - ConsolePanel displays "5" at Line 2

**User Interaction:** User clicks "Next" or presses spacebar
- `VisualizationStore.nextStep()` → currentStep++
- Components re-render with new snapshot
- Animation shows line moving to next statement

---

## 🎯 Key Insights & Design Decisions

### 1. **Immutable Snapshots**
- Pre-computed snapshot array makes stepping instant
- No re-execution on backward navigation
- Enables smooth timeline scrubbing

### 2. **Synchronous Bytecode Interpreter**
- No real async/await (uses simulated event loop)
- All execution is synchronous internally
- Snapshot captures state at each phase

### 3. **Heap as Source of Truth**
- Objects stored as heap addresses
- Bindings reference addresses, not objects directly
- Enables reference visualization

### 4. **Closure Capture on Declaration**
- `[[Environment]]` pointer captured when function is declared
- Not when function is called
- Critical for proper closure behavior

### 5. **Phase-Based Event Loop**
- Formal phases matching ECMAScript spec
- "Know More" inspector explains each phase
- Educational accuracy prioritized

### 6. **Deep Cloning for Snapshots**
- Entire runtime cloned (not shallow)
- Circular reference safety
- Heap metadata preserved

---

## 🚀 Execution Entry Points

**User Entry → React App:**
```
index.html
  ↓
main.jsx (React root)
  ↓
App.jsx (Main container)
  ↓
FloatingControlsHeader.jsx → "Execute" button
  ↓
execute() triggered on click
  ↓
CodeEditor.getValue() → Source string
  ↓
parseCode(source) → AST
  ↓
buildScopeTree(ast) → Scope tree
  ↓
initializeRuntime(scopeTree) → Runtime object
  ↓
execute(ast, runtime) → Event loop driver
  ↓
runtime.onStep() → createSnapshot()
  ↓
VisualizationStore.addSnapshot()
  ↓
UI Components re-render
```

---

## 💡 Learning Path Through Codebase

1. **Start:** [README.md](README.md) and this document
2. **Architecture:** [docs/STRUCTURE.md](docs/STRUCTURE.md)
3. **Pipeline:** [docs/PIPELINE.md](docs/PIPELINE.md)
4. **Main UI:** [src/App.jsx](src/App.jsx)
5. **Execution:** [src/execution/execute.js](src/execution/execute.js)
6. **Snapshots:** [src/visualization/snapshot/SnapshotGenerator.js](src/visualization/snapshot/SnapshotGenerator.js)
7. **Store:** [src/visualization/store/VisualizationStore.js](src/visualization/store/VisualizationStore.js)
8. **Panels:** [src/components/runtime-panels/](src/components/runtime-panels/) (any panel)
9. **Runtime:** [src/runtime/](src/runtime/) (environment, context, heap)
10. **Deep Dive:** Specific statement handler (e.g., [src/execution/statements/executeVariableDeclaration.js](src/execution/statements/executeVariableDeclaration.js))

---

## 🔗 Dependencies & Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 19 | Component-based UI |
| **Editor** | Monaco Editor | Code input with syntax highlighting |
| **Styling** | Tailwind CSS + custom dark theme | Layout and theming |
| **Panels** | react-resizable-panels | Draggable resizable layout |
| **Parser** | Acorn + acorn-walk | AST parsing and traversal |
| **Animation** | Framer Motion | Optional smooth transitions |
| **Icons** | Lucide React | UI icons |
| **Formatter** | Prettier | Code beautification |
| **Build** | Vite | Fast module bundler |

---

## 📊 Summary: What Happens When You Execute Code

1. **Parse** → Acorn converts string to AST
2. **Scope** → Walk AST, build scope hierarchy
3. **Init** → Allocate global object, execution context, builtins
4. **Execute** → Line-by-line statement execution
5. **Snapshot** → Deep clone runtime state after each step
6. **Store** → Central store manages snapshot array
7. **UI** → React components subscribe, re-render with snapshot data
8. **Animate** → Timeline controls step through snapshots
9. **Inspect** → Click objects to drill-down in modal inspector
10. **Learn** → See exactly how V8 works under the hood

---

## 🎓 Educational Value

This visualizer teaches:
- ✅ How scopes and closures actually work
- ✅ Where values live (stack vs. heap)
- ✅ How the event loop processes tasks
- ✅ Temporal Dead Zone and TDZ safety
- ✅ Function binding and `this` context
- ✅ Prototype chains and inheritance
- ✅ Garbage collection through reference counting
- ✅ Promise microtasks vs. setTimeout macrotasks
- ✅ Execution context creation and destruction
- ✅ How the JavaScript engine "thinks"

All through interactive, step-by-step visualization with exact source line tracking.
