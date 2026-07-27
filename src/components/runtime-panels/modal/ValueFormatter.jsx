export default function ValueFormatter({ val }) {
  if (val === null) return <span className="text-[#858585] italic">null</span>;
  if (val === undefined) return <span className="text-[#858585] italic">undefined</span>;
  if (typeof val === "number") {
    if (val >= 1 && val < 100000) {
      return (
        <span className="text-[#e2b714] font-semibold">
          → 0x{val.toString(16).padStart(4, "0")} (Heap)
        </span>
      );
    }
    return <span className="text-[#d4d4d4]">{val}</span>;
  }
  if (typeof val === "boolean") return <span className="text-[#d4d4d4]">{String(val)}</span>;
  if (typeof val === "string") return <span className="text-[#d4d4d4]">"{val}"</span>;
  if (typeof val === "function") return <span className="text-[#e2b714]">ƒ Function</span>;
  if (typeof val === "object") {
    if (Array.isArray(val)) return <span className="text-[#d4d4d4]">Array({val.length})</span>;
    return <span className="text-[#d4d4d4]">{val.type || val.name || "Object"}</span>;
  }
  return <span className="text-[#d4d4d4]">{String(val)}</span>;
}
