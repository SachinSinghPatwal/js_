import { useState, useRef } from "react";
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";
import CodeEditor from "./components/Editor/CodeEditor";
import TimelineControls from "./components/Timeline/TimelineControls";

import CallStackPanel from "./components/RuntimePanels/CallStackPanel";
import HeapPanel from "./components/RuntimePanels/HeapPanel";
import EventLoopPanel from "./components/RuntimePanels/EventLoopPanel";
import MicroQueuePanel from "./components/RuntimePanels/MicroQueuePanel";
import MacroQueuePanel from "./components/RuntimePanels/MacroQueuePanel";
import WebAPIPanel from "./components/RuntimePanels/WebAPIPanel";
import EntityDetailsModal from "./components/RuntimePanels/EntityDetailsModal";

import ConsolePanel from "./components/RuntimePanels/ConsolePanel";

function ResizeHandle({ className = "" }) {
  return (
    <PanelResizeHandle
      className={`w-2 h-full bg-transparent hover:bg-blue-500/50 transition-colors flex items-center justify-center cursor-col-resize ${className}`}
    >
      <div className="w-[1px] h-8 bg-neutral-700 rounded-full" />
    </PanelResizeHandle>
  );
}

function HorizontalResizeHandle({ className = "" }) {
  return (
    <PanelResizeHandle
      className={`h-2 w-full bg-transparent hover:bg-blue-500/50 transition-colors flex items-center justify-center cursor-row-resize ${className}`}
    >
      <div className="h-[1px] w-8 bg-neutral-700 rounded-full" />
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
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans relative">
      {/* Entity Details Modal */}
      <EntityDetailsModal />

      {/* Invisible Hover Zone at Top Center */}
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
        <div className="rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-[#333] bg-[#0a0a0a]">
          <TimelineControls panels={panels} togglePanel={togglePanel} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-2">
        <PanelGroup
          orientation="horizontal"
          className="h-full rounded-xl overflow-hidden border border-[#222]"
        >
          {/* Editor & Console Pane */}
          <Panel
            defaultSize={35}
            minSize={20}
            className="bg-[#0f0f0f] rounded-l-xl border-r border-[#222]"
          >
            <PanelGroup orientation="vertical">
              <Panel defaultSize={panels.console ? 70 : 100} minSize={20}>
                <div className="flex flex-col h-full">
                  <div className="px-4 py-2 border-b border-[#222] bg-[#1a1a1a] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                      Source.js
                    </span>
                  </div>
                  <div className="flex-1 relative">
                    <CodeEditor />
                  </div>
                </div>
              </Panel>
              
              {panels.console && (
                <>
                  <HorizontalResizeHandle />
                  <Panel defaultSize={30} minSize={15} className="border-t border-[#222]">
                    <ConsolePanel />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>

          <ResizeHandle />

          {/* Execution Stage & Call Stack */}
          <Panel defaultSize={40} minSize={30} className="bg-[#0f0f0f]">
            <PanelGroup orientation="vertical">
              <Panel defaultSize={70} className="flex flex-col">
                <div className="px-4 py-2 border-b border-[#222] bg-[#1a1a1a] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Execution Stage
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center text-neutral-600 font-mono text-sm">
                  Animation Stage (GSAP coming soon)
                </div>
              </Panel>

              {panels.stack && (
                <>
                  <HorizontalResizeHandle />
                  <Panel
                    defaultSize={30}
                    minSize={20}
                    className="border-t border-[#222]"
                  >
                    <PanelGroup orientation="horizontal">
                      <Panel defaultSize={70}>
                        <CallStackPanel />
                      </Panel>
                      <ResizeHandle />
                      <Panel defaultSize={30}>
                        <EventLoopPanel />
                      </Panel>
                    </PanelGroup>
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>

          {/* Right Pane (Heap & Queues) */}
          {(panels.heap || panels.queues) && (
            <>
              <ResizeHandle />
              <Panel
                defaultSize={25}
                minSize={20}
                className="bg-[#0f0f0f] rounded-r-xl border-l border-[#222]"
              >
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
                          className="border-t border-[#222]"
                        >
                          <MicroQueuePanel />
                        </Panel>
                        <HorizontalResizeHandle />
                        <Panel
                          defaultSize={33}
                          className="border-t border-[#222]"
                        >
                          <MacroQueuePanel />
                        </Panel>
                        <HorizontalResizeHandle />
                        <Panel
                          defaultSize={34}
                          className="border-t border-[#222]"
                        >
                          <WebAPIPanel />
                        </Panel>
                      </PanelGroup>
                    </Panel>
                  )}
                </PanelGroup>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  );
}

export default App;
