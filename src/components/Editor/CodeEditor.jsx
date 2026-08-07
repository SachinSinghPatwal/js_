import { lazy, Suspense, useEffect, useRef, useSyncExternalStore } from "react";
import { loader } from "@monaco-editor/react";

const Editor = lazy(() =>
  import("@monaco-editor/react").then((mod) => ({ default: mod.default })),
);
import Dark26Theme from "./theme/dark26.json";
import { formatCode } from "../../engine/formatter/formatCode.js";
import { parseCode } from "../../engine/parser/parseCode.js";
import { buildScopeTree } from "../../engine/scope/scopeBuilder.js";
import { initializeRuntime } from "../../engine/initializeRuntime.js";
import { execute } from "../../execution/execute.js";
import { VisualizationStore } from "../../visualization/store/VisualizationStore.js";
import { createSnapshot } from "../../visualization/snapshot/SnapshotGenerator.js";
import { createDecorations } from "./decorations/editorDecorations.js";

const baseTheme = {
  fontSize: 13,
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
    top: 10,
    bottom: 10,
  },

  scrollbar: {
    vertical: "visible",
    horizontal: "auto",
    useShadows: false,
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
    verticalHasArrows: false,
    horizontalHasArrows: false,
  },

  suggest: {
    preview: true,
  },

  quickSuggestions: true,
  formatOnPaste: true,
  formatOnType: true,
};

/** Pure function — moved to module scope to avoid re-creation on every render */
function handleEditorChange() {
  VisualizationStore.reset();
}

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

    const range = new monacoRef.current.Range(
      start.line,
      start.column + 1,
      end.line,
      end.column + 1,
    );
    const position = new monacoRef.current.Position(
      start.line,
      start.column + 1,
    );

    editorRef.current.setSelection(
      new monacoRef.current.Selection(
        start.line,
        start.column + 1,
        end.line,
        end.column + 1,
      ),
    );
    editorRef.current.revealPositionInCenter(position);
    editorRef.current.revealRangeInCenter(range);
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

  return (
    <div className="h-full w-full relative">
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center bg-[#1e1e1e] text-[#858585] text-xs font-mono">
            Loading editor…
          </div>
        }
      >
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="javascript"
          defaultValue={defaultCodeSnippet}
          theme="Dark26"
          onMount={onMount}
          onChange={handleEditorChange}
          options={baseTheme}
        />
      </Suspense>
    </div>
  );
};

export default CodeEditor;
