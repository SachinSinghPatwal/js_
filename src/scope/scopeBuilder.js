import * as walk from "acorn-walk";
import { createScope } from "./scope.js";
import { registerDeclaration } from "./registerDeclaration.js";

export function buildScopeTree(ast) {
  const globalScope = createScope("Global");

  walk.recursive(ast, globalScope, {
    VariableDeclaration(node, state) {
      for (const declaration of node.declarations) {
        if (declaration.id.type === "Identifier") {
          registerDeclaration(state, declaration.id.name, node.kind);
        }
      }
    },

    FunctionDeclaration(node, state, c) {
      // Register function name in parent scope
      registerDeclaration(state, node.id.name, "function", node);

      // Create a new function scope
      const functionScope = createScope("Function", state);

      // Connect it to its parent
      state.children.push(functionScope);

      // Register parameters inside the function scope
      for (const param of node.params) {
        if (param.type === "Identifier") {
          registerDeclaration(functionScope, param.name, "parameter");
        }
      }

      // Continue traversing using the function scope
      for (const statement of node.body.body) {
        c(statement, functionScope);
      }
    },

    BlockStatement(node, state, c) {
      const blockScope = createScope("Block", state);

      state.children.push(blockScope);

      for (const statement of node.body) {
        c(statement, blockScope);
      }
    },
  });

  return globalScope;
}
