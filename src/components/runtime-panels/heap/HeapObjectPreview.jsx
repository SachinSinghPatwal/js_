function formatAddress(addr) {
  return `0x${addr.toString(16).padStart(4, "0")}`;
}

export default function HeapObjectPreview({ value, typeTag }) {
  if (!value || typeof value !== "object") {
    return <span className="text-[#d4d4d4] text-[10px]">{String(value)}</span>;
  }

  if (typeTag === "Promise" || value.PromiseState) {
    return (
      <div className="flex flex-col gap-0.5 font-mono text-[9px]">
        <div className="flex items-center gap-1.5">
          <span className="text-[#858585]">State:</span>
          <span className="text-[#e2b714] bg-[#1e1e1e] border border-[#2d2d2d] px-1 rounded font-bold">
            {value.PromiseState}
          </span>
        </div>
        {value.PromiseResult !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="text-[#858585]">Result:</span>
            <span className="text-[#d4d4d4]">
              {typeof value.PromiseResult === "number"
                ? `→ ${formatAddress(value.PromiseResult)}`
                : String(value.PromiseResult)}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (typeTag === "Function" || value.type === "FunctionObject" || value.isNative) {
    const fnName = value.name || value.node?.id?.name || "(anonymous)";
    return (
      <div className="flex flex-col gap-0.5 font-mono text-[9px]">
        <span className="text-[#e2b714] font-medium">ƒ {fnName}</span>
        {value.capturedEnvironment && (
          <span className="text-[#858585]">[[Environment]] → Lexical Env</span>
        )}
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <span className="text-[10px] font-mono text-[#d4d4d4]">
        [{value.length} items]
      </span>
    );
  }

  const keys = Object.keys(value).filter(
    (k) =>
      k !== "__proto__" &&
      k !== "PromiseFulfillReactions" &&
      k !== "PromiseRejectReactions",
  );

  if (keys.length === 0) {
    return <span className="text-[10px] font-mono text-[#858585]">{"{}"}</span>;
  }

  return (
    <div className="flex flex-col gap-0.5 font-mono text-[9px]">
      {keys.slice(0, 4).map((key) => {
        const val = value[key];
        const displayVal =
          typeof val === "number"
            ? `→ ${formatAddress(val)}`
            : typeof val === "object" && val !== null
              ? Array.isArray(val)
                ? `[${val.length}]`
                : "{...}"
              : String(val);

        return (
          <div key={key} className="flex items-center gap-1">
            <span className="text-[#e2b714] font-medium">{key}</span>
            <span className="text-[#858585]">:</span>
            <span className="text-[#d4d4d4]">{displayVal}</span>
          </div>
        );
      })}
    </div>
  );
}
