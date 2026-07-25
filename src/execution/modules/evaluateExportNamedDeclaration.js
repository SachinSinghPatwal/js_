import { executeNode } from "../executeNode.js";

export function evaluateExportNamedDeclaration(node, executionContextStack, heap) {
  // If the export has a declaration (e.g. `export const foo = 1;`), evaluate it locally.
  if (node.declaration) {
    executeNode(node.declaration, executionContextStack, heap);
  }

  // In a full module system, we would also register the exported bindings 
  // (from node.specifiers or node.declaration) into the Module Environment Record's exports.
  // Since this is a single-file visualizer without cross-file imports, 
  // local evaluation is sufficient for visualization.
}
