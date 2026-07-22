# JavaScript Execution Visualizer Architecture

## Goal

Build a JavaScript execution visualizer that closely models how a JavaScript engine executes code.

This project prioritizes educational correctness over implementation shortcuts.

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