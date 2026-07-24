import { parseCode } from "../src/parser/parseCode.js";
import { buildScopeTree } from "../src/scope/scopeBuilder.js";
import { initializeRuntime } from "../src/engine/initializeRuntime.js";
import { execute } from "../src/execution/execute.js";

const code = `
console.log("1. Sync start");

setTimeout(() => {
  console.log("6. Macrotask (setTimeout)");
  Promise.resolve().then(() => {
    console.log("7. Microtask inside Macrotask");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask 1");
}).then(() => {
  console.log("4. Microtask 2");
});

new Promise((resolve) => {
  console.log("2. Sync inside Promise constructor");
  resolve();
}).then(() => {
  console.log("5. Microtask 3");
});
`;

console.log("--- Starting Engine Simulation ---");
const ast = parseCode(code);
const scopeTree = buildScopeTree(ast);
const runtime = initializeRuntime(scopeTree);
execute(ast, runtime);
console.log("--- Engine Simulation Complete ---");
