import { Separator as PanelResizeHandle } from "react-resizable-panels";

export function ResizeHandle({ className = "" }) {
  return (
    <PanelResizeHandle
      className={`w-1.5 h-full bg-transparent hover:bg-[#e2b714]/40 transition-colors flex items-center justify-center cursor-col-resize ${className}`}
    >
      <div className="w-[1px] h-8 bg-[#2d2d2d] " />
    </PanelResizeHandle>
  );
}

export function HorizontalResizeHandle({ className = "" }) {
  return (
    <PanelResizeHandle
      className={`h-1.5 w-full bg-transparent hover:bg-[#e2b714]/40 transition-colors flex items-center justify-center cursor-row-resize ${className}`}
    >
      <div className="h-[1px] w-8 bg-[#2d2d2d] " />
    </PanelResizeHandle>
  );
}
