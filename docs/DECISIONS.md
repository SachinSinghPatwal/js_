# Architectural Decisions

## Decision 000

Title

Source of Truth

Status

LOCKED

Decision

The documents inside /docs are the project's source of truth.

If an explanation in a chat conflicts with these documents, the documents take precedence unless a new decision explicitly updates them.

Reason

Prevents architectural drift across conversations and ensures consistency.

---

## Decision 001

Title

Project Type

Status

LOCKED

Decision

This project simulates JavaScript engine execution instead of acting as a compiler.

Reason

The primary goal is education.

---

## Decision 002

Title

AST Parser

Status

LOCKED

Decision

Use Acorn.

Reason

Fast, lightweight, ESTree compliant.

---

## Decision 003

Title

AST Traversal

Status

LOCKED

Decision

Use acorn-walk.

Reason

Cleaner recursive traversal.

---

## Decision 004

Title

Scope Representation

Status

LOCKED

Decision

Scopes are connected as a tree.

Each scope contains

- parent
- children
- bindings

---

## Decision 005

Title

Binding Storage

Status

LOCKED

Decision

Bindings are stored using Map.

Reason

O(1) lookup.

---

## Decision 006

Title

Function Body Block

Status

LOCKED

Decision

Function body does not create an extra Block scope.

Nested blocks do.

---

## Decision 007

Title

Identifier Resolution

Status

LOCKED

Decision

Identifiers are resolved during execution.

Not during scope building.

Reason

Matches JavaScript execution.

---

## Decision 008

Title

Expression Evaluation

Status

LOCKED

Decision

Expressions are never evaluated during scope building or memory creation.

Evaluation occurs only during execution.

## Decision 009

Title

Execution Context Ownership

Status

LOCKED

Decision

Execution Contexts reference the corresponding Scope Tree node.

They do not duplicate scopes or declarations.

Reason

The Scope Tree is the static blueprint.
Execution Contexts are runtime objects that operate on that blueprint.

## Decision 010

Title

Lexical Environment Ownership

Status

LOCKED

Decision

Each Execution Context owns exactly one Lexical Environment.

The Lexical Environment is a runtime object created from the corresponding Scope Tree node during execution.

Reason

Separates the static blueprint from runtime memory while matching JavaScript engine behavior.

Decision 011

Title

Environment Record Ownership

Status

LOCKED

Decision

Each Lexical Environment owns exactly one Environment Record.

The Environment Record stores runtime bindings created during Memory Creation.

Reason

Separates the runtime container (Lexical Environment) from the runtime storage (Environment Record).

Decision 011 — Environment Record Ownership
Problem

An Execution Context requires a runtime memory structure to store variable bindings created during the Memory Creation phase. The Scope Tree only contains static declaration metadata and cannot store runtime state.

Decision

Each Lexical Environment owns exactly one Environment Record.

The Environment Record is responsible for storing all runtime bindings belonging to that lexical scope.

Rationale
Keeps runtime data separate from static analysis.
Mirrors the ECMAScript execution model.
Every lexical scope has its own runtime storage.
Enables independent runtime state for nested scopes.
Consequences
Runtime bindings are stored only inside Environment Records.
The Scope Tree remains immutable after static analysis.
Nested scopes will naturally receive their own Environment Records.
Variable lookup will later operate through Environment Records instead of the Scope Tree.
Decision 012 — Identifier Resolution Strategy
Problem

During execution, the engine must resolve an identifier (for example, a) to its corresponding runtime binding. The Scope Tree contains declaration information but does not represent the current runtime state of variables.

Decision

Identifier resolution will always operate on the Lexical Environment chain by searching Environment Records. The Scope Tree will never be consulted during runtime variable lookup.

Rationale
The Scope Tree is a static blueprint generated during analysis.
Runtime values exist only inside Environment Records.
Walking the Lexical Environment chain (outer) accurately models JavaScript lexical scoping.
This design aligns with the ECMAScript specification and cleanly separates static analysis from execution.
Consequences
Every variable read or write begins by resolving a binding through the current Lexical Environment.
Nested scope lookup is implemented by traversing the outer chain.
Runtime execution remains independent of the parser and scope builder.
Features such as closures, block scope, shadowing, and TDZ naturally build on the same identifier resolution algorithm.