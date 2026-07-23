import { executeNode } from "./executeNode.js";

export function executeProgram(program, executionContext) {
  for (const statement of program.body) {
    executeNode(statement, executionContext);
  }
}
