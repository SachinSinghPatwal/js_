import ValueFormatter from "./ValueFormatter";

export default function ObjectInspectorTree({ data, depth = 0, seen = new Set() }) {
  if (data === null || data === undefined || typeof data !== "object") {
    return <ValueFormatter val={data} />;
  }

  if (depth > 5) {
    return <span className="text-[#858585] italic">[Object]</span>;
  }

  if (seen.has(data)) {
    return <span className="text-[#858585] italic">[Circular Ref]</span>;
  }

  const nextSeen = new Set(seen);
  nextSeen.add(data);

  if (data instanceof Map) {
    const entries = Array.from(data.entries());
    if (entries.length === 0) return <span className="text-[#858585] italic">Map(0) {}</span>;
    return (
      <div className="flex flex-col gap-1 pl-2 border-l border-[#2d2d2d] my-1 font-mono text-[11px]">
        {entries.slice(0, 10).map(([k, v], idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-[#e2b714] font-semibold">{String(k)}</span>
            <span className="text-[#858585]">:</span>
            <ObjectInspectorTree data={v} depth={depth + 1} seen={nextSeen} />
          </div>
        ))}
      </div>
    );
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-[#858585] italic">[]</span>;
    return (
      <div className="flex flex-col gap-1 pl-2 border-l border-[#2d2d2d] my-1 font-mono text-[11px]">
        {data.slice(0, 10).map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-[#858585]">[{idx}]</span>
            <span className="text-[#858585]">:</span>
            <ObjectInspectorTree data={item} depth={depth + 1} seen={nextSeen} />
          </div>
        ))}
      </div>
    );
  }

  const keys = Object.keys(data).filter(
    (k) => k !== "node" && k !== "body" && k !== "runtime" && !k.startsWith("_")
  );

  if (keys.length === 0) return <span className="text-[#858585] italic">{}</span>;

  return (
    <div className="flex flex-col gap-1 pl-2 border-l border-[#2d2d2d] my-1 font-mono text-[11px]">
      {keys.slice(0, 15).map((key) => (
        <div key={key} className="flex items-start gap-2">
          <span className="text-[#e2b714]">{key}</span>
          <span className="text-[#858585]">:</span>
          <ObjectInspectorTree data={data[key]} depth={depth + 1} seen={nextSeen} />
        </div>
      ))}
    </div>
  );
}
