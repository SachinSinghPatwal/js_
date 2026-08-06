import { parseCode } from './src/engine/parser/parseCode.js';
import { buildScopeTree } from './src/engine/scope/scopeBuilder.js';
import { initializeRuntime } from './src/engine/initializeRuntime.js';

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
const runtime = initializeRuntime(scopeTree);

const globalBindings = runtime.globalExecutionContext.lexicalEnvironment.environmentRecord.bindings;
console.log('global has console', globalBindings.has('console'));
const aBinding = globalBindings.get('a');
console.log('aBinding', !!aBinding, aBinding?.initialized);
console.log('aFunctionObject', aBinding?.value, 'scope', aBinding?.value?.scope, 'captured', aBinding?.value?.capturedEnvironment);
console.log('captured outer console', aBinding?.value?.capturedEnvironment?.bindings?.has('console'));
