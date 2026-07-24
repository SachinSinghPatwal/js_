import Editor, { loader } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import Dark26Theme from "./Theme/dark26.json";
import { SquareDashedText } from "lucide-react";
import { formatCode } from "../../formatter/formatCode";
import { parseCode } from "../../parser/parseCode";
import { buildScopeTree } from "../../scope/scopeBuilder.js";
import { initializeRuntime } from "../../engine/initializeRuntime";
import {execute} from "../../execution/execute.js";


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

  wordWrap: "off",

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

const defaultCodeSnippet = `console.log('a') \n function a(){\n \t new Promise.resolve().then(()=>console.log(b)) \n\t function b(){\n\t\tsetTimeout(() => {\n\t\t new Promise.resolve().then(()=>{\n\t\t console.log("c")
		})}, 5000)}
    };`;

const CodeEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.defineTheme("Dark26", Dark26Theme);
    });
  }, []);

  function onMount(editor) {
    editorRef.current = editor;
    editor.focus();
  }

  async function handleFormat() {
    if (!editorRef.current) return;

    try {
      const code = editorRef.current.getValue();
      const formattedCode = await formatCode(code);
      editorRef.current.setValue(formattedCode);
      const parsedToAST = parseCode(formattedCode);
      // traverseAST(parsedToAST);
      const scopeTree = buildScopeTree(parsedToAST);

      console.log(scopeTree.variables);

      const runtime = initializeRuntime(scopeTree);

      execute(parsedToAST, runtime);

      // const binding = resolveIdentifier("a", runtime.lexicalEnvironment);

      // console.log(binding);

      // const binding1 = resolveIdentifier("a", runtime.lexicalEnvironment);
      // const binding2 = resolveIdentifier("b", runtime.lexicalEnvironment);

      // setBindingValue(binding1, 5);
      // setBindingValue(binding2, 5);

      // console.log(binding1);
      // console.log(binding2);

      // console.log(runtime);
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className=" h-[95vh] w-screen overflow-x-hidden">
      <div className="relative  h-full">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue={defaultCodeSnippet}
          theme="Dark26"
          onMount={onMount}
          options={baseTheme}
        />

        <button
          className="absolute top-2 right-2 z-1 p-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700"
          onClick={handleFormat}
          title="Format Code"
        >
          <SquareDashedText className="text-white" size={20} />
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
