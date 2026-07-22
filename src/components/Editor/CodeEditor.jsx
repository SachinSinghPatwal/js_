/* eslint-disable react-hooks/immutability */
import Editor, { loader } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import Dark26Theme from "./Theme/dark26.json";
import { SquareDashedText } from "lucide-react";
import { formatCode } from "../../formatter/formatCode";
import { parseCode } from "../../parser/parseCode";
import { buildScopeTree } from "../../scope/scopeBuilder.js";
import { createRuntime } from "../../engine/createRuntime";
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
  const [ast, setAst] = useState("");

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
      setAst(parsedToAST);
      // traverseAST(parsedToAST);
      const scopeTree = buildScopeTree(parsedToAST);

      const runtime = createRuntime(scopeTree);

      console.log(runtime.lexicalEnvironment.environmentRecord.bindings);
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
      {/* <div className="w-[45%] h-full overflow-auto no-scrollbar bg-[#1e1e1e] overflow-x-hidden text-white p-4">
        <pre>{JSON.stringify(ast, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default CodeEditor;
