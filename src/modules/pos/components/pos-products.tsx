"use client";

import { motion } from "framer-motion";
import { usePosStore } from "../store/use-pos-store";
import PosProductCard from "./pos-product-card";

export default function PosProducts() {
  const { products, category } = usePosStore();

  const filtered =
    category === null
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {filtered.map((product) => (
        <motion.div
          key={product.id}
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <PosProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
