/**
 * Manages Monaco editor decorations for highlighting the current execution step.
 * Uses a soft background highlight that aligns with the Dark26 VS Code theme.
 */

export function createDecorations(monaco, start, end) {
  if (!monaco || !start || !end) return [];

  return [
    // Highlight the whole line softly
    {
      range: new monaco.Range(start.line, 1, start.line, 1),
      options: {
        isWholeLine: true,
        className: "bg-neutral-800/80 border-l-2 border-blue-500",
      },
    },
    // Highlight the exact node being executed
    {
      range: new monaco.Range(
        start.line,
        start.column + 1,
        end.line,
        end.column + 1
      ),
      options: {
        inlineClassName: "bg-blue-900/50 ",
      },
    },
  ];
}
