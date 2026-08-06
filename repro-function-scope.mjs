import { parseCode } from './src/engine/parser/parseCode.js';
import { buildScopeTree } from './src/engine/scope/scopeBuilder.js';

const code = `console.log("1. Sync Start");
function a() {
  console.log("2. Inside a()");
  Promise.resolve().then(() => console.log("4. Microtask from a()"));

  function b() {
    setTimeout(() => {
      console.log("5. Macrotask (setTimeout)");
      Promise.resolve().then(() => {
        console.log("6. Microtask inside Macrotask");
      });
    }, 5000);
  }

  b();
}
a();
console.log("3. Sync End");`;

const ast = parseCode(code);
const scopeTree = buildScopeTree(ast);

function inspectScope(scope, depth = 0) {
  const indent = ' '.repeat(depth * 2);
  for (const [name, variable] of scope.variables) {
    if (variable.kind === 'function') {
      console.log(`${indent}${name}: kind=${variable.kind} fnScope=${Boolean(variable.functionScope)} nodeType=${variable.node?.type}`);
      if (!variable.functionScope) {
        console.log(`${indent}  -> MISSING functionScope for function ${name}`);
      }
    }
  }
  for (const child of scope.children) {
    inspectScope(child, depth + 1);
  }
}

inspectScope(scopeTree);
