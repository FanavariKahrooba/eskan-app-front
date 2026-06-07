"use client";

import { motion } from "framer-motion";

type MotionWrapperProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function MotionWrapper({
  children,
  className = "",
  delay = 0,
}: MotionWrapperProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
