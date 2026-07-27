export default function EnvironmentBindingsList({ bindings }) {
  if (!bindings || bindings.size === 0) {
    return (
      <span className="text-[#858585] italic text-[10px]">No bindings</span>
    );
  }

  const entries = Array.from(bindings.entries());

  return (
    <div className="flex flex-col gap-0.5 font-mono">
      {entries.map(([name, binding]) => {
        const isRef = typeof binding?.value === "number";
        const isObj =
          typeof binding?.value === "object" && binding?.value !== null;
        const displayVal = isRef
          ? `→ 0x${binding.value.toString(16).padStart(4, "0")}`
          : isObj
            ? `[${binding.value?.type || "Object"}]`
            : String(binding?.value);

        return (
          <div key={name} className="flex items-center gap-1.5">
            <span className="text-[#e2b714] font-medium text-[10px]">
              {name}
            </span>
            <span className="text-[#858585] text-[10px]">:</span>
            <span
              className={`text-[10px] ${isRef ? "text-[#e2b714]" : "text-[#d4d4d4]"}`}
            >
              {displayVal}
            </span>
            {!binding?.initialized && (
              <span className="text-[8px] text-[#f44747] bg-[#1e1e1e] border border-[#2d2d2d] px-1 rounded">
                TDZ
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
