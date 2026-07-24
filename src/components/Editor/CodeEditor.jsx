import Editor, { loader } from "@monaco-editor/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Dark26Theme from "./Theme/dark26.json";
import { Play, SquareDashedText } from "lucide-react";
import { formatCode } from "../../formatter/formatCode";
import { parseCode } from "../../parser/parseCode";
import { buildScopeTree } from "../../scope/scopeBuilder.js";
import { initializeRuntime } from "../../engine/initializeRuntime";
import { execute } from "../../execution/execute.js";
import { VisualizationStore } from "../../visualization/store/VisualizationStore.js";
import { createSnapshot } from "../../visualization/snapshot/SnapshotGenerator.js";
import { createDecorations } from "./decorator.js";

const baseTheme = {
  fontSize: 14,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  fontLigatures: true,

  minimap: {
    enabled: false,
  },

  smoothScrolling: true,

  scrollBeyondLastLine: false,

  automaticLayout: true,

  wordWrap: "on",

  tabSize: 2,
  insertSpaces: true,

  renderWhitespace: "selection",

  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: "on",

  guides: {
    indentation: true,
    bracketPairs: true,
  },

  bracketPairColorization: {
    enabled: true,
  },

  lineNumbers: "on",

  glyphMargin: false,
  folding: true,

  contextmenu: true,

  padding: {
    top: 12,
    bottom: 12,
  },

  scrollbar: {
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
  },

  suggest: {
    preview: true,
  },

  quickSuggestions: true,

  formatOnPaste: true,
  formatOnType: true,
};

const defaultCodeSnippet = `console.log('1. Sync Start');

function a() {
  console.log('2. Inside a()');
  Promise.resolve().then(() => console.log('4. Microtask from a()'));
  
  function b() {
    setTimeout(() => {
      console.log('5. Macrotask (setTimeout)');
      Promise.resolve().then(() => {
        console.log("6. Microtask inside Macrotask");
      });
    }, 5000);
  }
  
  b();
}

a();
console.log('3. Sync End');`;

const CodeEditor = () => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const prevDecorationsRef = useRef([]);

  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.defineTheme("Dark26", Dark26Theme);
    });
  }, []);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !currentSnapshot) return;

    const node = currentSnapshot.currentNode;
    if (!node || !node.loc) {
      prevDecorationsRef.current = editorRef.current.deltaDecorations(
        prevDecorationsRef.current,
        [],
      );
      return;
    }

    const { start, end } = node.loc;

    const decorations = createDecorations(monacoRef.current, start, end);

    prevDecorationsRef.current = editorRef.current.deltaDecorations(
      prevDecorationsRef.current,
      decorations,
    );

    editorRef.current.revealLineInCenterIfOutsideViewport(start.line);
  }, [currentSnapshot]);

  function onMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.focus();
  }

  async function handleFormat() {
    if (!editorRef.current) return;

    try {
      const code = editorRef.current.getValue();
      const formattedCode = await formatCode(code);
      editorRef.current.setValue(formattedCode);
      const parsedToAST = parseCode(formattedCode);
      const scopeTree = buildScopeTree(parsedToAST);

      const runtime = initializeRuntime(scopeTree);

      VisualizationStore.reset();
      let stepCount = 0;
      runtime.onStep = (node, rt) => {
        VisualizationStore.addSnapshot(createSnapshot(stepCount++, node, rt));
      };

      execute(parsedToAST, runtime);

      // Capture the final state after execution is complete
      VisualizationStore.addSnapshot(
        createSnapshot(stepCount++, null, runtime),
      );

      console.log(
        "Execution complete. Snapshots generated:",
        VisualizationStore.getSnapshot().snapshots.length,
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    VisualizationStore.setExecuteCallback(handleFormat);
    return () => VisualizationStore.setExecuteCallback(null);
  }, []);

  function handleEditorChange() {
    VisualizationStore.reset();
  }

  return (
    <div className="h-full w-full overflow-hidden relative">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={defaultCodeSnippet}
        theme="Dark26"
        onMount={onMount}
        onChange={handleEditorChange}
        options={baseTheme}
      />
    </div>
  );
};

export default CodeEditor;
