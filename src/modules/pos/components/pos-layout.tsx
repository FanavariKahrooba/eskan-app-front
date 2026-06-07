"use client";

import PosCart from "./pos-cart";
import PosProductGrid from "./pos-product-grid";
import PosTabs from "./pos-tabs";

export default function PosLayout() {
  return (
    <div className="h-screen w-full bg-neutral-950 text-white">
      <div className="grid h-full grid-cols-[1fr_340px]">
        <div className="flex flex-col p-6">
          <PosTabs />

          <div className="mt-4 flex-1 overflow-auto">
            <PosProductGrid />
          </div>
        </div>

        <div className="border-l border-white/10 p-5">
          <PosCart />
        </div>
      </div>
    </div>
  );
}
