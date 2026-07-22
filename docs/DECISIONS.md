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