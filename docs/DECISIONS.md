# Architectural Decision Records (ADRs)

## Decision 000 — Source of Truth
- **Status**: LOCKED
- **Decision**: The documents inside `/docs` are the project's source of truth. If chat explanations conflict, these documents take precedence.
- **Reason**: Prevents architectural drift across conversations and maintains technical consistency.

---

## Decision 001 — V8 Engine Simulation Over Compiler
- **Status**: LOCKED
- **Decision**: This project simulates JavaScript engine (V8) runtime execution and Host Environment (Browser / Node.js) interactions instead of acting as a compiler.
- **Reason**: Educational correctness over visual simplicity.

---

## Decision 002 — AST Parser
- **Status**: LOCKED
- **Decision**: Use Acorn to convert JavaScript source code into an ESTree-compliant Abstract Syntax Tree.

---

## Decision 003 — AST Traversal
- **Status**: LOCKED
- **Decision**: Use `acorn-walk` for recursive AST node traversal.

---

## Decision 004 — Scope Blueprint
- **Status**: LOCKED
- **Decision**: Scopes are built statically before execution into a Scope Tree hierarchy containing parent/children references and static declaration metadata.

---

## Decision 005 — Environment Record Storage
- **Status**: LOCKED
- **Decision**: Variable and function bindings inside Environment Records are stored using JavaScript `Map` data structures for $O(1)$ lookup.

---

## Decision 006 — Execution Context Architecture
- **Status**: LOCKED
- **Decision**: Every Execution Context owns an `id`, `thisBinding` (which lives inside the EC, not in the heap), an `outerReference` (linking scope chain), and references to a Lexical Environment and Variable Environment.

---

## Decision 007 — Identifier Resolution Strategy
- **Status**: LOCKED
- **Decision**: Identifiers are resolved at runtime by traversing the active Lexical Environment chain (`outerReference`). The static Scope Tree is never consulted during runtime variable lookup.

---

## Decision 008 — Typed Memory Heap Architecture
- **Status**: LOCKED
- **Decision**: All non-primitive reference values (Objects, Functions, Promises, Arrays, Closures) are allocated in a typed Heap with address pointers (`0x0001`, `0x0002`).
- **Reason**: Accurately models V8 memory pointers vs. primitive stack bindings.

---

## Decision 009 — Function Closures & [[Environment]] Pointer
- **Status**: LOCKED
- **Decision**: Function objects created in the Heap store a hidden `[[Environment]]` reference to their outer declaration scope. When called, the new Function EC's `outerReference` points to `[[Environment]]`.

---

## Decision 010 — Phase-by-Phase Event Loop Simulation
- **Status**: LOCKED
- **Decision**: The Event Loop is modeled as a formal step pipeline: `CHECK_STACK_EMPTY` ➔ `DRAIN_MICROTASKS` ➔ `RENDER_OPPORTUNITY` ➔ `TAKE_MACROTASK` ➔ `CREATE_EC`.
- **Reason**: Teaches users that microtasks drain to completion before rendering and before macrotasks execute.

---

## Decision 011 — Host Environment Separation
- **Status**: LOCKED
- **Decision**: Web APIs (`setTimeout`, `fetch`, `console`) live inside the Host Environment container, separate from the V8 Engine Core.

---

## Decision 012 — Console Output Line Numbering
- **Status**: LOCKED
- **Decision**: Console output entries capture `line: runtime.currentNode.loc.start.line` from the active AST node and render line numbers (`Line 5`) in the output panel.

---

## Decision 013 — Inspector Modal Circular Reference Protection
- **Status**: LOCKED
- **Decision**: `EntityDetailsModal.jsx` uses a `Set` tracking mechanism and max depth limit (`depth > 5`) in `RenderJSONTree` to prevent infinite recursion freezes during live playback.

---

## Decision 014 — Keyboard Accessibility (Esc Dismiss)
- **Status**: LOCKED
- **Decision**: A global `window.addEventListener('keydown')` listener closes the Entity Details Modal when `Escape` is pressed.

---

## Decision 015 — Strict Panel Drag Constraints & Guard Overlays
- **Status**: LOCKED
- **Decision**: All application panels enforce strict `minSize` percentage limits in `react-resizable-panels` (`Editor 28%`, `Stage/Stack 32%`, `Heap/Queues 24%`) combined with `PanelWidthGuard` dual `ResizeObserver` overlays using `whitespace-nowrap` text protection.
- **Reason**: Prevents windows from breaking or shrinking into paper-thin columns.