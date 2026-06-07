"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function FlyingItem({
  show,
  image,
}: {
  show: boolean;
  image: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.img
          src={image}
          initial={{
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: 0,
            scale: 0.2,
            x: 800,
            y: -400,
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="pointer-events-none fixed right-20 top-40 z-[9999] h-28 w-28 rounded-2xl object-cover shadow-2xl"
        />
      )}
    </AnimatePresence>
  );
}
