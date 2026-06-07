"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function WidgetButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-2xl"
    >
      <Bot className="h-7 w-7" />
    </motion.button>
  );
}
