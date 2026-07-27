import { useState, useRef } from "react";
import TimelineControls from "../timeline/TimelineControls";

export default function FloatingControlsHeader({ panels, togglePanel }) {
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const mouseTimeout = useRef(null);

  const handleMouseMove = () => {
    setIsControlsVisible(true);
    if (mouseTimeout.current) clearTimeout(mouseTimeout.current);
    mouseTimeout.current = setTimeout(() => setIsControlsVisible(false), 2000);
  };

  return (
    <>
      {/* Top Hover Zone */}
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
    </>
  );
}
