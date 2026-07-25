import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Server, Clock, Monitor, Wifi, Eye, HardDrive, Network } from "lucide-react";

const BROWSER_API_ICONS = {
  Timer: Clock,
  DOM: Monitor,
  Fetch: Wifi,
  MutationObserver: Eye,
  setTimeout: Clock,
  Timeout: Clock,
};

const NODE_API_ICONS = {
  Timer: Clock,
  libuv: Network,
  FS: HardDrive,
  DNS: Globe,
  TCP: Network,
  nextTick: Clock,
};

export default function WebAPIPanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  const webAPIs = currentSnapshot?.runtime?.webAPIs
    ? Array.from(currentSnapshot.runtime.webAPIs.entries())
    : [];

  const hostEnv = currentSnapshot?.runtime?.hostEnvironment || "browser";
  const isBrowser = hostEnv === "browser";

  const envLabel = isBrowser ? "Browser Host" : "Node.js Runtime";
  const EnvIcon = isBrowser ? Globe : Server;
  const apiIcons = isBrowser ? BROWSER_API_ICONS : NODE_API_ICONS;

  // Available APIs for the current environment
  const availableAPIs = isBrowser
    ? ["Timer", "DOM", "Fetch", "MutationObserver"]
    : ["Timers", "libuv", "FS", "DNS", "TCP", "process.nextTick"];

  return (
    <div className="h-full w-full flex flex-col bg-[#0d0d0d]">
      {/* Header with host environment badge */}
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Host APIs
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <EnvIcon size={10} className="text-emerald-500/70" />
          <span className="text-[9px] font-mono bg-emerald-900/30 text-emerald-400 px-1.5 py-0.5 rounded">
            {envLabel}
          </span>
        </div>
      </div>

      <div className="flex-1 p-2 overflow-y-auto flex flex-col gap-2">
        {/* Available API badges — shows what's available in this host environment */}
        <div className="flex flex-wrap gap-1 px-1">
          {availableAPIs.map((api) => (
            <span
              key={api}
              className="text-[8px] font-mono text-emerald-600 bg-emerald-950/30 border border-emerald-900/30 px-1.5 py-0.5 rounded"
            >
              {api}
            </span>
          ))}
        </div>

        {/* Dashed separator — visual distinction: "not part of V8" */}
        <div className="border-t border-dashed border-emerald-900/30 mx-1" />

        {/* Active background tasks */}
        <div className="flex flex-col gap-1">
          {webAPIs.length === 0 ? (
            <div className="flex items-center justify-center py-3">
              <span className="text-[10px] font-mono text-neutral-600 italic">
                No active background tasks
              </span>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {webAPIs.map(([id, api]) => {
                const Icon = apiIcons[api.type] || apiIcons[api.label] || Clock;
                return (
                  <motion.div
                    key={id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                    className="rounded-lg border border-emerald-800/40 bg-emerald-950/20 p-2 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={12} className="text-emerald-500/70" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-emerald-300">
                          {api.label || api.type}
                        </span>
                        {api.delay !== undefined && (
                          <span className="text-[8px] font-mono text-neutral-500">
                            {api.delay}ms delay
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[8px] font-mono text-emerald-600 bg-emerald-950/50 px-1.5 py-0.5 rounded">
                      Background
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Footer note: Not part of V8 */}
        <div className="mt-auto px-1 pb-1">
          <span className="text-[8px] font-mono text-neutral-600 italic">
            ⚠ Host APIs are NOT part of the V8 engine
          </span>
        </div>
      </div>
    </div>
  );
}
