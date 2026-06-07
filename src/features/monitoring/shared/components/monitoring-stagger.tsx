"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

export function MonitoringStagger({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function MonitoringStaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}
