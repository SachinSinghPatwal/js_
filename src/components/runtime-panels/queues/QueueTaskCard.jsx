import { motion } from "framer-motion";

export default function QueueTaskCard({ idKey, typeLabel, callbackName, onClick }) {
  return (
    <motion.div
      key={idKey}
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      onClick={onClick}
      className="rounded border border-[#2d2d2d] bg-[#252526] px-2.5 py-1.5 flex flex-col gap-0.5 cursor-pointer hover:bg-[#333333] transition-all min-w-[110px] shrink-0"
    >
      <span className="text-[9px] font-semibold text-[#e2b714]">
        {typeLabel}
      </span>
      <span className="text-[9px] text-[#d4d4d4]">
        {callbackName}()
      </span>
    </motion.div>
  );
}
