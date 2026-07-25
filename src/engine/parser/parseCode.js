import { Parser } from "acorn";
export function parseCode(code) {
  const ast = Parser.parse(code, {
    ecmaVersion: "latest",
    sourceType: "module",
    locations: true,
  });

  return ast;
}
