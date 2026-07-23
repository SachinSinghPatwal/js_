# Project File Structure and Responsibilities

```text
src/
├── App.jsx
├── index.css
├── main.jsx
├── components/
│   └── Editor/
│       ├── CodeEditor.jsx
│       ├── decorations/
│       │   ├── executing.js
│       │   ├── heap.js
│       │   ├── scope.js
│       │   └── variable.js
│       └── Theme/
│           ├── dark26.json
│           ├── index.js
│           └── registerTheme.json
├── engine/
│   └── createRuntime.js
├── execution/
│   ├── execute.js
│   ├── executeBlockStatement.js
│   ├── executeExpressionStatement.js
│   ├── executeFunctionDeclaration.js
│   ├── executeNode.js
│   ├── executeProgram.js
│   ├── executeVariableDeclaration.js
│   └── expressions/
│       ├── evaluateAssignmentExpression.js
│       ├── evaluateBinaryExpression.js
│       ├── evaluateCallExpression.js
│       ├── evaluateExpression.js
│       ├── evaluateIdentifier.js
│       ├── evaluateLiteral.js
│       └── operators/
│           └── binaryOperators.js
├── formatter/
│   └── formatCode.js
├── hooks/
├── memory/
│   └── createRuntimeBindings.js
├── parser/
│   └── parseCode.js
├── runtime/
│   ├── constant.js
│   ├── createBinding.js
│   ├── createEnvironmentRecord.js
│   ├── createExecutionContext.js
│   ├── createLexicalEnvironment.js
│   ├── FunctionObject.js
│   ├── getBindingValues.js
│   ├── resolveIdentifier.js
│   ├── setBindingValues.js
│   └── function/
│       ├── bindParameters.js
│       ├── callFunction.js
│       └── createFunctionExecutionContext.js
├── scope/
│   ├── registerDeclaration.js
│   ├── scope.js
│   └── scopeBuilder.js
├── store/
├── traverser/
│   └── traverseAST.js
└── utils/
```

## Root files

| File | Responsibility |
|---|---|
| `App.jsx` | Root React component for the application. |
| `main.jsx` | React application entry point. |
| `index.css` | Global application styles. |

## Components

| File or folder | Responsibility |
|---|---|
| `components/Editor/CodeEditor.jsx` | Displays and manages the code editor. |
| `components/Editor/decorations/` | Adds execution, heap, scope, and variable visualizations to the editor. |
| `components/Editor/Theme/` | Defines and registers editor themes. |

## Engine and execution

| File or folder | Responsibility |
|---|---|
| `engine/createRuntime.js` | Creates the JavaScript runtime. |
| `execution/` | Executes AST nodes and statements. |
| `execution/expressions/` | Evaluates expressions. |
| `execution/expressions/operators/` | Implements binary operators. |

## Parser and formatter

| File | Responsibility |
|---|---|
| `parser/parseCode.js` | Converts JavaScript source code into an AST. |
| `formatter/formatCode.js` | Formats JavaScript source code. |

## Memory and scope

| File or folder | Responsibility |
|---|---|
| `memory/createRuntimeBindings.js` | Creates initial runtime bindings. |
| `scope/scope.js` | Defines scope data. |
| `scope/scopeBuilder.js` | Builds scopes from the AST. |
| `scope/registerDeclaration.js` | Registers declarations in scopes. |

## Runtime

| File | Responsibility |
|---|---|
| `runtime/createBinding.js` | Creates variable or function bindings. |
| `runtime/createEnvironmentRecord.js` | Stores bindings for an environment. |
| `runtime/createLexicalEnvironment.js` | Creates lexical environments and outer-environment links. |
| `runtime/createExecutionContext.js` | Creates execution contexts. |
| `runtime/FunctionObject.js` | Represents a function and its captured lexical environment. |
| `runtime/resolveIdentifier.js` | Resolves identifiers through the environment chain. |
| `runtime/getBindingValues.js` | Reads binding values. |
| `runtime/setBindingValues.js` | Updates binding values. |
| `runtime/function/bindParameters.js` | Binds function arguments to parameters. |
| `runtime/function/callFunction.js` | Executes a function call. |
| `runtime/function/createFunctionExecutionContext.js` | Creates a function's local execution environment. |

## Traversal, state, and utilities

| File or folder | Responsibility |
|---|---|
| `traverser/traverseAST.js` | Traverses AST nodes. |
| `store/` | Contains application state management. |
| `hooks/` | Contains reusable React hooks. |
| `utils/` | Contains shared utility functions. |