import { motion } from "framer-motion";

export default function EventLoopPhaseNode({
  phase,
  isActive,
  isIdle,
  phaseStep,
  isLast,
}) {
  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        animate={
          isActive ? { opacity: 1 } : { opacity: isIdle ? 0.4 : 0.6 }
        }
        className={`w-full max-w-[190px] rounded border px-2.5 py-1.5 text-center transition-all ${
          isActive
            ? "border-[#e2b714] bg-[#252526] text-[#e2b714] font-bold"
            : "border-[#2d2d2d] bg-[#252526] text-[#d4d4d4]"
        }`}
      >
        <span className="text-[10px]">{phase.label}</span>
        {isActive && phaseStep && (
          <div className="text-[8px] text-[#858585] mt-0.5 font-normal">
            {phaseStep}
          </div>
        )}
      </motion.div>

      {!isLast && (
        <div className="py-0.5 text-[#858585] text-[9px]">↓</div>
      )}
    </div>
  );
}
