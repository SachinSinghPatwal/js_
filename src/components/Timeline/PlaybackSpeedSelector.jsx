const SPEED_OPTIONS = [500, 1000, 2000, 3000];

export default function PlaybackSpeedSelector({ speed, setSpeed }) {
  return (
    <div className="flex items-center gap-1 text-[10px] border-l border-[#2d2d2d] pl-2">
      <div className="relative group">
        <button type="button" className="px-1.5 py-0.5 rounded text-[#858585] hover:text-[#d4d4d4] transition-colors cursor-pointer font-mono">
          {speed / 1000}s
        </button>
        <div className="absolute right-0 top-full pt-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
          <div className="bg-[#252526] border border-[#2d2d2d] rounded shadow-lg overflow-hidden py-1">
            {SPEED_OPTIONS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setSpeed(s)}
                className={`block w-full text-left px-3 py-1 cursor-pointer hover:bg-[#1e1e1e] text-[10px] ${  speed === s ? "text-[#e2b714] font-bold" : "text-[#d4d4d4]"
                }`}
              >
                {s / 1000}s
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
