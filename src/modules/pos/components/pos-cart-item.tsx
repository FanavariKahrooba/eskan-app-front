"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CartItem } from "../store/use-pos-store";
import { usePosStore } from "../store/use-pos-store";

export default function PosCartItem({ item }: { item: CartItem }) {
  const remove = usePosStore((s) => s.removeFromCart);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
      flex items-center gap-3
      rounded-xl
      border border-white/10
      bg-white/5
      backdrop-blur
      p-3
      "
    >
      <div className="relative h-12 w-12 overflow-hidden rounded-lg">
        <Image
          src={item.image || "/images/placeholder.jpg"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="text-sm text-white">{item.name}</div>

        <div className="text-xs text-neutral-400">
          {item.price.toLocaleString()} تومان
        </div>
      </div>

      <div className="text-sm text-neutral-300">×{item.qty}</div>

      <button
        onClick={() => remove(item.id)}
        className="
        text-xs
        px-2 py-1
        rounded
        bg-red-500/20
        text-red-400
        "
      >
        حذف
      </button>
    </motion.div>
  );
}
