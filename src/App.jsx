import { useState, useRef } from "react";
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";
import CodeEditor from "./components/Editor/CodeEditor";
import TimelineControls from "./components/Timeline/TimelineControls";

import ExecutionStagePanel from "./components/RuntimePanels/ExecutionStagePanel";
import CallStackPanel from "./components/RuntimePanels/CallStackPanel";
import HeapPanel from "./components/RuntimePanels/HeapPanel";
import EventLoopPanel from "./components/RuntimePanels/EventLoopPanel";
import MicroQueuePanel from "./components/RuntimePanels/MicroQueuePanel";
import MacroQueuePanel from "./components/RuntimePanels/MacroQueuePanel";
import WebAPIPanel from "./components/RuntimePanels/WebAPIPanel";
import EntityDetailsModal from "./components/RuntimePanels/EntityDetailsModal";
import PanelWidthGuard from "./components/RuntimePanels/PanelWidthGuard";

import ConsolePanel from "./components/RuntimePanels/ConsolePanel";

function ResizeHandle({ className = "" }) {
  return (
    <PanelResizeHandle
      className={`w-1.5 h-full bg-transparent hover:bg-[#e2b714]/40 transition-colors flex items-center justify-center cursor-col-resize ${className}`}
    >
      <div className="w-[1px] h-8 bg-[#2d2d2d] rounded-full" />
    </PanelResizeHandle>
  );
}

function HorizontalResizeHandle({ className = "" }) {
  return (
    <PanelResizeHandle
      className={`h-1.5 w-full bg-transparent hover:bg-[#e2b714]/40 transition-colors flex items-center justify-center cursor-row-resize ${className}`}
    >
      <div className="h-[1px] w-8 bg-[#2d2d2d] rounded-full" />
    </PanelResizeHandle>
  );
}

function App() {
  const [panels, setPanels] = useState({
    stack: true,
    heap: true,
    queues: true,
    console: true,
  });

  const [isControlsVisible, setIsControlsVisible] = useState(false);
  let mouseTimeout = useRef(null);

  const togglePanel = (panelName) => {
    setPanels((prev) => ({
      ...prev,
      [panelName]: !prev[panelName],
    }));
  };

  const handleMouseMove = () => {
    setIsControlsVisible(true);
    if (mouseTimeout.current) clearTimeout(mouseTimeout.current);
    mouseTimeout.current = setTimeout(() => setIsControlsVisible(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#181818] text-[#d4d4d4] overflow-hidden font-sans relative">
      {/* Entity Details Modal / Inspector */}
      <EntityDetailsModal />

      {/* Hover Zone at Top Center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-12 z-40"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          if (mouseTimeout.current) clearTimeout(mouseTimeout.current);
          mouseTimeout.current = setTimeout(
            () => setIsControlsVisible(false),
            500,
          );
        }}
      />

      {/* Floating Timeline Controls */}
      <div
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
          isControlsVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        onMouseEnter={() => {
          setIsControlsVisible(true);
          if (mouseTimeout.current) clearTimeout(mouseTimeout.current);
        }}
        onMouseLeave={() => {
          mouseTimeout.current = setTimeout(
            () => setIsControlsVisible(false),
            2000,
          );
        }}
      >
        <div className="rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-[#2d2d2d] bg-[#252526]">
          <TimelineControls panels={panels} togglePanel={togglePanel} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-2">
        <PanelGroup
          orientation="horizontal"
          className="h-full rounded-lg overflow-hidden border border-[#252526]"
        >
          {/* Editor & Console Pane */}
          <Panel
            defaultSize={35}
            minSize={15}
            className="bg-[#1e1e1e] rounded-l-lg border-r border-[#252526]"
          >
            <PanelWidthGuard minWidth={350} label="Editor & Console">
              <div className="flex flex-col h-full w-full">
                {/* Code Editor */}
                <div
                  className={`flex flex-col w-full min-h-0 ${
                    panels.console ? "h-[65%]" : "h-full"
                  }`}
                >
                  <div className="px-4 py-1.5 border-b border-[#252526] bg-[#252526] flex items-center justify-between shrink-0">
                    <span className="text-[11px] font-mono text-[#858585] uppercase tracking-wider font-semibold">
                      Source.js
                    </span>
                  </div>
                  <div className="flex-1 relative min-h-0">
                    <CodeEditor />
                  </div>
                </div>

                {/* Console Panel */}
                {panels.console && (
                  <div className="h-[35%] overflow-x-hidden w-full min-h-0 border-t border-[#252526]">
                    <ConsolePanel />
                  </div>
                )}
              </div>
            </PanelWidthGuard>
          </Panel>

          <ResizeHandle />

          {/* Execution Stage & Call Stack / Event Loop */}
          <Panel defaultSize={40} minSize={20} className="bg-[#1e1e1e]">
            <PanelWidthGuard minWidth={280} label="Execution Stage">
              <PanelGroup orientation="vertical">
                <Panel defaultSize={65} minSize={25} className="flex flex-col">
                  <ExecutionStagePanel />
                </Panel>

                {panels.stack && (
                  <>
                    <HorizontalResizeHandle />
                    <Panel
                      defaultSize={35}
                      minSize={20}
                      className="border-t border-[#252526]"
                    >
                      <div className="flex flex-row h-full w-full">
                        <div className="flex-1 h-full min-w-0 border-r border-[#252526]">
                          <CallStackPanel />
                        </div>
                        <div className="w-[210px] h-full shrink-0">
                          <EventLoopPanel />
                        </div>
                      </div>
                    </Panel>
                  </>
                )}
              </PanelGroup>
            </PanelWidthGuard>
          </Panel>

          {/* Right Pane (Heap & Queues) */}
          {(panels.heap || panels.queues) && (
            <>
              <ResizeHandle />
              <Panel
                defaultSize={25}
                minSize={15}
                className="bg-[#1e1e1e] rounded-r-lg border-l border-[#252526]"
              >
                <PanelWidthGuard minWidth={200} label="Heap & Queues">
                  <PanelGroup orientation="vertical">
                    {panels.heap && (
                      <Panel defaultSize={40} minSize={20}>
                        <HeapPanel />
                      </Panel>
                    )}

                    {panels.heap && panels.queues && <HorizontalResizeHandle />}

                    {panels.queues && (
                      <Panel defaultSize={60} minSize={20}>
                        <PanelGroup orientation="vertical">
                          <Panel
                            defaultSize={33}
                            className="border-t border-[#252526]"
                          >
                            <MicroQueuePanel />
                          </Panel>
                          <HorizontalResizeHandle />
                          <Panel
                            defaultSize={33}
                            className="border-t border-[#252526]"
                          >
                            <MacroQueuePanel />
                          </Panel>
                          <HorizontalResizeHandle />
                          <Panel
                            defaultSize={34}
                            className="border-t border-[#252526]"
                          >
                            <WebAPIPanel />
                          </Panel>
                        </PanelGroup>
                      </Panel>
                    )}
                  </PanelGroup>
                </PanelWidthGuard>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  );
}

export default App;
