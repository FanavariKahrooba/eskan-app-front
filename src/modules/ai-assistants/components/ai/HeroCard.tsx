"use client";

import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

export function HeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl"
    >
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
          <BrainCircuit className="h-4 w-4" />
          Enterprise AI Workspace
        </div>

        <h2 className="text-xl font-bold md:text-2xl">
          دستیار هوشمند حرفه‌ای برای گفتگوی سازمانی
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
          طراحی مدرن، ساختار توسعه‌پذیر و آماده برای اتصال کامل به بک‌اند
          Laravel AI Assistant.
        </p>
      </div>
    </motion.div>
  );
}
