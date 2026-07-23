import * as walk from "acorn-walk";

export function traverseAST(ast) {
  const analysis = {
    variables: [],
    functions: [],
  };

  walk.simple(ast, {
    // collect variable properties from AST
    VariableDeclaration(node) {
      node.declarations.forEach((declaration) => {
        analysis.variables.push({
          name: declaration.id.name,
          kind: node.kind,
        });
      });
    },
    FunctionDeclaration(node) {
      analysis.functions.push({
        name: node.id.name,
      });
    },
  });

  return analysis;
}