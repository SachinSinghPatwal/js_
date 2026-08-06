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

function findArrow(node) {
  if (!node || typeof node !== 'object') return null;
  if (node.type === 'ArrowFunctionExpression') return node;
  for (const key of Object.keys(node)) {
    const child = node[key];
    if (Array.isArray(child)) {
      for (const c of child) {
        const found = findArrow(c);
        if (found) return found;
      }
    } else {
      const found = findArrow(child);
      if (found) return found;
    }
  }
  return null;
}

const arrow = findArrow(ast);
console.log('arrow exists', !!arrow);
console.log('arrow.scope', arrow?.scope);
console.log('arrow.params', arrow?.params?.map(p => p.type));
