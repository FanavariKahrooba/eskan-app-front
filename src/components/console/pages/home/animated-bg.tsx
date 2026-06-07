"use client"

import { motion } from "framer-motion"

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{
          x: [0, 200, -200, 0],
          y: [0, -150, 150, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -250, 200, 0],
          y: [0, 200, -200, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl right-0 top-40"
      />
    </div>
  )
}
