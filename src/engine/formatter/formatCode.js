import * as prettier from "prettier/standalone";
import * as babelPlugin from "prettier/plugins/babel";
import * as estreePlugin from "prettier/plugins/estree";

export async function formatCode(code) {
  return await prettier.format(code, {
    parser: "babel",
    plugins: [babelPlugin, estreePlugin],
    semi: true,
    singleQuote: false,
    tabWidth: 2,
    bracketSpacing:true,
    arrowParens:"always"
  });
}