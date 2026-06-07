"use client";

import { Bot, Cpu, Menu, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-slate-300">
      <span className="text-cyan-300">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

interface Props {
  model: string;
  statusText: string;
  onOpenSidebar: () => void;
}

export function ChatHeader({ model, statusText, onOpenSidebar }: Props) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/40 px-4 backdrop-blur-2xl md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="rounded-2xl border border-white/10 p-2 lg:hidden"
        >
          <Menu className="h-5 w-5 text-white" />
        </button>

        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-lg shadow-cyan-500/20">
          <Bot className="h-6 w-6 text-white" />
          <motion.span
            className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>

        <div>
          <h1 className="flex items-center gap-2 text-base font-bold md:text-lg">
            دستیار هوشمند سازمانی
            <Sparkles className="h-4 w-4 text-cyan-300" />
          </h1>
          <p className="text-xs text-slate-400">{statusText}</p>
        </div>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <Badge icon={<ShieldCheck className="h-4 w-4" />} text="Enterprise" />
        <Badge icon={<Cpu className="h-4 w-4" />} text={model} />
        <Badge icon={<Zap className="h-4 w-4" />} text="AI Ready" />
      </div>
    </header>
  );
}
