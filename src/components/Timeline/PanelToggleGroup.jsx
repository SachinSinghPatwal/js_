const PANEL_KEYS = [
  { key: "console", label: "Console" },
  { key: "stack", label: "Stack" },
  { key: "heap", label: "Heap" },
  { key: "queues", label: "Queues" },
];

export default function PanelToggleGroup({ panels, togglePanel }) {
  return (
    <div className="flex items-center gap-1 text-[10px]">
      {PANEL_KEYS.map(({ key, label }) => {
        const isActive = panels[key];
        return (
          <button
            type="button"
            key={key}
            onClick={() => togglePanel(key)}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              isActive
                ? "bg-[#1e1e1e] text-[#e2b714] border border-[#2d2d2d]"
                : "text-[#858585] hover:text-[#d4d4d4]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
