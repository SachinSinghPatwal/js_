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
      // Create the function scope first
      const functionScope = createScope("Function", state);

      // Register the function in the parent scope and store a reference
      // to its function scope
      registerDeclaration(state, node.id.name, "function", node, functionScope);

      // Connect the function scope to its parent
      state.children.push(functionScope);

      // Register parameters in the function scope
      for (const param of node.params) {
        extractPatternNames(param).forEach((name) => {
          registerDeclaration(functionScope, name, "parameter");
        });
      }

      // Traverse the function body using the function scope
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
