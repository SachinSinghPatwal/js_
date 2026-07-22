import { executeStatement } from "./executeStatement";

export function execute(ast, executionContext) {
  for (const statement of ast.body) {
    executeStatement(statement, executionContext);
  }
}
