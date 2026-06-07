"use client";

import PosProductCard from "./pos-product-card";
import { usePosStore } from "../store/use-pos-store";

export default function PosProductGrid() {
  const products = usePosStore((s) => s.products);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {products.map((p) => (
        <PosProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
