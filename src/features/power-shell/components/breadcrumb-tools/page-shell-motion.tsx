"use client";

import { motion } from "framer-motion";

export default function PageShellMotion({
  children,
  maxWidth,
  padded,
}: {
  children: React.ReactNode;
  maxWidth: string;
  padded: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`${maxWidth} mx-auto ${
        padded ? "px-4 md:px-6 py-4 md:py-6" : ""
      }`}
    >
      {children}
    </motion.div>
  );
}
