import { useState } from "react";
import HeapEntryCard from "./HeapEntryCard";

export default function HeapCategoryGroup({ name, entries, onInspect }) {
  const [collapsed, setCollapsed] = useState(false);
  if (!entries || entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex items-center gap-1.5 cursor-pointer text-[#d4d4d4] hover:text-[#e2b714] transition-colors font-mono text-[9px]"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-[#858585]">{collapsed ? "▶" : "▼"}</span>
        <span className="uppercase tracking-wider font-semibold">{name}</span>
        <span className="text-[#858585]">({entries.length})</span>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-1 pl-2">
          {entries.map((entry) => (
            <HeapEntryCard
              key={entry.address}
              entry={entry}
              onInspect={onInspect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
