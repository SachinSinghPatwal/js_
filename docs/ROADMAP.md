# Project Roadmap & Completed Milestones

## Phase 1 — Code Editor & Design System
- [x] Monaco Editor integration with syntax highlighting
- [x] VS Code Dark theme (`#1e1e1e` / `#252526` / `#2d2d2d` / `#e2b714`)
- [x] Automatic line wrapping (`wordWrap: "on"`) and custom dark scrollbars
- [x] Prettier code formatter integration

## Phase 2 — Parsing & Scope Blueprint
- [x] Acorn ESTree AST Parser
- [x] AST Traversal algorithms
- [x] Static Scope Tree Builder (Global, Function, Block scopes)

## Phase 3 — V8 Execution Context Architecture
- [x] Execution Context creation with unique `id`
- [x] Lexical Environment & Variable Environment separation
- [x] Explicit `thisBinding` pointer
- [x] Scope chain outer reference (`outerReference`)

## Phase 4 — Memory Allocation & Hoisting
- [x] Environment Record binding creation
- [x] Variable Hoisting (`var` initialized to `undefined`)
- [x] Temporal Dead Zone (TDZ) for `let` and `const`
- [x] Function declaration hoisting

## Phase 5 — Execution Engine & Expression Evaluation
- [x] Bytecode statement execution driver (`executeNode.js`)
- [x] Identifier resolution along `outerReference` chain
- [x] Expression evaluators (call, binary, assignment, literal)
- [x] Function call parameter binding

## Phase 6 — Typed Memory Heap & Closures
- [x] Memory Heap with address allocation (`0x0001`, `0x0002`)
- [x] Type-tagged memory objects (`Object`, `Function`, `Array`, `Promise`, `ClosureContext`)
- [x] Function objects with captured `[[Environment]]` scope pointers
- [x] Mark-and-Sweep Garbage Collection simulation

## Phase 7 — Event Loop & Host Environment
- [x] Browser Host / Node.js Host environment separation
- [x] Phase-by-phase Event Loop driver (`CHECK_STACK_EMPTY`, `DRAIN_MICROTASKS`, `RENDER_OPPORTUNITY`, `TAKE_MACROTASK`)
- [x] Microtask Queue (`PromiseReactionJob`)
- [x] Macrotask Queue (`TimerTask`)
- [x] Console stdout/stderr with source line numbers (`Line 5`)

## Phase 8 — User Interface & Panel Ergonomics
- [x] Floating hover timeline controls (Play, Pause, Step Back, Step Forward, Reset)
- [x] Centered Execution Stage with `Know More` inspector button
- [x] Entity Details Inspector Modal with circular reference protection and `Esc` key dismiss
- [x] Strict panel drag boundaries (`minSize`) and responsive `ResizeObserver` width/height guards

---

## Out of Scope

The following features are intentionally excluded unless a future roadmap explicitly includes them:

- Full ECMAScript spec compliance
- Native JIT compiler / TurboFan optimization
- Native Assembly generation
- Raw C++ V8 C++ API bindings