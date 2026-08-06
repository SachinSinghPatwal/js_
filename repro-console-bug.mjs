import { parseCode } from './src/engine/parser/parseCode.js';
import { buildScopeTree } from './src/engine/scope/scopeBuilder.js';
import { initializeRuntime } from './src/engine/initializeRuntime.js';
import { execute } from './src/execution/execute.js';

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

try {
  const ast = parseCode(code);
  const scopeTree = buildScopeTree(ast);
  console.log('scopeTree OK', !!scopeTree, typeof scopeTree.variables, scopeTree.variables?.size);
  const runtime = initializeRuntime(scopeTree);
  execute(ast, runtime);
  console.log('done', runtime.consoleLogs.length, runtime.consoleLogs.map(l => l.args));
} catch (err) {
  console.error('REPRO ERROR', err);
  console.error(err.stack);
}
