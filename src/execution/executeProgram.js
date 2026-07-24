import { executeNode } from "./executeNode.js";

export function executeProgram(program, executionContextStack) {
  for (const statement of program.body) {
    executeNode(statement, executionContextStack);
  }
}
