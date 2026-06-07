"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "../store/use-pos-store";
import { usePosStore } from "../store/use-pos-store";
import { useState } from "react";
import PosModifierModal from "./pos-modifier-modal";

export default function PosProductCard({ product }: { product: Product }) {
  const addToCart = usePosStore((s) => s.addToCart);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (product.modifiers?.length) {
      setOpen(true);
    } else {
      addToCart(product);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{
          y: -8,
          scale: 1.02,
        }}
        whileTap={{
          scale: 0.95,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
        }}
        onClick={handleClick}
        className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border border-white/10
        bg-white/5
        backdrop-blur-2xl
        shadow-[0_20px_80px_rgba(0,0,0,0.45)]
        cursor-pointer
        "
      >
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={product.image || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className="
            object-cover
            transition-transform
            duration-700
            group-hover:scale-125
            "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-emerald-400 backdrop-blur">
            {product.price.toLocaleString()} تومان
          </div>
        </div>

        <div className="p-4">
          <div className="text-sm font-semibold text-white">{product.name}</div>

          {product.description && (
            <div className="mt-1 text-xs text-neutral-400 line-clamp-2">
              {product.description}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-neutral-500">{product.category}</div>

            <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400">
              افزودن
            </div>
          </div>
        </div>
      </motion.div>

      <PosModifierModal
        product={product}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
