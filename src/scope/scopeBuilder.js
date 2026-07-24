import * as walk from "acorn-walk";
import { createScope } from "./scope.js";
import { registerDeclaration } from "./registerDeclaration.js";

export function buildScopeTree(ast) {
  const globalScope = createScope("Global");

  walk.recursive(ast, globalScope, {
    VariableDeclaration(node, state) {
      for (const declaration of node.declarations) {
        extractPatternNames(declaration.id).forEach((name) => {
          registerDeclaration(state, name, node.kind);
        });
      }
    },

    FunctionDeclaration(node, state, c) {
      const functionScope = createScope("Function", state);
      registerDeclaration(state, node.id.name, "function", node, functionScope);
      state.children.push(functionScope);
      node.scope = functionScope; // Attach for runtime

      for (const param of node.params) {
        extractPatternNames(param).forEach((name) => {
          registerDeclaration(functionScope, name, "parameter");
        });
      }

      for (const statement of node.body.body) {
        c(statement, functionScope);
      }
    },

    FunctionExpression(node, state, c) {
      const functionScope = createScope("Function", state);
      state.children.push(functionScope);
      node.scope = functionScope; // Attach for runtime

      if (node.id) {
        // Named function expressions bind their name within their own scope
        registerDeclaration(functionScope, node.id.name, "function", node, functionScope);
      }

      for (const param of node.params) {
        extractPatternNames(param).forEach((name) => {
          registerDeclaration(functionScope, name, "parameter");
        });
      }

      for (const statement of node.body.body) {
        c(statement, functionScope);
      }
    },

    ArrowFunctionExpression(node, state, c) {
      const functionScope = createScope("Function", state);
      state.children.push(functionScope);
      node.scope = functionScope; // Attach for runtime

      for (const param of node.params) {
        extractPatternNames(param).forEach((name) => {
          registerDeclaration(functionScope, name, "parameter");
        });
      }

      if (node.body.type === "BlockStatement") {
        for (const statement of node.body.body) {
          c(statement, functionScope);
        }
      } else {
        c(node.body, functionScope);
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

/**
 * Recursively extract all bound identifier names from a pattern node.
 * Handles: Identifier, ObjectPattern, ArrayPattern, AssignmentPattern, RestElement
 */
function extractPatternNames(pattern) {
  if (!pattern) {
    return [];
  }

  switch (pattern.type) {
    case "Identifier":
      return [pattern.name];

    case "ObjectPattern": {
      const names = [];

      for (const property of pattern.properties) {
        if (property.type === "RestElement") {
          names.push(...extractPatternNames(property.argument));
        } else {
          // property.value is the binding target (can be nested pattern)
          names.push(...extractPatternNames(property.value));
        }
      }

      return names;
    }

    case "ArrayPattern": {
      const names = [];

      for (const element of pattern.elements) {
        if (element === null) {
          continue; // elision
        }

        names.push(...extractPatternNames(element));
      }

      return names;
    }

    case "AssignmentPattern":
      // const { a = 10 } = obj → the binding target is the left side
      return extractPatternNames(pattern.left);

    case "RestElement":
      return extractPatternNames(pattern.argument);

    default:
      return [];
  }
}
