export function evaluateExportAllDeclaration() {
  // E.g., `export * from "./math.js";`
  // Unsupported in a single-file visualizer.
  throw new Error("Module resolution (ExportAll) is not currently supported in this single-file environment.");
}
