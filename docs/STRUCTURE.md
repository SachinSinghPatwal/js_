# JavaScript Execution Visualizer Architecture

## Goal

# JavaScript Execution Visualizer

An educational JavaScript execution engine that visualizes how JavaScript executes code.

The project models runtime concepts such as:

- Scope Tree
- Execution Contexts
- Lexical Environments
- Environment Records
- Hoisting
- TDZ
- Function Calls
- Closures
- Event Loop

The goal is educational correctness rather than implementing the entire ECMAScript specification.

---

# High-Level Pipeline

Source Code
    ↓
Formatter (Optional)
    ↓
Parser
    ↓
AST
    ↓
Scope Builder
    ↓
Execution Context Creation
    ↓
Memory Creation
    ↓
Execution
    ↓
Event Loop Simulation

---

# Major Components

## Editor

Responsibilities

- Accept user code
- Format code
- Highlight syntax

---

## Parser

Responsibilities

- Convert source code into an AST.
- Report syntax errors.

Does NOT

- Execute code
- Resolve identifiers

---

## Scope Builder

Responsibilities

- Create lexical scopes.
- Register declarations.
- Build the scope hierarchy.

Does NOT

- Execute expressions
- Resolve identifier references
- Create runtime memory

---

## Execution Context Builder

Responsibilities

- Create runtime execution contexts.
- Build lexical environments.

---

## Memory Creation

Responsibilities

- Create bindings.
- Apply hoisting rules.
- Initialize function bindings.
- Leave let/const in TDZ.

---

## Execution Engine

Responsibilities

- Execute statements.
- Evaluate expressions.
- Resolve identifiers.
- Update runtime memory.

---

## Event Loop

Responsibilities

- Simulate Call Stack
- Microtask Queue
- Macrotask Queue
- Timers