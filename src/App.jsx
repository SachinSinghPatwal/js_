import { useState } from "react";
import { Panel, Group as PanelGroup } from "react-resizable-panels";
import CodeEditor from "./components/editor/CodeEditor";
import FloatingControlsHeader from "./components/layout/FloatingControlsHeader";
import { ResizeHandle, HorizontalResizeHandle } from "./components/common/ResizeHandles";
import PanelWidthGuard from "./components/common/PanelWidthGuard";

import ExecutionStagePanel from "./components/runtime-panels/execution-stage/ExecutionStagePanel";
import CallStackPanel from "./components/runtime-panels/call-stack/CallStackPanel";
import HeapPanel from "./components/runtime-panels/heap/HeapPanel";
import EventLoopPanel from "./components/runtime-panels/event-loop/EventLoopPanel";
import MicroQueuePanel from "./components/runtime-panels/queues/MicroQueuePanel";
import MacroQueuePanel from "./components/runtime-panels/queues/MacroQueuePanel";
import WebAPIPanel from "./components/runtime-panels/queues/WebAPIPanel";
import EntityDetailsModal from "./components/runtime-panels/modal/EntityDetailsModal";
import ConsolePanel from "./components/runtime-panels/console/ConsolePanel";

function App() {
  const [panels, setPanels] = useState({
    stack: true,
    heap: true,
    queues: true,
    console: true,
  });

  const togglePanel = (panelName) => {
    setPanels((prev) => ({
      ...prev,
      [panelName]: !prev[panelName],
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-[#181818] text-[#d4d4d4] overflow-hidden font-sans relative">
      {/* Entity Details Modal / Inspector */}
      <EntityDetailsModal />

      {/* Floating Header with Timeline Controls */}
      <FloatingControlsHeader panels={panels} togglePanel={togglePanel} />

      <div className="flex-1 overflow-hidden p-2">
        <PanelGroup
          orientation="horizontal"
          className="h-full rounded-lg overflow-hidden border border-[#252526]"
        >
          {/* Editor & Console Pane */}
          <Panel
            defaultSize={35}
            minSize={28}
            className="bg-[#1e1e1e] rounded-l-lg border-r border-[#252526]"
          >
            <PanelWidthGuard minWidth={280} minHeight={150} label="Editor & Console">
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
          <Panel defaultSize={40} minSize={32} className="bg-[#1e1e1e]">
            <PanelWidthGuard minWidth={300} minHeight={150} label="Execution Stage & Stack">
              <PanelGroup orientation="vertical">
                {/* Execution Stage Panel (55%) */}
                <Panel defaultSize={55} minSize={25} className="flex flex-col">
                  <ExecutionStagePanel />
                </Panel>

                {panels.stack && (
                  <>
                    <HorizontalResizeHandle />
                    {/* Call Stack & Event Loop Panel (45%) */}
                    <Panel
                      defaultSize={45}
                      minSize={25}
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
                minSize={24}
                className="bg-[#1e1e1e] rounded-r-lg border-l border-[#252526]"
              >
                <PanelWidthGuard minWidth={240} minHeight={150} label="Heap & Queues">
                  <PanelGroup orientation="vertical">
                    {panels.heap && (
                      <Panel defaultSize={40} minSize={25}>
                        <HeapPanel />
                      </Panel>
                    )}

                    {panels.heap && panels.queues && <HorizontalResizeHandle />}

                    {panels.queues && (
                      <Panel defaultSize={60} minSize={30}>
                        <PanelGroup orientation="vertical">
                          <Panel
                            defaultSize={33}
                            minSize={22}
                            className="border-t border-[#252526]"
                          >
                            <MicroQueuePanel />
                          </Panel>
                          <HorizontalResizeHandle />
                          <Panel
                            defaultSize={33}
                            minSize={22}
                            className="border-t border-[#252526]"
                          >
                            <MacroQueuePanel />
                          </Panel>
                          <HorizontalResizeHandle />
                          <Panel
                            defaultSize={34}
                            minSize={22}
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
